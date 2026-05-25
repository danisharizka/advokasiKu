from fastapi import APIRouter
from fastapi.responses import Response
from pydantic import BaseModel
from services.doc_generator import generate_docx
import json, re

router = APIRouter()

class DocRequest(BaseModel):
    raw_response: str  # Full teks respons dari Gemini yang berisi JSON

@router.post("/generate")
def generate_document(req: DocRequest):
    # Ekstrak JSON dari response Gemini (ada di antara ```json ... ```)
    match = re.search(r"```json\s*(\{.*?\})\s*```", req.raw_response, re.DOTALL)
    if not match:
        # Coba parse langsung jika tidak ada backtick
        match = re.search(r'(\{"action".*?\})', req.raw_response, re.DOTALL)

    if not match:
        return {"error": "Tidak ada data dokumen dalam respons"}

    try:
        doc_data = json.loads(match.group(1))
    except json.JSONDecodeError:
        return {"error": "Format JSON tidak valid"}

    # Generate .docx
    docx_bytes = generate_docx(doc_data)

    perihal = doc_data.get("data", {}).get("perihal", "surat")
    filename = f"AdvokasiKu_{perihal[:30].replace(' ', '_')}.docx"

    return Response(
        content=docx_bytes,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )
