export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: 'pillow-sprays' | 'wax-melts' | 'prints' | 'tshirts'
  stripePriceId?: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Cart {
  items: CartItem[]
  total: number
}
