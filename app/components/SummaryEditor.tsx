"use client";

import React, { useState } from "react";
import { Copy, Check, Eye, Pencil } from "lucide-react";
import type { SummaryEditorProps } from "../types";

export default function SummaryEditor({
  summary,
  onSummaryChange,
  isLoading,
}: SummaryEditorProps) {
  const [copied, setCopied] = useState(false);
  const [preview, setPreview] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatSummary = (text: string) => {
    const lines = text.split("\n");
    let html = "";
    let inUl = false;
    let inOl = false;

    for (let line of lines) {
      if (line.startsWith("- ") || line.startsWith("* ")) {
        if (!inUl) {
          html += '<ul class="list-disc ml-6 text-gray-300">';
          inUl = true;
        }
        html += `<li>${line.slice(2)}</li>`;
        continue;
      } else if (/^\d+\.\s/.test(line)) {
        if (!inOl) {
          html += '<ol class="list-decimal ml-6 text-gray-300">';
          inOl = true;
        }
        html += `<li>${line.replace(/^\d+\.\s/, "")}</li>`;
        continue;
      } else {
        if (inUl) {
          html += "</ul>";
          inUl = false;
        }
        if (inOl) {
          html += "</ol>";
          inOl = false;
        }
      }

      // Headings
      if (line.startsWith("### ")) {
        html += `<h3 class="text-lg font-bold text-purple-300 mt-4 mb-2">${line.slice(
          4
        )}</h3>`;
        continue;
      }
      if (line.startsWith("## ")) {
        html += `<h2 class="text-xl font-bold text-purple-400 mt-4 mb-2">${line.slice(
          3
        )}</h2>`;
        continue;
      }
      if (line.startsWith("# ")) {
        html += `<h1 class="text-2xl font-bold text-purple-500 mt-4 mb-2">${line.slice(
          2
        )}</h1>`;
        continue;
      }

      // Bold + italic
      line = line.replace(
        /\*\*(.*?)\*\*/g,
        '<strong class="text-purple-300">$1</strong>'
      );
      line = line.replace(
        /\*(.*?)\*/g,
        '<em class="italic text-purple-200">$1</em>'
      );

      if (line.trim()) {
        html += `<p class="text-gray-300 mb-2">${line}</p>`;
      }
    }

    if (inUl) html += "</ul>";
    if (inOl) html += "</ol>";

    return html;
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
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-purple-300">
          Generated Summary {preview ? "(Preview)" : "(Editable)"}
        </label>
        <div className="flex items-center space-x-2">
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

      <div className="relative">
        {preview ? (
          <div
            className="glass-effect rounded-lg p-4 min-h-[300px] max-h-[500px] overflow-y-auto prose prose-invert"
            dangerouslySetInnerHTML={{ __html: formatSummary(summary) }}
          />
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
