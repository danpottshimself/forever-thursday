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
    const apiKey = process.env.PRINTFUL_API_KEY
    
    if (!apiKey) {
      console.error('PRINTFUL_API_KEY is not set')
      return []
    }

    // Encode API key for Basic auth
    const base64Key = Buffer.from(apiKey).toString('base64')
    
    console.log('Fetching from Printful store/products endpoint...')
    
    // Try store/products endpoint first
    const storeResponse = await fetch('https://api.printful.com/store/products', {
      headers: {
        'Authorization': `Basic ${base64Key}`,
        'Content-Type': 'application/json'
      }
    })

    console.log('Store products response status:', storeResponse.status)

    let response = storeResponse
    let data: PrintfulResponse

    if (!storeResponse.ok && storeResponse.status === 401) {
      console.log('store/products failed, trying sync/products...')
      // Try sync/products as fallback
      response = await fetch('https://api.printful.com/sync/products', {
        headers: {
          'Authorization': `Basic ${base64Key}`,
          'Content-Type': 'application/json'
        }
      })
      console.log('Sync products response status:', response.status)
    }

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Failed to fetch Printful products:', response.status, errorText)
      return []
    }

    data = await response.json()
    console.log('Printful API response:', JSON.stringify(data, null, 2))

    if (!data?.result?.items) {
      console.error('Invalid Printful response format')
      return []
    }

    console.log('Total Printful products:', data.result.items.length)
    
    // Transform ALL Printful products - don't filter
    const products: PrintfulProduct[] = data.result.items.map(item => {
      console.log(`Product ${item.id}: type=${item.type}, category=${item.main_category_id}`)
      
      // Get the main image
      const mainImage = item.images?.length > 0 
        ? item.images[0].url 
        : '/images/print-placeholder.svg'
      
      // Get the lowest priced variant
      const lowestPriceVariant = item.variants
        .filter(v => v.availability_status === 'in_stock')
        .reduce((lowest, current) => 
          Number.parseFloat(current.retail_price || current.price) < Number.parseFloat(lowest.retail_price || lowest.price) 
            ? current 
            : lowest
        , item.variants[0])

      const price = Number.parseFloat(lowestPriceVariant?.retail_price || lowestPriceVariant?.price || '29.99')

      return {
        id: `printful-${item.id}`,
        name: item.name,
        description: item.description || 'Custom t-shirt from Forever February',
        price: price,
        image: mainImage,
        category: 'tshirts' as const
      }
    })

    console.log('Transformed Printful products:', products.length)
    return products
  } catch (error) {
    console.error('Error fetching Printful products:', error)
    return []
  }
}

