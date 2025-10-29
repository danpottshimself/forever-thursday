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

    // Size ordering for proper sorting
    const sizeOrder: { [key: string]: number } = {
      'XS': 1,
      'S': 2,
      'M': 3,
      'L': 4,
      'XL': 5,
      '2XL': 6,
      'XXL': 6,
      '3XL': 7,
      'XXXL': 7,
      '4XL': 8,
      '5XL': 9,
      'One Size': 99
    }

    const getSizeOrder = (size: string): number => {
      return sizeOrder[size.toUpperCase()] || 999
    }

    // Organize variants by size and color
    const organizedVariants: {
      sizes: string[]
      colors: { name: string; variants: any[]; images: string[] }[]
      allVariants: any[]
    } = {
      sizes: [],
      colors: [],
      allVariants: variants
    }

    const sizeSet = new Set<string>()
    const colorMap = new Map<string, { variants: any[], images: Set<string> }>()

    variants.forEach((variant: any) => {
      const size = variant.size || 'One Size'
      const color = variant.color || variant.product?.color || 'Default'
      
      sizeSet.add(size)
      
      if (!colorMap.has(color)) {
        colorMap.set(color, { variants: [], images: new Set() })
      }
      const colorData = colorMap.get(color)!
      colorData.variants.push(variant)
      
      // Collect images from variant - store thumbnail_url separately for prioritization
      if (variant.thumbnail_url) {
        // Add thumbnail_url first so it appears first when converted to array
        const existingImages = Array.from(colorData.images)
        colorData.images.clear()
        colorData.images.add(variant.thumbnail_url)
        existingImages.forEach(img => {
          if (img !== variant.thumbnail_url) {
            colorData.images.add(img)
          }
        })
      }
      if (variant.files && Array.isArray(variant.files)) {
        variant.files.forEach((file: any) => {
          if (file.preview_url && file.preview_url !== variant.thumbnail_url) {
            colorData.images.add(file.preview_url)
          }
          if (file.url && file.url !== variant.thumbnail_url) {
            colorData.images.add(file.url)
          }
        })
      }
      if (variant.image && variant.image !== variant.thumbnail_url) {
        colorData.images.add(variant.image)
      }
    })

    // Sort sizes using custom order
    organizedVariants.sizes = Array.from(sizeSet).sort((a, b) => {
      const orderA = getSizeOrder(a)
      const orderB = getSizeOrder(b)
      if (orderA !== orderB) return orderA - orderB
      return a.localeCompare(b)
    })

    organizedVariants.colors = Array.from(colorMap.entries()).map(([name, data]) => {
      // Convert Set to Array and prioritize thumbnail_urls
      const allImages = Array.from(data.images)
      const thumbnailUrls = allImages.filter(img => 
        typeof img === 'string' && (
          img.includes('thumbnail') || 
          img.includes('/thumb') || 
          img.includes('_thumb')
        )
      )
      const otherImages = allImages.filter(img => !thumbnailUrls.includes(img))
      
      // Return thumbnails first, then other images
      return {
        name,
        variants: data.variants,
        images: [...thumbnailUrls, ...otherImages]
      }
    })

    // Also include product-level images - prioritize sync_product.thumbnail_url
    const productImages: string[] = []
    
    // Check sync_product.thumbnail_url first (user specified this field)
    if (productData.sync_product?.thumbnail_url) {
      productImages.push(productData.sync_product.thumbnail_url)
    }
    // Then check top-level thumbnail_url
    else if (productData.thumbnail_url) {
      productImages.push(productData.thumbnail_url)
    }
    
    // Then other images
    if (productData.images && Array.isArray(productData.images)) {
      productImages.push(...productData.images.map((img: any) => img.url || img))
    }

    // Also include sync_product.thumbnail_url in the response for easy access
    const thumbnailUrl = productData.sync_product?.thumbnail_url || productData.thumbnail_url || null

    return NextResponse.json({
      product: productData,
      variants: organizedVariants,
      images: productImages,
      thumbnailUrl: thumbnailUrl
    })
  } catch (error: any) {
    console.error('Error fetching Printful product:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

