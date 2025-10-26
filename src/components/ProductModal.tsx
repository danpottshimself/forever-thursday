'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import Image from 'next/image'
import { Product } from '@/types'
import { X, Plus, Minus, ShoppingCart, Heart, Star } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

interface ProductModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  favorites: Set<string>
  onToggleFavorite: (productId: string) => void
}

export default function ProductModal({ 
  product, 
  isOpen, 
  onClose, 
  favorites, 
  onToggleFavorite 
}: ProductModalProps) {
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)

  if (!product) return null

  const isSoldOut = product.isSoldOut || false

  const handleAddToCart = () => {
    if (!isSoldOut) {
      addToCart(product, quantity)
      onClose()
      setQuantity(1) // Reset quantity
    }
  }

  const incrementQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, 10)) // Max 10
  }

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 1)) // Min 1
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors"
            >
              <X size={24} className="text-black" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* Product Image */}
              <div className="relative h-64 md:h-full bg-gradient-to-br from-gray-100 to-gray-200">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-8"
                />
                
                {/* Favorite Button */}
                <button
                  onClick={() => onToggleFavorite(product.id)}
                  className="absolute top-4 left-4 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                >
                  <Heart 
                    size={20} 
                    className={favorites.has(product.id) ? 'text-red-500 fill-current' : 'text-white'} 
                  />
                </button>

                {/* Rating Stars */}
                <div className="absolute bottom-4 left-4 flex gap-1">
                  {new Array(5).fill(0).map((_, i) => (
                    <Star 
                      key={`star-${i}`} 
                      size={16} 
                      className={i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'} 
                    />
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-8 lg:p-10">
                <div className="mb-8">
                  <h2 className="text-3xl lg:text-4xl font-bold text-black mb-3 sketchy-font-alt">
                    {product.name}
                  </h2>
                  <p className="text-gray-600 text-lg lg:text-xl sketchy-font-alt mb-6">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-3xl lg:text-4xl font-bold text-black sketchy-font">
                      ${product.price}
                    </span>
                    <span className="text-sm text-gray-500 uppercase tracking-wide bg-gray-100 px-3 py-1 rounded">
                      {product.category.replace('-', ' ')}
                    </span>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="mb-8">
                  <label className="block text-sm font-bold text-black mb-3 sketchy-font-alt">
                    QUANTITY
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={decrementQuantity}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Minus size={20} />
                    </button>
                    <span className="text-2xl font-bold text-black sketchy-font min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={incrementQuantity}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {isSoldOut ? (
                    <div className="w-full bg-red-600 text-white font-bold py-4 px-4 rounded-lg sketchy-font-alt text-center">
                      SOLD OUT
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={handleAddToCart}
                        className="flex-1 bg-black text-white font-bold py-4 px-4 rounded-lg hover:bg-gray-800 transition-all duration-300 sketchy-font-alt flex items-center justify-center gap-2 text-base whitespace-nowrap"
                      >
                        <ShoppingCart size={20} />
                        <span>ADD {quantity} TO CART</span>
                      </button>
                      <button
                        onClick={() => {
                          handleAddToCart()
                          // Redirect to cart page after adding
                          setTimeout(() => {
                            window.location.href = '/cart'
                          }, 500)
                        }}
                        className="flex-1 bg-gray-800 text-white font-bold py-4 px-4 rounded-lg hover:bg-gray-700 transition-all duration-300 sketchy-font-alt flex items-center justify-center gap-2 text-base whitespace-nowrap"
                      >
                        <ShoppingCart size={20} />
                        <span>BUY NOW - ${(product.price * quantity).toFixed(2)}</span>
                      </button>
                    </>
                  )}
                </div>

                {/* Product Details */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-bold text-black mb-3 sketchy-font-alt">
                    PRODUCT DETAILS
                  </h3>
                  <ul className="text-gray-600 space-y-2 sketchy-font-alt">
                    <li>• Handmade in the UK by elder emos</li>
                    <li>• Made with sustainable, natural ingredients</li>
                    <li>• Eco-friendly packaging</li>
                    <li>• Fair trade materials</li>
                    <li>• No animal testing</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
