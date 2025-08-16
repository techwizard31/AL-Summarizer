'use client'

import React, { useState } from 'react'
import { Send, Plus, X, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import type { EmailSenderProps } from '../types'

export default function EmailSender({ summary, isLoading }: EmailSenderProps) {
  const [recipients, setRecipients] = useState<string[]>([''])
  const [subject, setSubject] = useState('Meeting Summary')
  const [isSending, setIsSending] = useState(false)
  const [sent, setSent] = useState(false)

  const addRecipient = () => {
    setRecipients([...recipients, ''])
  }

  const removeRecipient = (index: number) => {
    setRecipients(recipients.filter((_, i) => i !== index))
  }

  const updateRecipient = (index: number, value: string) => {
    const updated = [...recipients]
    updated[index] = value
    setRecipients(updated)
  }

  const validateEmails = (): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const validRecipients = recipients.filter(email => email && emailRegex.test(email))
    
    if (validRecipients.length === 0) {
      toast.error('Please enter at least one valid email address')
      return false
    }

    const invalidEmails = recipients.filter(email => email && !emailRegex.test(email))
    if (invalidEmails.length > 0) {
      toast.error(`Invalid email: ${invalidEmails[0]}`)
      return false
    }

    return true
  }

  const handleSend = async () => {
    if (!summary) {
      toast.error('No summary to send')
      return
    }

    if (!validateEmails()) {
      return
    }

    setIsSending(true)

    try {
      const validRecipients = recipients.filter(email => email)
      
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipients: validRecipients,
          summary,
          subject,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast.success(data.message || 'Email sent successfully!')
        setSent(true)
        setTimeout(() => setSent(false), 3000)
        
        // Reset form
        setRecipients([''])
        setSubject('Meeting Summary')
      } else {
        toast.error(data.error || 'Failed to send email')
      }
    } catch (error) {
      toast.error('An error occurred while sending the email')
      console.error('Email sending error:', error)
    } finally {
      setIsSending(false)
    }
  }

  const isDisabled = isLoading || isSending || !summary

  return (
    <div className="w-full space-y-4">
      <h3 className="text-lg font-semibold text-purple-300">Share Summary via Email</h3>
      
      {/* Subject */}
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-400">
          Email Subject
        </label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="input-field h-8 bg-gray-800 rounded pl-2"
          placeholder="Meeting Summary"
          disabled={isDisabled}
        />
      </div>

      {/* Recipients */}
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-400">
          Recipients
        </label>
        <div className="space-y-2">
          {recipients.map((email, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="email"
                value={email}
                onChange={(e) => updateRecipient(index, e.target.value)}
                className="input-field flex-1 h-8 bg-gray-800 rounded pl-2"
                placeholder="email@example.com"
                disabled={isDisabled}
              />
              {recipients.length > 1 && (
                <button
                  onClick={() => removeRecipient(index)}
                  className="p-2 hover:bg-purple-900/30 rounded-lg transition-colors"
                  disabled={isDisabled}
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-white" />
                </button>
              )}
            </div>
          ))}
        </div>
        
        <button
          onClick={addRecipient}
          className="mt-2 flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
          disabled={isDisabled}
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm">Add another recipient</span>
        </button>
      </div>

      {/* Send Button */}
      <button
        onClick={handleSend}
        disabled={isDisabled}
        className={`
          w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-semibold transition-all duration-200
          ${isDisabled 
            ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
            : sent
            ? 'bg-green-600 hover:bg-green-700'
            : 'button-primary'
          }
        `}
      >
        {isSending ? (
          <>
            <div className="spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
            <span>Sending...</span>
          </>
        ) : sent ? (
          <>
            <CheckCircle className="w-5 h-5" />
            <span>Sent Successfully!</span>
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            <span>Send Email</span>
          </>
        )}
      </button>

      {!summary && (
        <p className="text-xs text-gray-500 text-center">
          Generate a summary first before sharing
        </p>
      )}
    </div>
  )
}