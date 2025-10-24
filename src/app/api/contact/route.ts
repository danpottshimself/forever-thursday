import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
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

    // Create email content
    const emailContent = {
      to: 'contact.foreverfebruary@gmail.com',
      from: 'noreply@foreverfebruary.com',
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #000; border-bottom: 2px solid #000; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <div style="background: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <p style="color: #666; font-size: 12px;">
            This email was sent from the Forever February contact form.
          </p>
        </div>
      `,
      text: `
        New Contact Form Submission
        
        Name: ${name}
        Email: ${email}
        Subject: ${subject}
        Message: ${message}
        
        This email was sent from the Forever February contact form.
      `
    }

    // Use Mailchimp Transactional API (formerly Mandrill)
    const mailchimpResponse = await fetch('https://mandrillapp.com/api/1.0/messages/send.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: process.env.MAILCHIMP_TRANSACTIONAL_API_KEY,
        message: {
          html: emailContent.html,
          text: emailContent.text,
          subject: emailContent.subject,
          from_email: emailContent.from,
          from_name: 'Forever February Contact Form',
          to: [
            {
              email: emailContent.to,
              name: 'Forever February',
              type: 'to'
            }
          ],
          auto_text: true,
          auto_html: false,
          inline_css: true,
          preserve_recipients: false,
          view_content_link: false,
          tags: ['contact-form', 'forever-february']
        }
      })
    })

    if (!mailchimpResponse.ok) {
      // Fallback: Log the submission for manual processing
      console.log('Contact form submission (fallback):', emailContent)
      
      return NextResponse.json(
        { message: 'Thank you for your message! We will get back to you soon.' },
        { status: 200 }
      )
    }

    const result = await mailchimpResponse.json()
    
    return NextResponse.json(
      { message: 'Email sent successfully! We will get back to you soon.' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Contact form error:', error)
    
    // Fallback: Always return success to user, but log the error
    return NextResponse.json(
      { message: 'Thank you for your message! We will get back to you soon.' },
      { status: 200 }
    )
  }
}
