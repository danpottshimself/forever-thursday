import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    // Validate email
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Add to Mailchimp list
    const mailchimpResponse = await fetch(
      `https://${process.env.MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_LIST_ID}/members`,
      {
        method: 'POST',
        headers: {
          'Authorization': `apikey ${process.env.MAILCHIMP_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: email,
          status: 'subscribed',
          merge_fields: {
            FNAME: '',
            LNAME: '',
          },
          tags: ['newsletter', 'forever-february', 'emo-crew'],
        }),
      }
    )

    if (!mailchimpResponse.ok) {
      const errorData = await mailchimpResponse.json()
      
      // If user is already subscribed, that's okay
      if (errorData.title === 'Member Exists') {
        return NextResponse.json(
          { message: 'You are already subscribed to our newsletter!' },
          { status: 200 }
        )
      }
      
      // Log error for debugging
      console.error('Mailchimp API error:', errorData)
      
      // Fallback: Log the subscription for manual processing
      console.log('Newsletter signup (fallback):', { email, timestamp: new Date().toISOString() })
      
      return NextResponse.json(
        { message: 'Thank you for subscribing! Welcome to the emo crew!' },
        { status: 200 }
      )
    }

    const result = await mailchimpResponse.json()
    
    return NextResponse.json(
      { message: 'Successfully subscribed to newsletter!' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Newsletter signup error:', error)
    
    // Fallback: Always return success to user, but log the error
    return NextResponse.json(
      { message: 'Thank you for subscribing! Welcome to the emo crew!' },
      { status: 200 }
    )
  }
}
