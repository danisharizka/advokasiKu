const BASE_URL = import.meta.env.VITE_API_URL || ""

export async function* streamChat(message, history) {
  const res = await fetch(`${BASE_URL}/api/chat/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    yield decoder.decode(value, { stream: true })
  }
}

export async function generateDoc(rawResponse) {
  const res = await fetch(`${BASE_URL}/api/document/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ raw_response: rawResponse }),
  })
  if (!res.ok) throw new Error("Gagal generate dokumen")
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "AdvokasiKu_surat.docx"
  a.click()
  URL.revokeObjectURL(url)
}

export async function getLBH(kota = "") {
  const res = await fetch(`${BASE_URL}/api/lbh/?kota=${encodeURIComponent(kota)}`)
  return res.json()
}
