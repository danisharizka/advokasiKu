export function RiskBadge({ level }) {
  if (!level) return null
  const config = {
    high:   { label: "Risiko TINGGI",  cls: "bg-red-100 text-red-800 border-red-200" },
    medium: { label: "Risiko SEDANG",  cls: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    low:    { label: "Risiko RENDAH",  cls: "bg-green-100 text-green-800 border-green-200" },
  }
  const { label, cls } = config[level]
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${cls}`}>
      {label}
    </span>
  )
}
