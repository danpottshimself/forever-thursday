import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'gbp', cartItems } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    // Calculate amount in cents
    const amountInCents = Math.round(amount * 100)

    // Store cart items in metadata for webhook processing
    const metadata: Record<string, string> = {}
    if (cartItems && Array.isArray(cartItems)) {
      // Filter for Printful items only (products with id starting with 'printful-')
      const printfulItems = cartItems.filter((item: any) => 
        item.product?.id?.startsWith('printful-')
      )
      
      if (printfulItems.length > 0) {
        // Store cart items in metadata (limited to 500 characters per value)
        metadata.hasPrintfulItems = 'true'
        metadata.printfulItemsCount = printfulItems.length.toString()
        // Store a compact JSON representation (will parse in webhook)
        metadata.cartItems = JSON.stringify(cartItems.slice(0, 10)) // Limit to prevent metadata size issues
      }
    }

    // Create Payment Intent with multiple payment methods
    // Note: Cannot use both automatic_payment_methods and payment_method_types
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: metadata,
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error: any) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}

