# AdvokasiKu — Pendamping Hukum AI

Pendamping hukum berbasis AI untuk masyarakat Indonesia. Input bebas dalam bahasa apapun (Jawa, Sunda, Melayu, Indonesia), output: penjelasan hak, pasal relevan, dan generator surat resmi siap download.

## Tech Stack
- **AI**: Google Gemini 1.5 Flash (via Google AI Studio)
- **Backend**: FastAPI + Python, ChromaDB (RAG), Sentence Transformers
- **Frontend**: React + Vite + Tailwind CSS
- **Deploy**: Google Cloud Run (backend) + Vercel (frontend)

## API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/chat/` | Streaming chat dengan Gemini + RAG |
| POST | `/api/document/generate` | Generate surat .docx |
| GET | `/api/lbh/` | Daftar LBH, filter by `?kota=Surabaya` |
| GET | `/health` | Health check |

## Lisensi
MIT — bebas dipakai dan dikembangkan.
