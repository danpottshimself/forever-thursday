'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { X, Mail, Check } from 'lucide-react'

export default function NewsletterBanner() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const result = await response.json()

      if (response.ok) {
        setIsSuccess(true)
        setEmail('')
        // Auto-dismiss after 3 seconds
        setTimeout(() => {
          setIsDismissed(true)
        }, 3000)
      } else {
        setError(result.error || 'Something went wrong')
      }
    } catch (error) {
      console.error('Newsletter signup error:', error)
      setError('Failed to sign up. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDismiss = () => {
    setIsDismissed(true)
  }

  // Don't render if dismissed
  if (isDismissed) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="bg-gradient-to-r from-black to-gray-800 text-white relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-2 left-4 w-2 h-2 bg-white rounded-full"></div>
          <div className="absolute top-6 left-12 w-1 h-1 bg-white rounded-full"></div>
          <div className="absolute top-4 right-8 w-1.5 h-1.5 bg-white rounded-full"></div>
          <div className="absolute top-8 right-16 w-1 h-1 bg-white rounded-full"></div>
          <div className="absolute top-2 right-24 w-2 h-2 bg-white rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left side - Message */}
            <div className="flex items-center space-x-3">
              <Mail size={20} className="text-white" />
              <span className="text-sm font-bold sketchy-font-alt">
                GET THE LATEST EMO VIBES
              </span>
            </div>

            {/* Center - Newsletter Form */}
            <div className="flex-1 max-w-md mx-6">
              {isSuccess ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center justify-center space-x-2 text-green-400"
                >
                  <Check size={16} />
                  <span className="text-sm font-bold sketchy-font-alt">
                    THANKS! YOU'RE IN THE EMO CREW
                  </span>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    required
                    className="flex-1 px-3 py-1.5 text-sm bg-white/10 border border-white/20 rounded text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 sketchy-font-alt"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-1.5 bg-white text-black text-sm font-bold rounded hover:bg-gray-200 transition-colors duration-300 sketchy-font-alt disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'SIGNING UP...' : 'SIGN UP'}
                  </button>
                </form>
              )}
            </div>

            {/* Right side - Dismiss button */}
            <button
              onClick={handleDismiss}
              className="p-1 hover:bg-white/10 rounded transition-colors duration-300"
            >
              <X size={16} className="text-white" />
            </button>
          </div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-red-400 text-xs mt-2 sketchy-font-alt"
            >
              {error}
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
