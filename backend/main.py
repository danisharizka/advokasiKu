from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from dotenv import load_dotenv
import os

from routers import chat, document, lbh
from services.rag_service import init_rag

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: inisialisasi ChromaDB & embedding model
    print("Memuat knowledge base hukum...")
    init_rag()
    print("Knowledge base siap!")
    yield
    # Shutdown (cleanup jika perlu)

app = FastAPI(
    title="AdvokasiKu API",
    description="Pendamping hukum AI untuk masyarakat Indonesia",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Ganti dengan domain frontend di production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(document.router, prefix="/api/document", tags=["document"])
app.include_router(lbh.router, prefix="/api/lbh", tags=["lbh"])

@app.get("/")
def root():
    return {"status": "ok", "app": "AdvokasiKu", "version": "1.0.0"}

@app.get("/health")
def health():
    return {"status": "healthy"}
