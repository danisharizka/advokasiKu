export function toGeminiHistory(messages) {
  // Konversi format internal [{role, content}] ke format Gemini [{role, parts:[]}]
  return messages
    .filter(m => m.role !== "system")
    .map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }))
}

export function detectDocJson(text) {
  // Cek apakah ada JSON generate_document dalam teks
  return text.includes('"action": "generate_document"') ||
         text.includes('"action":"generate_document"')
}

export function extractRiskLevel(text) {
  if (text.includes("TINGGI") || text.includes("🔴")) return "high"
  if (text.includes("SEDANG") || text.includes("🟡")) return "medium"
  if (text.includes("RENDAH") || text.includes("🟢")) return "low"
  return null
}
