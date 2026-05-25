import { useState } from "react"
import { generateDoc } from "../utils/api"

export function useDocGen() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function download(rawResponse) {
    setLoading(true)
    setError(null)
    try {
      await generateDoc(rawResponse)
    } catch (e) {
      setError("Gagal membuat dokumen")
    } finally {
      setLoading(false)
    }
  }

  return { download, loading, error }
}
