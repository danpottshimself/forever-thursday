'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Product } from '@/types'

interface ProductCardProps {
  product: Product
  onClick?: (product: Product) => void
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      className="bg-white rounded-lg overflow-hidden border-2 border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={() => onClick?.(product)}
    >
      <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-4"
        />
        <div className="absolute top-4 right-4 bg-black text-white px-2 py-1 rounded text-sm font-bold sketchy-font-alt">
          ${product.price}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-black sketchy-font-alt">{product.name}</h3>
        <p className="text-gray-600 mb-4 text-sm sketchy-font-alt">{product.description}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
            {product.category.replace('-', ' ')}
          </span>
          <span className="text-sm text-gray-500 sketchy-font-alt">
            Click to view details
          </span>
        </div>
      </div>
    </motion.div>
  )
}
