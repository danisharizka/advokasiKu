# AdvokasiKu — Pendamping Hukum AI

Pendamping hukum berbasis AI untuk masyarakat Indonesia. Input bebas dalam bahasa apapun (Jawa, Sunda, Melayu, Indonesia), output: penjelasan hak, pasal relevan, dan generator surat resmi siap download.

## Tech Stack
- **AI**: Google Gemini 1.5 Flash (via Google AI Studio)
- **Backend**: FastAPI + Python, ChromaDB (RAG), Sentence Transformers
- **Frontend**: React + Vite + Tailwind CSS
- **Deploy**: Google Cloud Run (backend) + Vercel (frontend)

## Struktur Repo
```
advokasiKu/
├── backend/                 # FastAPI API server
│   ├── main.py              # Entry point
│   ├── system_prompt.txt    # System prompt Gemini
│   ├── routers/
│   │   ├── chat.py          # POST /api/chat/
│   │   ├── document.py      # POST /api/document/generate
│   │   └── lbh.py           # GET /api/lbh/
│   ├── services/
│   │   ├── gemini_service.py   # Wrapper Gemini API
│   │   ├── rag_service.py      # ChromaDB retrieval
│   │   └── doc_generator.py    # Generator .docx
│   ├── data/uu_pdfs/        # Taruh PDF UU di sini (tidak di-commit)
│   ├── chroma_db/           # Hasil build vector DB (tidak di-commit)
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/                # React app
│   ├── src/
│   │   ├── components/      # ChatWindow, MessageBubble, dll
│   │   ├── hooks/           # useChat (streaming state)
│   │   └── utils/           # api.js, formatters.js
│   ├── package.json
│   └── Dockerfile
├── scripts/
│   ├── 01_download_guide.md # Panduan download UU
│   ├── 02_preprocess_uu.py  # Ekstrak teks dari PDF
│   ├── 03_build_vectordb.py # Buat ChromaDB embedding
│   └── 04_test_retrieval.py # Verifikasi RAG
├── docker-compose.yml
└── README.md
```

## Setup dari Nol

### 1. Clone & siapkan environment
```bash
git clone https://github.com/USERNAME/advokasiKu.git
cd advokasiKu

# Backend env
cp backend/.env.example backend/.env
# Edit backend/.env: isi GEMINI_API_KEY dari https://aistudio.google.com/app/apikey
```

### 2. Download UU (baca scripts/01_download_guide.md)
```bash
# Download dari peraturan.go.id lalu simpan ke:
backend/data/uu_pdfs/uu_ketenagakerjaan.pdf
backend/data/uu_pdfs/uu_konsumen.pdf
backend/data/uu_pdfs/uu_ite.pdf
backend/data/uu_pdfs/pp_35_2021.pdf
```

### 3. Build knowledge base (lakukan sekali di lokal)
```bash
pip install pypdf2 sentence-transformers chromadb
python scripts/02_preprocess_uu.py
python scripts/03_build_vectordb.py
python scripts/04_test_retrieval.py  # Verifikasi output
```

### 4. Jalankan backend (dev)
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8080
# → http://localhost:8080/docs (Swagger UI)
```

### 5. Jalankan frontend (dev)
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
# → http://localhost:5173
```

### 6. Deploy backend ke Google Cloud Run
```bash
cd backend

# Build & push image
gcloud builds submit --tag gcr.io/PROJECT_ID/advokasiKu-backend

# Deploy
gcloud run deploy advokasiKu-backend \
  --image gcr.io/PROJECT_ID/advokasiKu-backend \
  --platform managed \
  --region asia-southeast2 \
  --allow-unauthenticated \
  --memory 2Gi \
  --set-env-vars GEMINI_API_KEY=your_key
```

### 7. Deploy frontend ke Vercel
```bash
cd frontend
# Edit .env: VITE_API_URL=https://URL_CLOUD_RUN_KAMU
npm run build
npx vercel --prod
```

## API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/chat/` | Streaming chat dengan Gemini + RAG |
| POST | `/api/document/generate` | Generate surat .docx |
| GET | `/api/lbh/` | Daftar LBH, filter by `?kota=Surabaya` |
| GET | `/health` | Health check |

## Lisensi
MIT — bebas dipakai dan dikembangkan.
