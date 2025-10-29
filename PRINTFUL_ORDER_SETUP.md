# Printful Order Integration Setup

## Overview

The website now automatically creates Printful orders when customers purchase Printful items (products with IDs starting with `printful-`). The flow works as follows:

1. **Customer checkout**: Customer adds Printful items to cart and completes Stripe payment
2. **Payment processing**: Stripe processes the payment
3. **Webhook trigger**: On successful payment, Stripe sends a webhook to `/api/webhooks/stripe`
4. **Order creation**: The webhook creates a Printful order with:
   - Customer shipping information from Stripe
   - Selected product variants (size, color)
   - Quantities
   - External ID linking to Stripe payment intent

## Required Environment Variables

### Stripe Webhook Secret

You need to set up a Stripe webhook endpoint and get the webhook secret:

1. **Create Webhook in Stripe Dashboard**:
   - Go to: https://dashboard.stripe.com/webhooks
   - Click "Add endpoint"
   - Endpoint URL: `https://your-domain.com/api/webhooks/stripe`
   - Events to listen to: `payment_intent.succeeded`
   - Copy the "Signing secret" (starts with `whsec_`)

2. **Add to `.env.local`**:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   ```

3. **Add to Vercel**:
   - Go to: https://vercel.com/daniel-potts-projects-b8994ff6/forever-thursday/settings/environment-variables
   - Add: `STRIPE_WEBHOOK_SECRET` = `whsec_your_webhook_secret_here`
   - Redeploy the application

## Testing

### Using Stripe CLI (for local development)

1. **Install Stripe CLI**: https://stripe.com/docs/stripe-cli

2. **Login**:
   ```bash
   stripe login
   ```

3. **Forward webhooks to local server**:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

   This will give you a webhook secret (starts with `whsec_`). Use this in your `.env.local`.

4. **Trigger test payment**:
   ```bash
   stripe trigger payment_intent.succeeded
   ```

### For Production

1. Ensure `STRIPE_WEBHOOK_SECRET` is set in Vercel
2. Ensure the webhook endpoint is configured in Stripe Dashboard pointing to your production URL
3. Make a test purchase with a Printful item
4. Check Vercel logs for webhook processing and Printful order creation

## How It Works

### Payment Intent Creation

When creating a Stripe Payment Intent, cart items are stored in metadata:
- `hasPrintfulItems`: "true" if cart contains Printful products
- `cartItems`: JSON string of cart items (for webhook processing)

### Webhook Processing

1. **Webhook verification**: Verifies the webhook signature from Stripe
2. **Payment success**: Listens for `payment_intent.succeeded` events
3. **Cart extraction**: Retrieves cart items from payment intent metadata
4. **Shipping extraction**: Gets shipping address from payment intent
5. **Printful order**: Creates order via Printful API with:
   - Recipient information (name, address, city, country, etc.)
   - Product variants (sync_variant_id, quantity)
   - External ID (Stripe payment intent ID for tracking)

### Order Format

The Printful order payload includes:
```json
{
  "recipient": {
    "name": "Customer Name",
    "address1": "123 Main St",
    "city": "London",
    "state_code": "",
    "country_code": "GB",
    "zip": "SW1A 1AA",
    "phone": "",
    "email": "customer@example.com"
  },
  "items": [
    {
      "sync_variant_id": 12345,
      "quantity": 1
    }
  ],
  "external_id": "pi_stripe_payment_intent_id",
  "retail_costs": {
    "currency": "GBP",
    "subtotal": "29.99"
  }
}
```

## Troubleshooting

### Webhook Not Receiving Events

1. **Check webhook URL**: Ensure it's correctly set in Stripe Dashboard
2. **Check secret**: Verify `STRIPE_WEBHOOK_SECRET` matches the webhook endpoint's signing secret
3. **Check logs**: View Vercel function logs for webhook processing errors

### Printful Order Creation Fails

1. **Check API key**: Verify `PRINTFUL_API_KEY` is set correctly
2. **Check variant IDs**: Ensure products have valid variant information when added to cart
3. **Check shipping info**: Verify shipping address is collected during checkout
4. **Check logs**: Look for Printful API errors in webhook logs

### Missing Variant Information

Orders require variant information to be stored when adding Printful products to cart. This is handled automatically in the `ProductModal` component when customers select size and color options.

## Notes

- Only Printful items (IDs starting with `printful-`) trigger Printful order creation
- Non-Printful items are still processed through Stripe but won't create Printful orders
- If Printful order creation fails, the webhook still returns success (payment succeeded)
- Check Vercel logs for detailed error messages if orders aren't being created

