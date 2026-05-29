import { useEffect, useRef, useState } from "react"
import { MessageBubble } from "./MessageBubble"
import { useChat } from "../hooks/useChat"
import { getLBH } from "../utils/api"

const QUICK_PROMPTS = [
  "Saya di-PHK tanpa pesangon, apa hak saya?",
  "Ditipu beli barang online, uang tidak kembali",
  "Kontrak kerja habis tapi tidak ada pemberitahuan",
  "Atasan memfitnah saya di grup WhatsApp kantor",
]

export function ChatWindow() {
  const { messages, isLoading, error, sendMessage, clearChat } = useChat()
  const [input, setInput] = useState("")
  const [showLBH, setShowLBH] = useState(false)
  const [lbhList, setLbhList] = useState([])
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  function handleSubmit(e) {
    e?.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage(input)
    setInput("")
    textareaRef.current?.focus()
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  function autoResize(e) {
    const el = e.target
    el.style.height = "auto"
    el.style.height = Math.min(el.scrollHeight, 120) + "px"
    setInput(el.value)
  }

  async function toggleLBH() {
    if (!showLBH && lbhList.length === 0) {
      const data = await getLBH()
      setLbhList(data)
    }
    setShowLBH(v => !v)
  }

  const showQuick = messages.length <= 1

  return (
    <div className="app-shell">
      {/* Header */}
      <header className="header">
        <div className="header-brand">
          <div className="header-logo">A</div>
          <div>
            <div className="header-title">AdvokasiKu</div>
            <div className="header-sub">Pendamping Hukum AI • 24/7 • Gratis</div>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn-ghost" onClick={toggleLBH}>
            📍 LBH Terdekat
          </button>
          <button className="btn-icon" onClick={clearChat} title="Reset chat">
            🗑
          </button>
        </div>
      </header>

      {/* LBH Panel */}
      {showLBH && (
        <div className="lbh-panel">
          <div className="lbh-title">Lembaga Bantuan Hukum — Konsultasi Gratis</div>
          <div className="lbh-list">
            {lbhList.map((l, i) => (
              <div key={i} className="lbh-item">
                <div>
                  <div className="lbh-item-name">{l.nama}</div>
                  <div className="lbh-item-detail">{l.kota} · {l.alamat?.split(",")[0]}</div>
                </div>
                <div className="lbh-item-phone">{l.telp}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick prompts */}
      {showQuick && (
        <div className="quick-prompts">
          <div className="quick-prompts-label">Contoh pertanyaan</div>
          <div className="quick-prompts-grid">
            {QUICK_PROMPTS.map((p, i) => (
              <button key={i} className="quick-chip" onClick={() => sendMessage(p)}>
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="messages-area">
        {messages.map((m, i) => <MessageBubble key={i} message={m} />)}

        {/* Typing indicator */}
        {isLoading && (messages[messages.length - 1]?.content === "" || messages.length === 0) && (
          <div className="msg-row">
            <div className="msg-avatar">⚖️</div>
            <div className="typing-dots">
              <div className="dot" />
              <div className="dot" />
              <div className="dot" />
            </div>
          </div>
        )}

        {error && <div className="error-toast">{error}</div>}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="input-area">
        <div className="input-row">
          <textarea
            ref={textareaRef}
            className="chat-textarea"
            value={input}
            onChange={autoResize}
            onKeyDown={handleKey}
            placeholder="Ceritakan masalah kamu... (Enter untuk kirim, Shift+Enter baris baru)"
            rows={1}
          />
          <button
            className="send-btn"
            onClick={handleSubmit}
            disabled={isLoading || !input.trim()}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
        <div className="input-hint">
          AdvokasiKu bukan pengacara. Untuk kasus serius, hubungi LBH terdekat.
        </div>
      </div>
    </div>
  )
}
