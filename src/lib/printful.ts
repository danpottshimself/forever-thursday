export interface PrintfulProduct {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: 'tshirts'
}

export interface PrintfulStoreProduct {
  id: number
  name: string
  description: string
  main_category_id: number
  type: string
  currency: string
  created: string
  updated: string
  images: Array<{
    id: number
    file_name: string
    url: string
  }>
  variants: Array<{
    id: number
    product_id: number
    name: string
    size: string
    color: string
    price: string
    availability_status: string
    availability_status_info: {
      stock: {
        in_stock: boolean
        quantity_available: number
      }
    }
    retail_price: string
    thumbnail_url: string
  }>
}

interface PrintfulResponse {
  code: number
  result: {
    items: PrintfulStoreProduct[]
    pagination?: {
      total: number
      limit: number
      offset: number
    }
  }
}

export async function fetchPrintfulProducts(): Promise<PrintfulProduct[]> {
  try {
    const apiKey = process.env.PRINTFUL_API_KEY?.trim()
    
    if (!apiKey) {
      console.error('PRINTFUL_API_KEY is not set in environment variables')
      throw new Error('PRINTFUL_API_KEY environment variable is not configured')
    }

    // Log that key exists (but not the actual key for security)
    console.log('PRINTFUL_API_KEY is set (length:', apiKey.length, 'characters, starts with:', apiKey.substring(0, 3) + '...')
    console.log('Fetching from Printful store/products endpoint...')
    
    // Try store/products endpoint first with Bearer auth
    const storeResponse = await fetch('https://api.printful.com/store/products', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    })

    console.log('Store products response status:', storeResponse.status)

    let response = storeResponse
    let data: PrintfulResponse

    if (!storeResponse.ok && storeResponse.status === 401) {
      const errorData = await storeResponse.json().catch(() => ({ message: 'Unauthorized' }))
      console.error('401 Unauthorized - Invalid API key. Error:', errorData)
      
      // Don't try sync/products if auth failed - same key will fail there too
      throw new Error(`Invalid Printful API key: ${errorData.result || errorData.message || 'Unauthorized'}`)
    }

    if (!storeResponse.ok) {
      const errorText = await storeResponse.text()
      console.error('Failed to fetch Printful products:', storeResponse.status, errorText)
      
      // Try sync/products as fallback for non-401 errors
      console.log('store/products failed, trying sync/products...')
      response = await fetch('https://api.printful.com/sync/products', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      })
      console.log('Sync products response status:', response.status)
      
      if (!response.ok) {
        const syncErrorText = await response.text()
        console.error('Sync products also failed:', response.status, syncErrorText)
        throw new Error(`Failed to fetch products: ${response.status} - ${syncErrorText}`)
      }
    }

    data = await response.json()
    console.log('Printful API response:', JSON.stringify(data, null, 2))
    console.log('Response has result?:', !!data.result)
    console.log('Response has items?:', !!data.result?.items)
    console.log('Items array length:', data.result?.items?.length || 0)

    // Handle different response formats
    let items: any[] = []
    const responseData = data as any
    if (responseData.result?.items && Array.isArray(responseData.result.items)) {
      items = responseData.result.items
    } else if (Array.isArray(responseData.result)) {
      items = responseData.result
    } else if (Array.isArray(responseData)) {
      items = responseData
    } else if (responseData.items && Array.isArray(responseData.items)) {
      items = responseData.items
    }
    
    console.log('Total Printful products found:', items.length)
    
    if (items.length === 0) {
      console.warn('No products found in response. Response structure:', {
        hasResult: !!responseData.result,
        hasItems: !!responseData.items,
        isArray: Array.isArray(responseData),
        resultIsArray: Array.isArray(responseData.result),
        keys: Object.keys(responseData)
      })
      return []
    }
    
    // Transform ALL Printful products
    // Note: items contains products with variants as a count (number), not array
    // Fetch product details for accurate pricing
    const products: PrintfulProduct[] = await Promise.all(
      items.map(async (item: any) => {
        console.log(`Processing product ${item.id}: name=${item.name}, variants count=${item.variants}`)
        
        // Use thumbnail_url from the product
        let mainImage = item.thumbnail_url || '/images/print-placeholder.svg'
        
        // Try to fetch product details for pricing
        let price = 29.99 // Default price
        try {
          const productDetailResponse = await fetch(`https://api.printful.com/store/products/${item.id}`, {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            }
          })
          
          if (productDetailResponse.ok) {
            const productDetail = await productDetailResponse.json()
            const productData = productDetail.result || productDetail
            
            // Get variants array from product details
            const variants = Array.isArray(productData.sync_variants) 
              ? productData.sync_variants 
              : Array.isArray(productData.variants)
              ? productData.variants
              : []
            
            if (variants.length > 0) {
              // Find lowest price from in-stock variants
              const inStockVariants = variants.filter((v: any) => {
                const status = v?.availability_status || v?.available || true
                return status !== false && status !== 'discontinued'
              })
              
              if (inStockVariants.length > 0) {
                const lowestPriceVariant = inStockVariants.reduce((lowest: any, current: any) => {
                  const currentPrice = Number.parseFloat(current?.retail_price || current?.price || '999999')
                  const lowestPrice = Number.parseFloat(lowest?.retail_price || lowest?.price || '999999')
                  return currentPrice < lowestPrice ? current : lowest
                }, inStockVariants[0])
                
                price = Number.parseFloat(lowestPriceVariant?.retail_price || lowestPriceVariant?.price || '29.99')
              }
            }
            
            // Update image if product details has better one
            if (productData.thumbnail_url) {
              mainImage = productData.thumbnail_url
            } else if (productData.images?.length > 0) {
              mainImage = productData.images[0].url || productData.images[0]
            }
          }
        } catch (err) {
          console.warn(`Could not fetch details for product ${item.id}:`, err)
          // Continue with default price
        }

        return {
          id: `printful-${item.id}`,
          name: item.name,
          description: item.description || `Custom ${item.name} from Forever February`,
          price: price,
          image: mainImage,
          category: 'tshirts' as const
        }
      })
    )

    console.log('Transformed Printful products:', products.length)
    return products
  } catch (error) {
    console.error('Error fetching Printful products:', error)
    return []
  }
}

