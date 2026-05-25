import chromadb
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv
import os

load_dotenv()

_client = None
_collection = None
_model = None

def init_rag():
    """Inisialisasi ChromaDB dan embedding model. Dipanggil sekali saat startup."""
    global _client, _collection, _model

    model_name = os.getenv("EMBEDDING_MODEL", "paraphrase-multilingual-MiniLM-L12-v2")
    db_path = os.getenv("CHROMA_DB_PATH", "./chroma_db")

    print(f"Loading embedding model: {model_name}")
    _model = SentenceTransformer(model_name)

    print(f"Connecting to ChromaDB at: {db_path}")
    _client = chromadb.PersistentClient(path=db_path)
    _collection = _client.get_or_create_collection(
        name="hukum_indonesia",
        metadata={"hnsw:space": "cosine"}
    )
    print(f"ChromaDB ready. Total chunks: {_collection.count()}")

def cari_pasal_relevan(query: str, top_k: int = 5) -> str:
    """
    Cari pasal yang paling relevan dengan pertanyaan user.
    Return: string konteks siap pakai untuk dikirim ke Gemini.
    """
    if _collection is None or _model is None:
        return ""

    if _collection.count() == 0:
        return ""

    query_embedding = _model.encode(query).tolist()

    results = _collection.query(
        query_embeddings=[query_embedding],
        n_results=min(top_k, _collection.count()),
        include=["documents", "metadatas", "distances"]
    )

    if not results["documents"][0]:
        return ""

    konteks_parts = []
    for doc, meta, dist in zip(
        results["documents"][0],
        results["metadatas"][0],
        results["distances"][0]
    ):
        # Hanya pakai jika similarity cukup (distance < 0.6)
        if dist < 0.6:
            source = meta.get("source", "UU")
            pasal = meta.get("pasal", "")
            konteks_parts.append(f"[{source} — {pasal}]\n{doc[:600]}")

    if not konteks_parts:
        return ""

    return "REFERENSI HUKUM RELEVAN (gunakan sebagai dasar jawaban):\n\n" + \
           "\n\n---\n\n".join(konteks_parts)

def get_db_stats() -> dict:
    if _collection is None:
        return {"status": "not_initialized"}
    return {
        "status": "ready",
        "total_chunks": _collection.count()
    }
