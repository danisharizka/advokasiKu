"""
Script 03: Buat embedding dan masukkan ke ChromaDB.
Jalankan SETELAH script 02.
Jalankan: python scripts/03_build_vectordb.py
Output: backend/chroma_db/ (folder vector database)
"""
import chromadb
from sentence_transformers import SentenceTransformer
import json
import os
import time

CHUNKS_PATH = "scripts/chunks.json"
CHROMA_PATH = "backend/chroma_db"
MODEL_NAME = "paraphrase-multilingual-MiniLM-L12-v2"
BATCH_SIZE = 50  # Proses sekaligus N chunks

def main():
    # Load chunks
    if not os.path.exists(CHUNKS_PATH):
        print(f"❌ {CHUNKS_PATH} tidak ditemukan. Jalankan script 02 dulu!")
        return

    with open(CHUNKS_PATH, "r", encoding="utf-8") as f:
        chunks = json.load(f)
    print(f"📚 Loaded {len(chunks)} chunks dari {CHUNKS_PATH}")

    # Load embedding model
    print(f"\n🤖 Loading model: {MODEL_NAME}")
    print("   (Download ~120MB pertama kali, harap tunggu...)")
    model = SentenceTransformer(MODEL_NAME)
    print("   ✅ Model siap")

    # Init ChromaDB
    os.makedirs(CHROMA_PATH, exist_ok=True)
    client = chromadb.PersistentClient(path=CHROMA_PATH)

    # Reset collection jika sudah ada (untuk rebuild bersih)
    try:
        client.delete_collection("hukum_indonesia")
        print("🗑️  Collection lama dihapus (rebuild bersih)")
    except:
        pass

    collection = client.create_collection(
        name="hukum_indonesia",
        metadata={"hnsw:space": "cosine"}
    )

    # Proses dalam batch
    print(f"\n⚙️  Membuat embeddings ({len(chunks)} chunks, batch={BATCH_SIZE})...")
    start = time.time()

    for i in range(0, len(chunks), BATCH_SIZE):
        batch = chunks[i:i+BATCH_SIZE]

        ids = [c["id"] for c in batch]
        texts = [c["text"] for c in batch]
        metadatas = [c["metadata"] for c in batch]

        embeddings = model.encode(texts, show_progress_bar=False).tolist()

        collection.add(
            ids=ids,
            embeddings=embeddings,
            documents=texts,
            metadatas=metadatas
        )

        done = min(i + BATCH_SIZE, len(chunks))
        pct = int(done / len(chunks) * 100)
        elapsed = time.time() - start
        print(f"   [{pct:3d}%] {done}/{len(chunks)} chunks — {elapsed:.0f}s")

    total_time = time.time() - start
    print(f"\n✅ Selesai! {collection.count()} pasal tersimpan di {CHROMA_PATH}")
    print(f"⏱️  Total waktu: {total_time:.0f} detik")
    print(f"\n🚀 Sekarang kamu bisa jalankan backend:")
    print(f"   cd backend && uvicorn main:app --reload")

if __name__ == "__main__":
    main()
