import ReactMarkdown from "react-markdown"
import { RiskBadge } from "./RiskBadge"
import { DocDownloader } from "./DocDownloader"
import { extractRiskLevel, detectDocJson } from "../utils/formatters"
import { Scale } from "lucide-react"

export function MessageBubble({ message }) {
  const isUser = message.role === "user"
  const riskLevel = !isUser ? extractRiskLevel(message.content) : null
  const hasDoc = !isUser && detectDocJson(message.content)

  // Hilangkan JSON block dari tampilan chat
  const displayContent = message.content
    .replace(/```json[\s\S]*?```/g, "")
    .trim()

  if (isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[80%] bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed">
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3 mb-4">
      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
        <Scale size={16} className="text-blue-600" />
      </div>
      <div className="max-w-[85%]">
        <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed text-gray-800">
          {riskLevel && <div className="mb-2"><RiskBadge level={riskLevel} /></div>}
          <ReactMarkdown
            components={{
              p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
              strong: ({children}) => <strong className="font-semibold text-gray-900">{children}</strong>,
              ul: ({children}) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
              ol: ({children}) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
              li: ({children}) => <li>{children}</li>,
              hr: () => <hr className="my-3 border-gray-200" />,
              em: ({children}) => <em className="text-gray-500 text-xs not-italic">{children}</em>,
            }}
          >
            {displayContent}
          </ReactMarkdown>
        </div>
        {hasDoc && <DocDownloader rawResponse={message.content} />}
      </div>
    </div>
  )
}
