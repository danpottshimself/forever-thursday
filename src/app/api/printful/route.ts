import { NextResponse } from 'next/server'
import { fetchPrintfulProducts } from '@/lib/printful'

export async function GET() {
  try {
    const products = await fetchPrintfulProducts()
    
    return NextResponse.json({ products })
  } catch (error) {
    console.error('Error in printful API route:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products', products: [] },
      { status: 500 }
    )
  }
}

