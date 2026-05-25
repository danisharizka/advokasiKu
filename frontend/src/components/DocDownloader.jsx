import { useState } from "react"
import { generateDoc } from "../utils/api"
import { FileDown, Loader2 } from "lucide-react"

export function DocDownloader({ rawResponse }) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleDownload() {
    setLoading(true)
    try {
      await generateDoc(rawResponse)
      setDone(true)
    } catch (e) {
      alert("Gagal membuat dokumen. Coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="mt-3 flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg
                 bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-60"
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : <FileDown size={16} />}
      {done ? "Diunduh!" : loading ? "Membuat surat..." : "Unduh surat (.docx)"}
    </button>
  )
}
