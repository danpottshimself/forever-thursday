# Printful API Setup

## Get Your API Token

1. Go to: https://www.printful.com/dashboard/api-settings
2. Generate an API key or use your existing one
3. Copy the token (it will look like: `a8b9c0d1e2f3g4h5i6j7k8l9m0`)

## Add to Local Development

Update `.env.local`:
```bash
PRINTFUL_API_KEY=your_actual_oauth_token_here
```

## Add to Vercel

1. Go to: https://vercel.com/daniel-potts-projects-b8994ff6/forever-thursday/settings/environment-variables
2. Add new environment variable:
   - **Key**: `PRINTFUL_API_KEY`
   - **Value**: Your actual Printful API token
3. Redeploy the application

## Current Implementation

- **Endpoint**: `https://api.printful.com/store/products`
- **Method**: GET
- **Header**: `Authorization: Bearer {oauth_token}`

The code fetches all store products and displays them in the T-shirts section.
