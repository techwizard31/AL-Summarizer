import { GoogleGenerativeAI } from '@google/generative-ai'

if (!process.env.GOOGLE_GEMINI_API_KEY) {
  throw new Error('Missing GOOGLE_GEMINI_API_KEY environment variable')
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY)

export const geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' })

export async function generateSummary(transcript: string, prompt: string): Promise<string> {
  try {
    const fullPrompt = `
      You are an expert meeting notes summarizer. Your task is to analyze the following transcript and create a summary based on the user's specific instructions.
      
      User Instructions: ${prompt}
      
      Transcript:
      ${transcript}
      
      Please provide a well-structured summary that:
      1. Follows the user's instructions precisely
      2. Is clear and concise
      3. Highlights key information
      4. Uses appropriate formatting (bullet points, sections, etc.) where relevant
      5. Maintains professional tone
      
      Summary:
    `

    const result = await geminiModel.generateContent(fullPrompt)
    const response = await result.response
    const text = response.text()
    
    return text
  } catch (error) {
    console.error('Error generating summary:', error)
    throw new Error('Failed to generate summary')
  }
}