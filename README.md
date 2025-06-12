# 🇪🇬 Kanoony: Egyptian Legal Assistant

**Kanoony** is an AI-powered legal assistant tailored to Egyptian law. It provides accurate legal information and answers in Arabic by processing and understanding official legal documents. The system supports OCR, parsing, intelligent information retrieval, and real-time Q&A via OpenAI's GPT models.

---

##  Features

- **Arabic Legal Q&A** powered by GPT-4
- **IR Benchmarking** for evaluating retrieval performance
- **OCR + Parsing** of scanned legal PDFs
- **Text Chunking & Embedding** for retrieval-augmented generation (RAG)
- **FAISS-based Semantic Search** for fast and relevant legal text lookup
- **Modern Web Interface** built with React and TypeScript
- **Streaming Support** for smooth conversational experience

---

## Project Structure

```bash
.
├── PDF'sDownload,OCR,Parsing&Chunking.ipynb   # OCR and structure legal docs
├── Parsing Raw Text.ipynb                     # Clean and segment raw Arabic legal text
├── IR Benchmarking.ipynb                      # Evaluate IR results (MAP, MRR, NDCG)
├── Different Models for QA .ipynb             # Compare LLMs for Q&A (OpenAI, etc.)


```bash
.
├── frontend/               # React + TypeScript frontend application
│   ├── src/               # Source code
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
│
├── legal-backend/         # FastAPI backend application
│   ├── api.py            # Main API implementation
│   ├── articles.json     # Legal articles database
│   └── law_embeddings.npy # Pre-computed embeddings
│
└── requirements.txt       # Python dependencies
```

## Prerequisites

- Python 3.10.11 (strictly recommended for compatibility)
- Node.js 16 or higher
- npm or yarn
- Azure OpenAI API access


## Setup

### Backend Setup

1. Create a virtual environment:
   ```bash
   cd legal-backend
   python3.10 -m venv .venv
   .venv\Scripts\Activate.ps1
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   Create a `.env` file in the `legal-backend` directory with:
   ```
   AZURE_OPENAI_API_KEY=
   AZURE_OPENAI_ENDPOINT=https://eslsca-openai.openai.azure.com/
   AZURE_OPENAI_API_VERSION=2024-05-01-preview
   ```

4. Start the backend server:
   ```bash
   uvicorn api:app --reload --host 127.0.0.1 --port 4000 --log-level debug
   ```

### Frontend Setup

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Type your legal question in Arabic
3. The system will provide a detailed legal response based on relevant Egyptian laws

## API Endpoints

- `POST /legal-advice-stream`: Streams legal advice based on user questions
  - Request body: `{ "question": "your legal question in Arabic" }`
  - Response: Streaming text response

## Acknowledgments

- Egyptian Legal System
- Azure OpenAI
- FastAPI
- React
- FAISS
