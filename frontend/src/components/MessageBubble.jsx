import ReactMarkdown from "react-markdown"
import { RiskBadge } from "./RiskBadge"
import { DocDownloader } from "./DocDownloader"
import { extractRiskLevel, detectDocJson } from "../utils/formatters"

export function MessageBubble({ message }) {
  const isUser = message.role === "user"
  const riskLevel = !isUser ? extractRiskLevel(message.content) : null
  const hasDoc = !isUser && detectDocJson(message.content)

  const displayContent = message.content
    .replace(/```json[\s\S]*?```/g, "")
    .trim()

  if (isUser) {
    return (
      <div className="msg-row user">
        <div className="msg-content">
          <div className="bubble bubble-user">{message.content}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="msg-row">
      <div className="msg-avatar">⚖️</div>
      <div className="msg-content">
        {riskLevel && <RiskBadge level={riskLevel} />}
        <div className="bubble bubble-ai">
          <ReactMarkdown
            components={{
              p: ({children}) => <p>{children}</p>,
              strong: ({children}) => <strong>{children}</strong>,
              ul: ({children}) => <ul>{children}</ul>,
              ol: ({children}) => <ol>{children}</ol>,
              li: ({children}) => <li>{children}</li>,
              hr: () => <hr />,
              em: ({children}) => <em>{children}</em>,
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
