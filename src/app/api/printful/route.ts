import { NextResponse } from 'next/server'
import { fetchPrintfulProducts } from '@/lib/printful'

export async function GET() {
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
    
    return NextResponse.json({ products })
  } catch (error) {
    console.error('Error in printful API route:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products', products: [], details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

