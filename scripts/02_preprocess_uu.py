"""
Script 02: Ekstrak teks dari PDF UU dan potong per pasal.
Jalankan: python scripts/02_preprocess_uu.py
Output: scripts/chunks.json
"""
import PyPDF2
import re
import json
import os
import sys

UU_FILES = {
    "UU_13_2003_Ketenagakerjaan": "backend/data/uu_pdfs/uu_ketenagakerjaan.pdf",
    "UU_8_1999_Konsumen": "backend/data/uu_pdfs/uu_konsumen.pdf",
    "UU_19_2016_ITE": "backend/data/uu_pdfs/uu_ite.pdf",
    "PP_35_2021_PKWT": "backend/data/uu_pdfs/pp_35_2021.pdf",
}

def extract_text_from_pdf(path: str) -> str:
    text = ""
    try:
        with open(path, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            for i, page in enumerate(reader.pages):
                page_text = page.extract_text() or ""
                text += page_text + "\n"
        return text
    except Exception as e:
        print(f"  ERROR membaca {path}: {e}")
        return ""

def chunk_by_pasal(text: str, uu_name: str) -> list:
    """Potong teks per pasal. Lebih akurat dari chunking per N karakter."""
    chunks = []

    # Cari semua "Pasal X" sebagai delimiter
    pattern = r'(Pasal\s+\d+(?:\s+[A-Z])?)'
    parts = re.split(pattern, text)

    current_pasal = "Pembukaan"
    current_text = parts[0] if parts else ""

    for i in range(1, len(parts), 2):
        # Simpan chunk sebelumnya
        if len(current_text.strip()) > 50:  # Skip chunk terlalu pendek
            chunks.append({
                "id": f"{uu_name}_{current_pasal.replace(' ', '_')}",
                "text": f"{current_pasal}\n{current_text.strip()}",
                "metadata": {
                    "source": uu_name,
                    "pasal": current_pasal
                }
            })

        current_pasal = parts[i].strip()
        current_text = parts[i+1] if i+1 < len(parts) else ""

    # Simpan pasal terakhir
    if current_text.strip():
        chunks.append({
            "id": f"{uu_name}_{current_pasal.replace(' ', '_')}",
            "text": f"{current_pasal}\n{current_text.strip()}",
            "metadata": {"source": uu_name, "pasal": current_pasal}
        })

    return chunks

def main():
    all_chunks = []
    skipped = []

    for uu_name, pdf_path in UU_FILES.items():
        if not os.path.exists(pdf_path):
            print(f"⚠️  SKIP: {pdf_path} tidak ditemukan")
            skipped.append(uu_name)
            continue

        print(f"📄 Memproses {uu_name}...")
        text = extract_text_from_pdf(pdf_path)
        if not text:
            continue

        chunks = chunk_by_pasal(text, uu_name)
        all_chunks.extend(chunks)
        print(f"   ✅ {len(chunks)} pasal diekstrak")

    # Simpan ke JSON
    output_path = "scripts/chunks.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(all_chunks, f, ensure_ascii=False, indent=2)

    print(f"\n✅ Total: {len(all_chunks)} chunks")
    print(f"💾 Disimpan ke: {output_path}")
    if skipped:
        print(f"⚠️  Di-skip ({len(skipped)} UU): {', '.join(skipped)}")
        print("   → Download PDF dulu ke backend/data/uu_pdfs/")

if __name__ == "__main__":
    main()
