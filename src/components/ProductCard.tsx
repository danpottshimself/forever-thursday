'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Product } from '@/types'
import { ShoppingCart, Eye } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

interface ProductCardProps {
  product: Product
  onClick?: (product: Product) => void
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const { addToCart } = useCart()
  const isSoldOut = product.isSoldOut || false

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the card click
    if (!isSoldOut) {
      addToCart(product)
    }
  }

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the card click
    onClick?.(product)
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      className="bg-white rounded-lg overflow-hidden border-2 border-gray-300 hover:shadow-lg transition-all duration-300"
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
        {isSoldOut && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold sketchy-font-alt text-xl">
              SOLD OUT
            </div>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-black sketchy-font-alt">{product.name}</h3>
        <p className="text-gray-600 mb-4 text-sm sketchy-font-alt">{product.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
            {product.category.replace('-', ' ')}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleBuyNow}
            disabled={isSoldOut}
            className="flex-1 bg-black text-white font-bold py-2 px-3 rounded-lg hover:bg-gray-800 transition-colors duration-300 sketchy-font-alt flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={16} />
            {isSoldOut ? 'SOLD OUT' : 'BUY NOW'}
          </button>
          <button
            onClick={handleViewDetails}
            className="flex-1 bg-gray-200 text-black font-bold py-2 px-3 rounded-lg hover:bg-gray-300 transition-colors duration-300 sketchy-font-alt flex items-center justify-center gap-2 text-sm"
          >
            <Eye size={16} />
            DETAILS
          </button>
        </div>
      </div>
    </motion.div>
  )
}
