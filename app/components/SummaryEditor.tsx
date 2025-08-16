"use client";

import React, { useState } from "react";
import { Copy, Check, Eye, Pencil } from "lucide-react";
import type { SummaryEditorProps } from "../types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function SummaryEditor({
  summary,
  onSummaryChange,
  isLoading,
}: SummaryEditorProps) {
  const [copied, setCopied] = useState(false);
  const [preview, setPreview] = useState(false);

  const handleCopy = async () => {
    if (!summary) return;
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
    );
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
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-purple-300">
          Generated Summary {preview ? "(Preview)" : "(Editable)"}
        </label>
        <div className="flex items-center space-x-2">
          {/* Preview/Edit toggle */}
          <button
            onClick={() => setPreview(!preview)}
            className="flex items-center space-x-2 px-3 py-1 rounded-lg hover:bg-purple-900/30 transition-colors"
          >
            {preview ? (
              <>
                <Pencil className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-purple-400">Edit</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-purple-400">Preview</span>
              </>
            )}
          </button>

          {/* Copy button */}
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
      </div>

      {/* Content */}
      <div className="relative">
        {preview ? (
          <div className="glass-effect rounded-lg p-6 min-h-[300px] max-h-[500px] overflow-y-auto prose prose-invert">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                strong: ({ node, ...props }) => (
                  <strong
                    {...props}
                    className="text-purple-500 font-semibold"
                  />
                ),
                h1: ({ node, ...props }) => (
                  <h1 {...props} className="text-2xl font-bold text-purple-400 mb-3" />
                ),
                h2: ({ node, ...props }) => (
                  <h2 {...props} className="text-xl font-semibold text-purple-300 mb-2" />
                ),
                li: ({ node, ...props }) => (
                  <li {...props} className="mb-1 leading-relaxed" />
                ),
                p: ({ node, ...props }) => (
                  <p {...props} className="leading-relaxed text-gray-300 mb-2" />
                ),
              }}
            >
              {summary}
            </ReactMarkdown>
          </div>
        ) : (
          <textarea
            value={summary}
            onChange={(e) => onSummaryChange(e.target.value)}
            className="w-full min-h-[300px] max-h-[500px] p-4 bg-purple-900/10 border border-purple-600/30 rounded-lg text-gray-300 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-y"
            placeholder="Edit your summary here..."
          />
        )}
      </div>

      <p className="text-xs text-gray-500 mt-2">
        You can edit the summary or switch to preview mode to see formatting
      </p>
    </div>
  );
}
