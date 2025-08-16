'use client'

import React from 'react'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'
import type { SummaryEditorProps } from '../types'

export default function SummaryEditor({ 
  summary, 
  onSummaryChange, 
  isLoading 
}: SummaryEditorProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(summary)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatSummary = (text: string) => {
    // Convert markdown-style formatting to HTML for display
    return text
      .split('\n')
      .map(line => {
        // Handle headers
        if (line.startsWith('### ')) {
          return `<h3 class="text-lg font-bold text-purple-300 mt-4 mb-2">${line.slice(4)}</h3>`
        }
        if (line.startsWith('## ')) {
          return `<h2 class="text-xl font-bold text-purple-400 mt-4 mb-2">${line.slice(3)}</h2>`
        }
        if (line.startsWith('# ')) {
          return `<h1 class="text-2xl font-bold text-purple-500 mt-4 mb-2">${line.slice(2)}</h1>`
        }
        
        // Handle bullet points
        if (line.startsWith('- ') || line.startsWith('* ')) {
          return `<li class="ml-4 text-gray-300">${line.slice(2)}</li>`
        }
        
        // Handle numbered lists
        if (/^\d+\.\s/.test(line)) {
          return `<li class="ml-4 text-gray-300">${line.replace(/^\d+\.\s/, '')}</li>`
        }
        
        // Handle bold text
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-purple-300">$1</strong>')
        
        // Regular paragraph
        if (line.trim()) {
          return `<p class="text-gray-300 mb-2">${line}</p>`
        }
        
        return ''
      })
      .join('')
  }

  if (isLoading) {
    return (
      <div className="w-full">
        <label className="block text-sm font-medium mb-2 text-purple-300">
          Generated Summary
        </label>
        <div className="glass-effect rounded-lg p-8 text-center">
          <div className="spinner w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Generating summary...</p>
        </div>
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="w-full">
        <label className="block text-sm font-medium mb-2 text-purple-300">
          Generated Summary
        </label>
        <div className="glass-effect rounded-lg p-8 text-center">
          <p className="text-gray-500">
            Your summary will appear here after generation
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-purple-300">
          Generated Summary (Editable)
        </label>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-2 px-3 py-1 rounded-lg hover:bg-purple-900/30 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-400">Copy</span>
            </>
          )}
        </button>
      </div>
      
      <div className="relative">
        <div 
          className="glass-effect rounded-lg p-4 min-h-[300px] max-h-[500px] overflow-y-auto"
          style={{ display: 'none' }}
          dangerouslySetInnerHTML={{ __html: formatSummary(summary) }}
        />
        
        <textarea
          value={summary}
          onChange={(e) => onSummaryChange(e.target.value)}
          className="w-full min-h-[300px] max-h-[500px] p-4 bg-purple-900/10 border border-purple-600/30 rounded-lg text-gray-300 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-y"
          placeholder="Edit your summary here..."
        />
      </div>
      
      <p className="text-xs text-gray-500 mt-2">
        You can edit the summary above before sharing
      </p>
    </div>
  )
}