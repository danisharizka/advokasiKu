# Panduan Download UU

## Sumber resmi (gratis, PDF)
- https://peraturan.go.id — situs resmi JDIH pemerintah
- https://jdih.kemenkumham.go.id — Kemenkumham

## File yang perlu didownload

| File | Cari dengan kata kunci | Simpan sebagai |
|------|----------------------|----------------|
| UU No. 13 Tahun 2003 | "UU 13 2003 Ketenagakerjaan" | `uu_ketenagakerjaan.pdf` |
| UU No. 8 Tahun 1999 | "UU 8 1999 Perlindungan Konsumen" | `uu_konsumen.pdf` |
| UU No. 19 Tahun 2016 | "UU 19 2016 ITE" | `uu_ite.pdf` |
| PP No. 35 Tahun 2021 | "PP 35 2021 PKWT" | `pp_35_2021.pdf` |

## Simpan semua ke folder: `backend/data/uu_pdfs/`

## Setelah download
```bash
python scripts/02_preprocess_uu.py
python scripts/03_build_vectordb.py
python scripts/04_test_retrieval.py  # Verifikasi
```
