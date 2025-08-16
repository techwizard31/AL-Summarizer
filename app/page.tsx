'use client'

import React, { useState } from 'react'
import { Sparkles, FileText, Mail, Zap } from 'lucide-react'
import FileUpload from './components/FileUpload'
import SummaryEditor from './components/SummaryEditor'
import EmailSender from './components/EmailSender'
import { Toaster, toast } from 'react-hot-toast'

export default function Home() {
  const [transcript, setTranscript] = useState('')
  const [prompt, setPrompt] = useState('')
  const [summary, setSummary] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateSummary = async () => {
    if (!transcript) {
      toast.error('Please upload a transcript file first')
      return
    }

    if (!prompt) {
      toast.error('Please enter instructions for the summary')
      return
    }

    setIsGenerating(true)
    setSummary('')

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript,
          prompt,
        }),
      })

      const data = await response.json()

      if (response.ok && data.summary) {
        setSummary(data.summary)
        toast.success('Summary generated successfully!')
      } else {
        toast.error(data.error || 'Failed to generate summary')
      }
    } catch (error) {
      toast.error('An error occurred while generating the summary')
      console.error('Summary generation error:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a0033',
            color: '#fff',
            border: '1px solid rgba(147, 51, 234, 0.3)',
          },
          success: {
            iconTheme: {
              primary: '#9333ea',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <div className="min-h-screen bg-black">
        {/* Background gradient effects */}
        <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-purple-950/20 pointer-events-none" />
        <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-800/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Header */}
        <header className="relative z-10 border-b border-purple-900/30 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-purple-600 to-purple-900 rounded-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gradient">
                  AI Meeting Notes Summarizer
                </h1>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Upload</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>Summarize</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>Share</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative z-10 container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                Transform Your <span className="text-gradient">Meeting Notes</span> Into
                <br />
                Actionable Summaries
              </h2>
              <p className="text-gray-400 text-lg">
                Upload your transcript, customize the summary style, and share with your team
              </p>
            </div>

            {/* Main Grid */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column - Input */}
              <div className="space-y-6">
                {/* File Upload */}
                <div className="card">
                  <FileUpload 
                    onFileContent={setTranscript}
                    isLoading={isGenerating}
                  />
                </div>

                {/* Custom Prompt */}
                <div className="card">
                  <label className="block text-sm font-medium mb-2 text-purple-300">
                    Custom Instructions
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="input-field min-h-[120px] resize-none bg-gray-900 rounded-xl p-2 w-full"
                    placeholder="e.g., 'Summarize in bullet points for executives' or 'Extract only action items with owners and deadlines'"
                    disabled={isGenerating}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Describe how you want the summary to be structured
                  </p>
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerateSummary}
                  disabled={!transcript || !prompt || isGenerating}
                  className={`
                    w-full button-primary flex items-center justify-center space-x-2
                    ${(!transcript || !prompt || isGenerating) ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {isGenerating ? (
                    <>
                      <div className="spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Generating Summary...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Generate Summary</span>
                    </>
                  )}
                </button>
              </div>

              {/* Right Column - Output */}
              <div className="space-y-6">
                {/* Summary Editor */}
                <div className="card">
                  <SummaryEditor
                    summary={summary}
                    onSummaryChange={setSummary}
                    isLoading={isGenerating}
                  />
                </div>

                {/* Email Sender */}
                {summary && (
                  <div className="card">
                    <EmailSender
                      summary={summary}
                      isLoading={isGenerating}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Features Section */}
            <div className="grid md:grid-cols-3 gap-6 mt-16">
              <div className="card text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-purple-600 to-purple-900 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-purple-300">Smart Processing</h3>
                <p className="text-sm text-gray-400">
                  RAG-powered analysis ensures accurate and contextual summaries
                </p>
              </div>

              <div className="card text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-purple-600 to-purple-900 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-purple-300">Custom Prompts</h3>
                <p className="text-sm text-gray-400">
                  Tailor summaries to your specific needs and audience
                </p>
              </div>

              <div className="card text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-purple-600 to-purple-900 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-purple-300">Easy Sharing</h3>
                <p className="text-sm text-gray-400">
                  Send polished summaries directly to team members via email
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 border-t border-purple-900/30 mt-20 py-8">
          <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
            <p>© 2024 AI Meeting Notes Summarizer. Powered by Google Gemini & Next.js</p>
          </div>
        </footer>
      </div>
    </>
  )
}