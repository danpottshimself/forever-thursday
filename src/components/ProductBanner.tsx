'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Image from 'next/image'
import { Product } from '@/types'
import { ShoppingCart, Heart, Star } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

interface ProductBannerProps {
  products: Product[]
}

export default function ProductBanner({ products }: ProductBannerProps) {
  const { addToCart } = useCart()
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [showSuccess, setShowSuccess] = useState<string | null>(null)

  const handleAddToCart = (product: Product) => {
    addToCart(product)
    
    // Show success message
    setShowSuccess(product.id)
    setTimeout(() => setShowSuccess(null), 2000)
  }

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId)
      } else {
        newFavorites.add(productId)
      }
      return newFavorites
    })
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-white to-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Banner Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="mb-6 w-full max-w-lg mx-auto">
            <Image
              src="/logo-forever-february.svg"
              alt="Forever February"
              width={500}
              height={250}
              className="w-full h-auto object-contain"
              style={{ aspectRatio: '2/1' }}
            />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold sketchy-font-alt text-black mb-4">
            FEATURED PRODUCTS
          </h2>
          <p className="text-xl text-gray-700 sketchy-font-alt">
            Add to cart • <span className="text-black">Express your emo soul</span>
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.slice(0, 6).map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="group"
            >
              <div className="bg-white rounded-lg overflow-hidden border-2 border-gray-300 hover:scale-105 transition-transform duration-300 shadow-lg">
                {/* Product Image */}
                <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-4"
                  />
                  
                  {/* Favorite Button */}
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <Heart 
                      size={20} 
                      className={favorites.has(product.id) ? 'text-black fill-current' : 'text-gray-600'} 
                    />
                  </button>

                  {/* Rating Stars */}
                  <div className="absolute bottom-4 left-4 flex gap-1">
                    {new Array(5).fill(0).map((_, i) => (
                      <Star 
                        key={`star-${i}`} 
                        size={16} 
                        className={i < 4 ? 'text-black fill-current' : 'text-gray-400'} 
                      />
                    ))}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-black mb-2 sketchy-font-alt">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 sketchy-font-alt">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-black sketchy-font">
                      ${product.price}
                    </span>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">
                      {product.category.replace('-', ' ')}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`flex-1 font-bold py-3 rounded-lg transition-all duration-300 sketchy-font-alt flex items-center justify-center gap-2 ${
                        showSuccess === product.id 
                          ? 'bg-green-600 text-white' 
                          : 'bg-black text-white hover:bg-gray-800'
                      }`}
                    >
                      <ShoppingCart size={18} />
                      {showSuccess === product.id ? 'ADDED!' : 'ADD TO CART'}
                    </button>
                    <button
                      onClick={() => {
                        handleAddToCart(product)
                        // Redirect to cart page after adding
                        setTimeout(() => {
                          window.location.href = '/cart'
                        }, 500)
                      }}
                      className="flex-1 bg-gray-800 text-white font-bold py-3 rounded-lg hover:bg-gray-700 transition-colors duration-300 sketchy-font-alt flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={18} />
                      BUY NOW
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-center mt-12"
        >
          <a
            href="/products"
            className="inline-block px-8 py-4 bg-black text-white font-bold rounded-lg hover:scale-105 transition-transform duration-300 sketchy-font-alt"
          >
            VIEW ALL PRODUCTS
          </a>
        </motion.div>
      </div>
    </section>
  )
}
