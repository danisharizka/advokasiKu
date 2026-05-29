import { useState } from "react"
import { generateDoc } from "../utils/api"

export function DocDownloader({ rawResponse }) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleDownload() {
    setLoading(true)
    try {
      await generateDoc(rawResponse)
      setDone(true)
    } catch {
      alert("Gagal membuat dokumen. Coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className={`doc-btn${done ? " done" : ""}`}
    >
      {loading ? (
        <>
          <span style={{display:"inline-block",width:13,height:13,border:"2px solid rgba(255,255,255,.4)",borderTopColor:"white",borderRadius:"50%",animation:"spin .6s linear infinite"}} />
          Membuat surat...
        </>
      ) : done ? (
        <> ✓ Surat diunduh!</>
      ) : (
        <> ↓ Unduh surat resmi (.docx)</>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </button>
  )
}
