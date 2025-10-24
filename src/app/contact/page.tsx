'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Image from 'next/image'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Create mailto link with form data
      const subject = encodeURIComponent(formData.subject || 'Contact from Forever February Website')
      const body = encodeURIComponent(`
Name: ${formData.name}
Email: ${formData.email}

Message:
${formData.message}
      `)
      
      const mailtoLink = `mailto:contact.foreverfebruary@gmail.com?subject=${subject}&body=${body}`
      window.open(mailtoLink)
      
      setSubmitStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSubmitStatus(''), 3000)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="mb-8 w-full max-w-2xl mx-auto">
              <Image
                src="/logo-forever-february.svg"
                alt="Forever February"
                width={600}
                height={300}
                className="w-full h-auto object-contain"
                style={{ aspectRatio: '2/1' }}
                priority
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold sketchy-font-alt text-black mb-6">
              CONTACT US
            </h1>
            <p className="text-xl text-gray-700 sketchy-font-alt">
              Get in touch with the elder emos behind Forever February
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-gray-50 p-8 rounded-lg border border-gray-200"
          >
            <h2 className="text-3xl font-bold text-black mb-6 sketchy-font-alt text-center">
              SEND US A MESSAGE
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-black mb-2 sketchy-font-alt">
                  NAME *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent sketchy-font-alt"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold text-black mb-2 sketchy-font-alt">
                  EMAIL *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent sketchy-font-alt"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-bold text-black mb-2 sketchy-font-alt">
                  SUBJECT
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent sketchy-font-alt"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-bold text-black mb-2 sketchy-font-alt">
                  MESSAGE *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent sketchy-font-alt resize-vertical"
                  placeholder="Tell us what's on your mind..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white font-bold py-4 rounded-lg hover:bg-gray-800 transition-colors duration-300 sketchy-font-alt disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
              </button>

              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-green-600 sketchy-font-alt"
                >
                  ✅ Message sent! Your email client should open with the message ready to send.
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-red-600 sketchy-font-alt"
                >
                  ❌ Something went wrong. Please try again.
                </motion.div>
              )}
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600 sketchy-font-alt">
                Or email us directly at:{' '}
                <a 
                  href="mailto:contact.foreverfebruary@gmail.com" 
                  className="text-black hover:underline font-bold"
                >
                  contact.foreverfebruary@gmail.com
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
