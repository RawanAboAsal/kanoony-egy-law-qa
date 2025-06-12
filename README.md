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


```
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
