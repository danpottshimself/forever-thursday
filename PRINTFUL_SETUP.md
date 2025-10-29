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

The code fetches all store products and displays them in the Custom Merch section.

## Troubleshooting 401 "Invalid Access Token" Error

If you see a 401 error saying "The access token provided is invalid":

1. **Verify your API key is correct:**
   - Go to https://www.printful.com/dashboard/api-settings
   - Copy your API key (it should be around 47 characters)
   - Test it with curl:
     ```bash
     curl --location --request GET 'https://api.printful.com/store/products' \
     --header 'Authorization: Bearer YOUR_API_KEY_HERE'
     ```
   - If curl works but the website doesn't, the issue is in Vercel environment variables

2. **Check Vercel Environment Variables:**
   - Go to: https://vercel.com/daniel-potts-projects-b8994ff6/forever-thursday/settings/environment-variables
   - Make sure `PRINTFUL_API_KEY` exists
   - Check that the value matches exactly (no extra spaces, quotes, or line breaks)
   - The key should look like: `f0nCBEWvqEXI88d5xL24KXYxEXY6N2t8cqnuLrw3` (no quotes around it)

3. **Redeploy after adding/changing the variable:**
   - Vercel requires a redeploy for environment variable changes
   - Use: `vercel --prod --yes` or redeploy from the Vercel dashboard

4. **Check server logs:**
   - The console will show: "PRINTFUL_API_KEY is set (length: X characters, starts with: ...)"
   - This confirms the key is being read by the server
   - Compare the first 3 characters to ensure it matches your actual key
