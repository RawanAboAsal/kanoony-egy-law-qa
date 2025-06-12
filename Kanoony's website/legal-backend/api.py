# api.py
import json, numpy as np, faiss, tiktoken # type: ignore
from fastapi import FastAPI, HTTPException # type: ignore
from fastapi.responses import StreamingResponse # type: ignore
from pydantic import BaseModel # type: ignore
from openai import AzureOpenAI # type: ignore
import logging
from fastapi.middleware.cors import CORSMiddleware # type: ignore

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# ── Load data & build FAISS index ───────────────────────────────────────────────
with open("articles.json", encoding="utf-8") as f:
    articles = json.load(f)
embeddings = np.load("law_embeddings.npy")
dim = embeddings.shape[1]
index = faiss.IndexFlatL2(dim)
index.add(embeddings)

# ── Azure OpenAI client & tokenizer ──────────────────────────────────────────────
# Azure OpenAI setup
client = AzureOpenAI(
    azure_endpoint="https://eslsca-openai.openai.azure.com/",
    api_key="",
    api_version="2024-05-01-preview",
)

tokenizer = tiktoken.encoding_for_model("text-embedding-3-small")
MAX_TOKENS = 8191

def embed_query(text: str):
    if len(tokenizer.encode(text)) > MAX_TOKENS:
        raise ValueError("Query too long")
    resp = client.embeddings.create(input=[text], model="text-embedding-3-small")
    return np.array(resp.data[0].embedding).reshape(1, -1)

def search(query: str, top_k: int = 3):
    q_emb = embed_query(query)
    _, ids = index.search(q_emb, top_k)
    return [articles[i]["Law_Text"] for i in ids[0]]


# ── Your system prompt ───────────────────────────────────────
SYS_PROMPT = """
You are a highly skilled legal assistant specialized in Egyptian law.

Your tasks:
- If the user says anything that is not a legal question (greeting, small talk, etc.), reply in Arabic:
مرحبًا! كيف أستطيع مساعدتك اليوم في استفسار قانوني؟

- If the user asks a legal question:
    - Automatically determine the correct relevant law name, article number, and law type (criminal, civil, administrative, etc.).
    - Clearly identify the article number, law name, and law type.
    - Provide a detailed and legally sound answer based strictly on the article's content and Egyptian legal principles.
    - Inside the explanation, if it improves clarity, you may use bullet points (•) in Arabic to organize information.
    - Bullet points must only appear inside the detailed answer, never outside or before starting the response.

Format your response in Arabic, starting exactly like this:
طبقًا للمادة [رقم المادة] من قانون [اسم القانون]، [نوع القانون]، [الإجابة التفصيلية].

Rules:
- Begin always with the sentence: طبقًا للمادة [رقم المادة] من قانون [اسم القانون]، [نوع القانون]، then continue.
- Use plain Arabic text only — no English, no asterisks (*), no markdown, no code block formatting.
- Bullet points inside the answer must use (•) and be clear and well-organized.
- The legal explanation must be sufficiently detailed and professional.
- Ensure the law, article, and law type are accurate.
"""

# def call_gpt_azure(sys_p, user_p):
#     msgs = [
#         {"role":"system", "content":sys_p},
#         {"role":"user",   "content":user_p},
#     ]
#     completion = client.chat.completions.create(
#         model="gpt-4o-mini",
#         messages=msgs,
#         temperature=0.0,
#         # max_tokens=300,
#         top_p=0.95,
#         frequency_penalty=0,
#         presence_penalty=0,
#         stop=None,
#     )
#     return completion.choices[0].message.content


# ── FastAPI app & Pydantic models ───────────────────────────
app = FastAPI()

# Allow calls from your React dev server
origins = [
    "http://localhost:3000",
    # add your production domain here later
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],            # <-- allow all origins
    allow_credentials=True,
    allow_methods=["*"],            # <-- allow GET, POST, OPTIONS, etc.
    allow_headers=["*"],            # <-- allow any header
)

class Question(BaseModel):
    question: str

class Answer(BaseModel):
    answer: str


# @app.post("/legal-advice", response_model=Answer)
# async def legal_advice(q: Question):
#     try:
#         # 1) retrieve contexts
#         ctxs = search(q.question, top_k=3)
#         merged = "\n\n".join(ctxs)
#         # 2) build the prompt
#         user_prompt = f"المحتوى:\n{merged}\n\nالسؤال:\n{q.question}"
#         # 3) call GPT
#         raw = call_gpt_azure(SYS_PROMPT, user_prompt)
#         # 4) return it directly
#         return Answer(answer=raw.strip())
#     except Exception as e:
#         logger.exception("Error in /legal-advice")
#         raise HTTPException(500, detail=str(e))


@app.post("/legal-advice-stream")
async def legal_advice_stream(q: Question):
    try:
        # 1) retrieve contexts
        ctxs = search(q.question, top_k=3)
        merged = "\n\n".join(ctxs)
        user_prompt = f"المحتوى:\n{merged}\n\nالسؤال:\n{q.question}"

        # 2) call GPT with streaming
        def token_generator():
            stream = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": SYS_PROMPT},
                    {"role": "user",   "content": user_prompt},
                ],
                temperature=0.0,
                top_p=0.95,
                stream=True,
            )
            # each chunk may have multiple choices, we only care about 'content' deltas
            for chunk in stream:
                for choice in chunk.choices:
                    delta = choice.delta
                    if hasattr(delta, "content"):
                        yield delta.content

        return StreamingResponse(token_generator(), media_type="text/plain")
    except Exception as e:
        logger.exception("Error in /legal-advice-stream")
        raise HTTPException(500, detail=str(e))

