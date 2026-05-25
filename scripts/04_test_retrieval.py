"""
Script 04: Test apakah retrieval berjalan dengan benar.
Jalankan: python scripts/04_test_retrieval.py
"""
import chromadb
from sentence_transformers import SentenceTransformer

CHROMA_PATH = "backend/chroma_db"
MODEL_NAME = "paraphrase-multilingual-MiniLM-L12-v2"

TEST_QUERIES = [
    "Berapa pesangon yang berhak saya terima setelah di-PHK?",
    "Saya ditipu beli barang online, bisa lapor ke mana?",
    "Kontrak kerja saya habis tapi tidak diperpanjang, apa hak saya?",
    "Gimana cara laporin pencemaran nama baik di medsos?",
]

def main():
    print(f"🔍 Test Retrieval AdvokasiKu\n{'='*50}")

    model = SentenceTransformer(MODEL_NAME)
    client = chromadb.PersistentClient(path=CHROMA_PATH)
    collection = client.get_collection("hukum_indonesia")

    print(f"📚 Database: {collection.count()} chunks\n")

    for query in TEST_QUERIES:
        print(f"❓ Query: {query}")
        embedding = model.encode(query).tolist()
        results = collection.query(
            query_embeddings=[embedding],
            n_results=3,
            include=["documents", "metadatas", "distances"]
        )
        for doc, meta, dist in zip(
            results["documents"][0],
            results["metadatas"][0],
            results["distances"][0]
        ):
            relevance = "🟢 Relevan" if dist < 0.4 else ("🟡 Cukup" if dist < 0.6 else "🔴 Kurang")
            print(f"   {relevance} ({dist:.2f}) [{meta['source']} — {meta['pasal']}]")
            print(f"   {doc[:120]}...")
        print()

if __name__ == "__main__":
    main()
