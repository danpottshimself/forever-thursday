'use client'

import { useEffect, useState } from 'react'
import Hero from '@/components/Hero'
import ProductBanner from '@/components/ProductBanner'
import { products } from '@/lib/data'
import { Product } from '@/types'

export default function Home() {
  const [printfulProducts, setPrintfulProducts] = useState<Product[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])

  useEffect(() => {
    // Fetch Printful products
    const fetchPrintfulProducts = async () => {
      try {
        const response = await fetch('/api/printful')
        if (response.ok) {
          const data = await response.json()
          setPrintfulProducts(data.products || [])
        }
      } catch (error) {
        console.error('Error fetching Printful products:', error)
      }
    }

    fetchPrintfulProducts()
  }, [])

  useEffect(() => {
    // Combine local products (filtered) with Printful products
    const availableLocalProducts = products.filter(product => !product.isSoldOut)
    setAllProducts([...printfulProducts, ...availableLocalProducts])
  }, [printfulProducts])

  return (
    <div className="bg-white">
      <Hero />
      <ProductBanner products={allProducts} />
    </div>
  )
}
