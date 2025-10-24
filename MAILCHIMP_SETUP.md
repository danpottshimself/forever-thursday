# Mailchimp Integration Setup

## Required Environment Variables

Add these to your `.env.local` file:

```bash
# Mailchimp Transactional API Key (formerly Mandrill)
# Get this from: https://mailchimp.com/developer/transactional/
MAILCHIMP_TRANSACTIONAL_API_KEY=your_mailchimp_transactional_api_key_here

# Alternative: Regular Mailchimp API Key
# Get this from: https://us1.admin.mailchimp.com/account/api/
MAILCHIMP_API_KEY=your_mailchimp_api_key_here

# Mailchimp Server Prefix (e.g., 'us1', 'us2', etc.)
# Found in your Mailchimp API key
MAILCHIMP_SERVER_PREFIX=us1

# Mailchimp List ID (for newsletter signups)
# Get this from: Audience > Settings > Audience name and defaults
MAILCHIMP_LIST_ID=your_mailchimp_list_id_here
```

## Setup Instructions

1. **Create Mailchimp Account**: Sign up at mailchimp.com
2. **Get Transactional API Key**: 
   - Go to https://mailchimp.com/developer/transactional/
   - Create a new API key
   - Copy the key to your `.env.local` file
3. **Set Up Domain**: 
   - Add your domain to Mailchimp Transactional
   - Verify domain ownership
4. **Test Integration**: 
   - Submit the contact form
   - Check your email for the message

## Fallback Behavior

If Mailchimp integration fails, the contact form will:
- Log the submission to the console
- Still show success message to user
- Allow manual processing of submissions

## Vercel Deployment

Add the environment variables to your Vercel project:
1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add each variable with the correct values
