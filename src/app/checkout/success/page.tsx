'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle, ShoppingBag } from 'lucide-react'

export default function CheckoutSuccessPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
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
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className="mb-8"
            >
              <CheckCircle size={80} className="text-green-500 mx-auto" />
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold sketchy-font-alt text-black mb-6">
              PAYMENT SUCCESSFUL!
            </h1>
            <p className="text-xl text-gray-700 sketchy-font-alt mb-8">
              Thank you for your purchase. Your order is being processed.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Success Message */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-gray-50 p-8 rounded-lg border border-gray-200 mb-8"
          >
            <p className="text-lg mb-6 sketchy-font-alt">
              You'll receive an email confirmation shortly with your order details.
            </p>
            <p className="text-sm text-gray-600 sketchy-font-alt">
              Your emo essentials are on their way! 🎸
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/"
              className="inline-flex px-8 py-4 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-900 transition-colors duration-300 sketchy-font-alt text-center items-center justify-center"
            >
              BACK TO HOME
            </Link>
            <Link
              href="/products"
              className="inline-flex px-8 py-4 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors duration-300 sketchy-font-alt items-center justify-center gap-2"
            >
              <ShoppingBag size={20} />
              CONTINUE SHOPPING
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

