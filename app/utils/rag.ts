import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { Document } from 'langchain/document'

export class RAGProcessor {
  private embeddings: GoogleGenerativeAIEmbeddings
  private textSplitter: RecursiveCharacterTextSplitter

  constructor() {
    this.embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_GEMINI_API_KEY!,
      modelName: 'embedding-001',
    })

    this.textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
      separators: ['\n\n', '\n', '.', '!', '?', ',', ' ', ''],
    })
  }

  async processTranscript(transcript: string, prompt: string): Promise<string> {
    try {
      // Split the transcript into chunks
      const chunks = await this.textSplitter.splitText(transcript)
      
      // Create documents from chunks
      const documents = chunks.map(
        (chunk, index) =>
          new Document({
            pageContent: chunk,
            metadata: { chunkIndex: index },
          })
      )

      // Create vector store with embeddings
      const vectorStore = await MemoryVectorStore.fromDocuments(
        documents,
        this.embeddings
      )

      // Perform similarity search based on the prompt
      const relevantDocs = await vectorStore.similaritySearch(prompt, 5)
      
      // Combine relevant chunks
      const relevantContext = relevantDocs
        .map(doc => doc.pageContent)
        .join('\n\n---\n\n')

      return relevantContext
    } catch (error) {
      console.error('RAG processing error:', error)
      // Fallback to full transcript if RAG fails
      return transcript
    }
  }

  async enhancedSummary(transcript: string, prompt: string): Promise<{
    relevantContext: string
    fullTranscript: string
  }> {
    const relevantContext = await this.processTranscript(transcript, prompt)
    
    return {
      relevantContext,
      fullTranscript: transcript,
    }
  }
}