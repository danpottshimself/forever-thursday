import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET is not configured')
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      )
    }

    // Handle successful payment
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      
      // Check if this order contains Printful items
      if (paymentIntent.metadata.hasPrintfulItems === 'true') {
        try {
          // Parse cart items from metadata
          const cartItems = JSON.parse(paymentIntent.metadata.cartItems || '[]')
          
          // Retrieve full payment intent to get shipping details
          const fullPaymentIntent = await stripe.paymentIntents.retrieve(
            paymentIntent.id,
            { expand: ['shipping'] }
          )
          
          // Get customer and shipping details
          const shipping = fullPaymentIntent.shipping
          
          // Create Printful order
          await createPrintfulOrder(cartItems, fullPaymentIntent, shipping)
          
          console.log('Printful order created successfully for payment:', paymentIntent.id)
        } catch (error: any) {
          console.error('Error creating Printful order:', error)
          // Don't fail the webhook - payment succeeded, order creation can be retried
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: error.message || 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function createPrintfulOrder(
  cartItems: any[],
  paymentIntent: Stripe.PaymentIntent,
  shipping?: Stripe.PaymentIntent.Shipping | null
) {
  const apiKey = process.env.PRINTFUL_API_KEY?.trim()
  
  if (!apiKey) {
    throw new Error('PRINTFUL_API_KEY not configured')
  }

  // Filter for Printful items only
  const printfulItems = cartItems.filter((item: any) => 
    item.product?.id?.startsWith('printful-')
  )

  if (printfulItems.length === 0) {
    console.log('No Printful items in cart, skipping order creation')
    return
  }

  // Build recipient object from shipping address
  const shippingAddress = shipping?.address
  const recipient = {
    name: shipping?.name || 'Customer',
    address1: shippingAddress?.line1 || '',
    address2: shippingAddress?.line2 || '',
    city: shippingAddress?.city || '',
    state_code: shippingAddress?.state || '',
    country_code: shippingAddress?.country || 'GB',
    zip: shippingAddress?.postal_code || '',
    phone: shipping?.phone || '',
    email: (paymentIntent as any).receipt_email || '',
  }

  // Validate required fields
  if (!recipient.address1 || !recipient.city || !recipient.country_code) {
    throw new Error('Missing required shipping information: address, city, or country')
  }

  // Build items array for Printful
  const items = printfulItems.map((item: any) => {
    const productId = item.product.id.replace('printful-', '')
    const variant = item.product.variant
    
    if (!variant || !variant.variantId) {
      throw new Error(`Missing variant information for product ${productId}`)
    }
    
    return {
      sync_variant_id: variant.variantId, // Printful uses sync_variant_id
      quantity: item.quantity,
      // Optional: Add size and color if available (Printful may use these for validation)
      ...(variant.size && { 
        // Note: Printful usually doesn't need size/color in order if sync_variant_id is provided
      }),
    }
  })

  // Create order payload
  const orderPayload = {
    recipient,
    items,
    external_id: paymentIntent.id, // Use Stripe payment intent ID as external ID
    retail_costs: {
      currency: paymentIntent.currency.toUpperCase(),
      subtotal: (paymentIntent.amount / 100).toFixed(2),
    },
  }

  console.log('Creating Printful order:', JSON.stringify(orderPayload, null, 2))

  // Call Printful API to create order
  const response = await fetch('https://api.printful.com/orders', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderPayload),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Printful API error:', response.status, errorText)
    throw new Error(`Printful API error: ${response.status} - ${errorText}`)
  }

  const result = await response.json()
  console.log('Printful order created:', result)
  
  return result
}
