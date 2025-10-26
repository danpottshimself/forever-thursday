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

    // Fetch store products from Printful
    const response = await fetch('https://api.printful.com/store/products', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      console.error('Failed to fetch Printful products:', response.statusText)
      return []
    }

    const data: PrintfulResponse = await response.json()

    if (!data.result || !data.result.items) {
      console.error('Invalid Printful response format')
      return []
    }

    // Transform Printful products to our Product format
    const products: PrintfulProduct[] = data.result.items
      .filter(item => item.type === 't-shirt' || item.main_category_id === 5) // Filter for t-shirts
      .map(item => {
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

    return products
  } catch (error) {
    console.error('Error fetching Printful products:', error)
    return []
  }
}

