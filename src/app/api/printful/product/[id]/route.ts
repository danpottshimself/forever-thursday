import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const apiKey = process.env.PRINTFUL_API_KEY?.trim()
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'PRINTFUL_API_KEY not configured' },
        { status: 500 }
      )
    }

    const { id: productId } = await params
    
    // Fetch product details including variants
    const response = await fetch(`https://api.printful.com/store/products/${productId}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: `Failed to fetch product: ${errorText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    const productData = data.result || data

    // Extract variants
    const variants = Array.isArray(productData.sync_variants) 
      ? productData.sync_variants 
      : Array.isArray(productData.variants)
      ? productData.variants
      : []

    // Organize variants by size and color
    const organizedVariants: {
      sizes: string[]
      colors: { name: string; variants: any[] }[]
      allVariants: any[]
    } = {
      sizes: [],
      colors: [],
      allVariants: variants
    }

    const sizeSet = new Set<string>()
    const colorMap = new Map<string, any[]>()

    variants.forEach((variant: any) => {
      const size = variant.size || 'One Size'
      const color = variant.color || variant.product?.color || 'Default'
      
      sizeSet.add(size)
      
      if (!colorMap.has(color)) {
        colorMap.set(color, [])
      }
      colorMap.get(color)!.push(variant)
    })

    organizedVariants.sizes = Array.from(sizeSet).sort()
    organizedVariants.colors = Array.from(colorMap.entries()).map(([name, vars]) => ({
      name,
      variants: vars
    }))

    return NextResponse.json({
      product: productData,
      variants: organizedVariants
    })
  } catch (error: any) {
    console.error('Error fetching Printful product:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

