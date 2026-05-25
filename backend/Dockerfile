FROM python:3.11-slim

WORKDIR /app

# Install dependencies dulu (layer cache)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy ChromaDB yang sudah diisi di lokal (hasil script 03)
COPY chroma_db/ ./chroma_db/

# Copy source code
COPY . .

EXPOSE 8080
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
