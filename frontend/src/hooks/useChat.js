import { useState, useCallback } from "react"
import { streamChat } from "../utils/api"
import { toGeminiHistory } from "../utils/formatters"

export function useChat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Halo! Saya AdvokasiKu, pendamping hukum AI kamu 👋\n\nCeritakan masalah hukum yang kamu hadapi — boleh pakai bahasa apapun, saya akan bantu jelaskan hak kamu dan langkah yang bisa ditempuh.\n\n_Contoh: \"Saya di-PHK mendadak tanpa pesangon\", \"Saya ditipu beli barang online\", dll._",
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const sendMessage = useCallback(async (userText) => {
    if (!userText.trim() || isLoading) return

    const userMsg = { role: "user", content: userText }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setIsLoading(true)
    setError(null)

    // Siapkan history untuk Gemini (semua kecuali pesan terakhir user)
    const history = toGeminiHistory(messages)

    // Tambah placeholder untuk streaming
    const assistantMsg = { role: "assistant", content: "" }
    setMessages([...newMessages, assistantMsg])

    try {
      let fullText = ""
      for await (const chunk of streamChat(userText, history)) {
        fullText += chunk
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: "assistant", content: fullText }
          return updated
        })
      }
    } catch (e) {
      setError("Gagal menghubungi server. Coba lagi.")
      setMessages(prev => prev.slice(0, -1)) // Hapus placeholder
    } finally {
      setIsLoading(false)
    }
  }, [messages, isLoading])

  const clearChat = useCallback(() => {
    setMessages([{
      role: "assistant",
      content: "Halo! Saya AdvokasiKu. Ada masalah hukum baru yang mau kamu ceritakan?"
    }])
  }, [])

  return { messages, isLoading, error, sendMessage, clearChat }
}
