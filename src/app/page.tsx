'use client'

import { motion } from 'framer-motion'
import Hero from '@/components/Hero'
import ProductBanner from '@/components/ProductBanner'
import { products } from '@/lib/data'

export default function Home() {
  return (
    <div className="bg-white">
      <Hero />
      <ProductBanner products={products} />
    </div>
  )
}
