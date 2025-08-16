export interface SummaryRequest {
  transcript: string
  prompt: string
}

export interface SummaryResponse {
  summary: string
  error?: string
}

export interface EmailRequest {
  recipients: string[]
  summary: string
  subject?: string
}

export interface EmailResponse {
  success: boolean
  message: string
  error?: string
}

export interface FileUploadProps {
  onFileContent: (content: string) => void
  isLoading: boolean
}

export interface SummaryEditorProps {
  summary: string
  onSummaryChange: (summary: string) => void
  isLoading: boolean
}

export interface EmailSenderProps {
  summary: string
  isLoading: boolean
}