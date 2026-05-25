from fastapi import APIRouter, Query

router = APIRouter()

# Data LBH statis — bisa diganti dengan DB atau API Google Places
LBH_DATA = [
    {"nama": "LBH Jakarta", "kota": "Jakarta", "telp": "021-3145518", "alamat": "Jl. Diponegoro No.74, Jakarta Pusat", "lat": -6.1944, "lng": 106.8425},
    {"nama": "LBH Surabaya", "kota": "Surabaya", "telp": "031-5039527", "alamat": "Jl. Kidal No.6, Surabaya", "lat": -7.2574, "lng": 112.7521},
    {"nama": "LBH Bandung", "kota": "Bandung", "telp": "022-4230088", "alamat": "Jl. Taman Sari No.57, Bandung", "lat": -6.8976, "lng": 107.6113},
    {"nama": "LBH Yogyakarta", "kota": "Yogyakarta", "telp": "0274-554857", "alamat": "Jl. Ngeksigondo No.58, Yogyakarta", "lat": -7.8178, "lng": 110.3863},
    {"nama": "LBH Semarang", "kota": "Semarang", "telp": "024-8412335", "alamat": "Jl. Erlangga Tengah No.1B, Semarang", "lat": -7.0060, "lng": 110.4184},
    {"nama": "LBH Medan", "kota": "Medan", "telp": "061-4155441", "alamat": "Jl. Sei Batang Serangan No.11, Medan", "lat": 3.5952, "lng": 98.6722},
    {"nama": "LBH Makassar", "kota": "Makassar", "telp": "0411-853668", "alamat": "Jl. Pelita Raya I No.19, Makassar", "lat": -5.1477, "lng": 119.4327},
    {"nama": "LBH APIK Jakarta", "kota": "Jakarta", "telp": "021-7884910", "alamat": "Jl. Raya Tengah No.8, Jakarta Timur", "lat": -6.2768, "lng": 106.9017},
]

@router.get("/")
def get_lbh(kota: str = Query(default="", description="Filter berdasarkan kota")):
    if kota:
        filtered = [l for l in LBH_DATA if kota.lower() in l["kota"].lower()]
        return filtered if filtered else LBH_DATA[:3]
    return LBH_DATA
