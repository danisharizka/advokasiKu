// Komponen ini menampilkan jalur hukum step-by-step
// Diisi berdasarkan structured output dari Gemini
export function LegalRoadmap({ steps = [] }) {
  if (!steps.length) return null
  return (
    <div className="mt-3 border border-blue-100 rounded-xl p-4 bg-blue-50">
      <p className="text-xs font-semibold text-blue-800 mb-3">Peta Jalur Hukum</p>
      <ol className="space-y-2">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-3 items-start">
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">{i+1}</span>
            <div>
              <p className="text-sm font-medium text-gray-800">{step.title}</p>
              {step.detail && <p className="text-xs text-gray-500 mt-0.5">{step.detail}</p>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
