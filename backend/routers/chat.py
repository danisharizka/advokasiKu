from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from services.gemini_service import stream_chat
from services.rag_service import cari_pasal_relevan

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    history: list = []

@router.post("/")
async def chat(req: ChatRequest):
    # 1. Cari pasal relevan dari ChromaDB
    konteks = cari_pasal_relevan(req.message)

    # 2. Stream response dari Gemini
    def generate():
        for chunk in stream_chat(req.message, req.history, konteks):
            yield chunk

    return StreamingResponse(generate(), media_type="text/plain; charset=utf-8")

@router.get("/stats")
def stats():
    from services.rag_service import get_db_stats
    return get_db_stats()
