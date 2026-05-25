import { useEffect, useRef, useState } from "react"
import { MessageBubble } from "./MessageBubble"
import { useChat } from "../hooks/useChat"
import { Send, Loader2, Trash2, MapPin } from "lucide-react"
import { getLBH } from "../utils/api"

const QUICK_PROMPTS = [
  "Saya di-PHK tanpa pesangon, apa hak saya?",
  "Saya ditipu beli barang online 2 juta",
  "Kontrak kerja habis tidak diperpanjang",
  "Atasan saya memfitnah saya di grup WA kantor",
]

export function ChatWindow() {
  const { messages, isLoading, error, sendMessage, clearChat } = useChat()
  const [input, setInput] = useState("")
  const [showLBH, setShowLBH] = useState(false)
  const [lbhList, setLbhList] = useState([])
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  function handleSubmit(e) {
    e.preventDefault()
    if (!input.trim()) return
    sendMessage(input)
    setInput("")
  }

  async function toggleLBH() {
    if (!showLBH && lbhList.length === 0) {
      const data = await getLBH()
      setLbhList(data)
    }
    setShowLBH(v => !v)
  }

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">A</div>
          <div>
            <p className="font-semibold text-sm text-gray-900">AdvokasiKu</p>
            <p className="text-xs text-gray-400">Pendamping Hukum AI • 24/7</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleLBH} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors">
            <MapPin size={14} /> LBH Terdekat
          </button>
          <button onClick={clearChat} className="text-gray-400 hover:text-gray-600 p-1 rounded">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* LBH Panel */}
      {showLBH && (
        <div className="bg-blue-50 border-b border-blue-100 px-4 py-3">
          <p className="text-xs font-semibold text-blue-800 mb-2">LBH (Lembaga Bantuan Hukum) — Gratis</p>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {lbhList.map((l, i) => (
              <div key={i} className="text-xs text-blue-900 bg-white rounded-lg px-3 py-2 border border-blue-100">
                <span className="font-medium">{l.nama}</span> — {l.kota} — {l.telp}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick prompts (hanya di awal) */}
      {messages.length <= 1 && (
        <div className="px-4 pt-4 pb-2">
          <p className="text-xs text-gray-400 mb-2 font-medium">Contoh pertanyaan:</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((p, i) => (
              <button key={i} onClick={() => sendMessage(p)}
                className="text-xs bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full px-3 py-1.5 text-gray-700 transition-colors">
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50">
        {messages.map((m, i) => <MessageBubble key={i} message={m} />)}
        {isLoading && messages[messages.length-1]?.content === "" && (
          <div className="flex gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Loader2 size={14} className="text-blue-500 animate-spin" />
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1">
                {[0,1,2].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{animationDelay:`${i*0.15}s`}} />
                ))}
              </div>
            </div>
          </div>
        )}
        {error && <p className="text-center text-xs text-red-500 py-2">{error}</p>}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="px-4 py-3 bg-white border-t border-gray-100">
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(e) } }}
            placeholder="Ceritakan masalah kamu... (Enter untuk kirim)"
            rows={2}
            className="flex-1 resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent
                       placeholder:text-gray-400"
          />
          <button type="submit" disabled={isLoading || !input.trim()}
            className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center
                       justify-center disabled:opacity-50 transition-colors flex-shrink-0">
            <Send size={16} />
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1.5 text-center">
          AdvokasiKu bukan pengacara. Untuk kasus serius, konsultasikan ke LBH.
        </p>
      </form>
    </div>
  )
}
