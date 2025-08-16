import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '../../lib/resend'
import type { EmailRequest, EmailResponse } from '../../types'

export async function POST(request: NextRequest) {
  try {
    const body: EmailRequest = await request.json()
    const { recipients, summary, subject } = body

    if (!recipients || recipients.length === 0 || !summary) {
      return NextResponse.json(
        { success: false, error: 'Missing recipients or summary' },
        { status: 400 }
      )
    }

    // Validate email addresses
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const invalidEmails = recipients.filter(email => !emailRegex.test(email))
    
    if (invalidEmails.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid email addresses: ${invalidEmails.join(', ')}` 
        },
        { status: 400 }
      )
    }

    await sendEmail(recipients, summary, subject)

    const response: EmailResponse = {
      success: true,
      message: `Summary sent successfully to ${recipients.length} recipient(s)`,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error in send-email API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to send email',
        message: 'An error occurred while sending the email' 
      },
      { status: 500 }
    )
  }
}