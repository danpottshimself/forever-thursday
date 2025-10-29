'use client'

import { useEffect, useState } from 'react'
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js'
import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { ArrowLeft, Lock } from 'lucide-react'

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null

function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const { getCartTotal, clearCart } = useCart()
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const { error: submitError } = await elements.submit()
      
      if (submitError) {
        setError(submitError.message || 'An error occurred')
        setIsProcessing(false)
        return
      }

      const { error: paymentError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${globalThis.location.origin}/checkout/success`,
        },
        redirect: 'if_required',
      })

      if (paymentError) {
        setError(paymentError.message || 'Payment failed')
        setIsProcessing(false)
      } else {
        setSuccess(true)
        clearCart()
        globalThis.location.href = '/checkout/success'
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred')
      setIsProcessing(false)
    }
  }

  if (success) {
    return null
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement 
        options={{
          layout: 'tabs',
          paymentMethodOrder: ['card', 'klarna', 'paypal'],
          wallets: {
            applePay: 'auto',
            googlePay: 'auto',
          },
        }}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-black text-white font-bold py-4 px-6 rounded-lg hover:bg-gray-800 transition-colors duration-300 sketchy-font-alt disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Lock size={20} />
        {isProcessing ? 'PROCESSING PAYMENT...' : `PAY £${getCartTotal().toFixed(2)}`}
      </button>

      <p className="text-xs text-center text-gray-500">
        🔒 Secure payment powered by Stripe
      </p>
    </form>
  )
}

export default function CheckoutPage() {
  const { cart, getCartTotal } = useCart()
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (cart.length === 0) {
      setError('Your cart is empty')
      return
    }

    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: getCartTotal(),
            currency: 'gbp',
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to create payment intent')
        }

        setClientSecret(data.clientSecret)
      } catch (err: any) {
        setError(err.message || 'Failed to initialize payment')
      }
    }

    createPaymentIntent()
  }, [])

  if (cart.length === 0) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-3xl font-bold text-black mb-4 sketchy-font-alt">
            Your cart is empty
          </h1>
          <Link
            href="/products"
            className="inline-block px-8 py-4 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors duration-300 sketchy-font-alt"
          >
            START SHOPPING
          </Link>
        </div>
      </div>
    )
  }

  if (error && !clientSecret) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-black mb-4 sketchy-font-alt">
            {error}
          </h1>
          <Link
            href="/cart"
            className="inline-block px-8 py-4 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors duration-300 sketchy-font-alt"
          >
            BACK TO CART
          </Link>
        </div>
      </div>
    )
  }

  const options: StripeElementsOptions = {
    clientSecret: clientSecret || undefined,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#000000',
        colorBackground: '#ffffff',
        colorText: '#000000',
        colorDanger: '#ef4444',
        fontFamily: 'system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
      },
    },
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="mb-6 w-full max-w-xl mx-auto">
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
            <h1 className="text-3xl md:text-5xl font-bold sketchy-font-alt text-black mb-4">
              CHECKOUT
            </h1>
            <p className="text-lg text-gray-700 sketchy-font-alt">
              Secure payment powered by Stripe
            </p>
          </motion.div>
        </div>
      </section>

      {/* Checkout Content */}
      <section className="py-8 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Payment Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-2 md:order-1"
          >
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
              <h2 className="text-2xl font-bold text-black mb-6 sketchy-font-alt">
                PAYMENT DETAILS
              </h2>
              
              {clientSecret && stripePromise ? (
                <Elements options={options} stripe={stripePromise}>
                  <CheckoutForm />
                </Elements>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-600 px-4 py-3 rounded-lg text-sm">
                  Stripe is not configured. Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable.
                </div>
              )}
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 md:order-2"
          >
            <div className="bg-black text-white p-8 rounded-lg sticky top-4">
              <h2 className="text-2xl font-bold mb-6 sketchy-font-alt">
                ORDER SUMMARY
              </h2>
              
              <div className="space-y-4 mb-6">
                {cart.map(item => (
                  <div key={item.product.id} className="flex justify-between pb-4 border-b border-gray-700">
                    <div className="flex-1">
                      <p className="sketchy-font-alt">{item.product.name}</p>
                      <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="sketchy-font-alt">
                      £{(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-700 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Subtotal</span>
                  <span>£{getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="border-t border-gray-700 pt-4 flex justify-between items-center">
                  <span className="text-xl font-bold sketchy-font-alt">
                    TOTAL
                  </span>
                  <span className="text-2xl font-bold sketchy-font-alt">
                    ${getCartTotal().toFixed(2)}
                  </span>
                </div>
              </div>

              <Link
                href="/cart"
                className="mt-6 flex items-center justify-center gap-2 text-gray-300 hover:text-white transition-colors sketchy-font-alt"
              >
                <ArrowLeft size={20} />
                BACK TO CART
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

