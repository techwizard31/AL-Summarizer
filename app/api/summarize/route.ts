import { NextRequest, NextResponse } from 'next/server'
import { generateSummary } from '../../lib/gemini'
import { RAGProcessor } from '../../utils/rag'
import type { SummaryRequest, SummaryResponse } from '../../types'

export async function POST(request: NextRequest) {
  try {
    const body: SummaryRequest = await request.json()
    const { transcript, prompt } = body

    if (!transcript || !prompt) {
      return NextResponse.json(
        { error: 'Missing transcript or prompt' },
        { status: 400 }
      )
    }

    // Initialize RAG processor
    const ragProcessor = new RAGProcessor()
    
    // Process transcript with RAG for better context understanding
    const { relevantContext, fullTranscript } = await ragProcessor.enhancedSummary(
      transcript,
      prompt
    )

    // Generate summary with enhanced context
    const enhancedPrompt = `
      Based on the following relevant sections and full context, ${prompt}
      
      RELEVANT SECTIONS (Most important for your task):
      ${relevantContext}
      
      FULL TRANSCRIPT (For additional context if needed):
      ${fullTranscript}
    `

    const summary = await generateSummary(fullTranscript, prompt)

    const response: SummaryResponse = {
      summary,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error in summarize API:', error)
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    )
  }
}