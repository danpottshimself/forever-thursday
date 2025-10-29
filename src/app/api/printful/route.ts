import { NextRequest, NextResponse } from 'next/server'
import { fetchPrintfulProducts } from '@/lib/printful'

// Disable caching for this route
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    console.log('Printful API route called')
    
    const apiKey = process.env.PRINTFUL_API_KEY
    if (!apiKey) {
      console.error('PRINTFUL_API_KEY is not set in environment variables')
      return NextResponse.json(
        { error: 'Printful API key not configured', products: [] },
        { status: 500 }
      )
    }
    
    const products = await fetchPrintfulProducts()
    console.log('Printful products fetched successfully:', products.length)
    
    // Add cache control headers to prevent caching
    const response = NextResponse.json({ products })
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error) {
    console.error('Error in printful API route:', error)
    const response = NextResponse.json(
      { error: 'Failed to fetch products', products: [], details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
    return response
  }
}

