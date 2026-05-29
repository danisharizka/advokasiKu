export function RiskBadge({ level }) {
  if (!level) return null
  const config = {
    high:   { label: "⚠ Risiko TINGGI",  cls: "risk-badge risk-high" },
    medium: { label: "◐ Risiko SEDANG",  cls: "risk-badge risk-medium" },
    low:    { label: "✓ Risiko RENDAH",  cls: "risk-badge risk-low" },
  }
  const { label, cls } = config[level]
  return <span className={cls}>{label}</span>
}
