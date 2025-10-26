'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import ProductCard from '@/components/ProductCard'
import ProductModal from '@/components/ProductModal'
import { products } from '@/lib/data'
import { Product } from '@/types'

export default function ProductsPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [printfulProducts, setPrintfulProducts] = useState<Product[]>([])
  const [isLoadingPrintful, setIsLoadingPrintful] = useState(true)

  const openModal = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
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

  useEffect(() => {
    const fetchPrintfulProducts = async () => {
      try {
        const response = await fetch('/api/printful')
        if (response.ok) {
          const data = await response.json()
          setPrintfulProducts(data.products || [])
        }
      } catch (error) {
        console.error('Error fetching Printful products:', error)
      } finally {
        setIsLoadingPrintful(false)
      }
    }

    fetchPrintfulProducts()
  }, [])

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="mb-8 w-full max-w-2xl mx-auto">
              <Image
                src="/logo-forever-february.svg"
                alt="Forever February"
                width={600}
                height={300}
                className="w-full h-auto object-contain"
                style={{ aspectRatio: '2/1' }}
                priority
              />
            </div>
            <p className="text-xl md:text-2xl text-gray-700 sketchy-font-alt">
              Products for the <span className="text-black">emo soul</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 sketchy-font-alt">
              <span className="text-black">SHOP</span> THE{' '}
              <span className="text-black">COLLECTION</span>
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <ProductCard product={product} onClick={openModal} />
              </motion.div>
            ))}
          </div>
          
          {/* Additional placeholder products */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {[
              {
                id: '7',
                name: 'Midnight Dreams Pillow Spray',
                description: 'Lavender and chamomile for peaceful sleep',
                price: 22.99,
                image: '/images/pillow-spray-3.jpg',
                category: 'pillow-sprays' as const,
              },
              {
                id: '8',
                name: 'Gothic Romance Wax Melt',
                description: 'Dark rose and amber for mysterious nights',
                price: 21.99,
                image: '/images/wax-melt-3.jpg',
                category: 'wax-melts' as const,
              },
              {
                id: '9',
                name: 'Emo Vibes Print',
                description: 'Hand-drawn artwork celebrating emo culture',
                price: 32.99,
                image: '/images/print-3.jpg',
                category: 'prints' as const,
              },
              {
                id: '10',
                name: 'Broken Heart Pillow Spray',
                description: 'Rose and vanilla for healing moments',
                price: 25.99,
                image: '/images/pillow-spray-4.jpg',
                category: 'pillow-sprays' as const,
              },
              {
                id: '11',
                name: 'Dark Angel Wax Melt',
                description: 'Jasmine and sandalwood for divine dreams',
                price: 20.99,
                image: '/images/wax-melt-4.jpg',
                category: 'wax-melts' as const,
              },
              {
                id: '12',
                name: 'Forever February Art Print',
                description: 'Exclusive artwork featuring our signature style',
                price: 39.99,
                image: '/images/print-4.jpg',
                category: 'prints' as const,
              },
            ].map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * (index + 6) }}
              >
                <ProductCard product={product} onClick={openModal} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* T-Shirts Section from Printful */}
      {printfulProducts.length > 0 && (
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 sketchy-font-alt">
                <span className="text-black">SHOP</span> T-SHIRTS{' '}
                <span className="text-black">FROM PRINTFUL</span>
              </h2>
            </motion.div>
            
            {isLoadingPrintful ? (
              <div className="text-center py-12">
                <div className="inline-block animate-pulse">
                  <div className="h-12 w-48 bg-gray-300 rounded mx-auto"></div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {printfulProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                  >
                    <ProductCard product={product} onClick={openModal} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-16 px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="text-center"
        >
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold mb-8 sketchy-font-alt">
              <span className="text-black">FEEL</span> THE{' '}
              <span className="text-black">VIBE</span>
            </h3>
            <p className="text-lg text-gray-700 mb-8 sketchy-font-alt">
              Each product is crafted with love for the emo community. 
              From pillow sprays that help you sleep to prints that speak to your soul.
            </p>
            <a
              href="/"
              className="inline-block px-8 py-4 bg-black text-white font-bold rounded-lg hover:scale-105 transition-transform duration-300 sketchy-font-alt"
            >
              BACK TO HOME
            </a>
          </div>
        </motion.div>
      </section>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeModal}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  )
}
