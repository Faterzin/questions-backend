'use client'

import { useState } from 'react'

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
}

export default function CodeBlock({ code, language = 'js', filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden text-sm">
      <div className="flex items-center justify-between px-4 py-2 bg-card border-b border-border">
        <span className="text-muted text-xs font-mono">{filename ?? language}</span>
        <button
          onClick={copy}
          className="text-xs text-muted hover:text-white transition-colors"
        >
          {copied ? 'copiado ✓' : 'copiar'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto bg-[#0d1117]">
        <code className="font-mono text-[13px] leading-relaxed text-slate-300 whitespace-pre">
          {code}
        </code>
      </pre>
    </div>
  )
}
