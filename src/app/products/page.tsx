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
  const [printfulError, setPrintfulError] = useState<string | null>(null)

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
        const data = await response.json()
        console.log('Printful API response:', data)
        
        if (!response.ok) {
          setPrintfulError(data.error || data.details || 'Failed to fetch products')
          console.error('Printful API error:', data)
        } else {
          setPrintfulProducts(data.products || [])
          console.log('Printful products loaded:', data.products?.length || 0)
        }
      } catch (error) {
        console.error('Error fetching Printful products:', error)
        setPrintfulError('Failed to connect to Printful API')
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
          
        </div>
      </section>

      {/* T-Shirts Section from Printful */}
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
          ) : printfulError ? (
            <div className="text-center py-12 bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-600 font-bold sketchy-font-alt mb-2">Printful API Error</p>
              <p className="text-red-500 text-sm sketchy-font-alt">{printfulError}</p>
              <p className="text-gray-500 text-xs mt-4 sketchy-font-alt">
                Make sure to add your PRINTFUL_API_KEY to Vercel environment variables
              </p>
            </div>
          ) : printfulProducts.length === 0 ? (
            <div className="text-center py-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <p className="text-yellow-600 font-bold sketchy-font-alt">
                No T-shirts available from Printful
              </p>
              <p className="text-gray-500 text-sm mt-2 sketchy-font-alt">
                Add products to your Printful store to see them here
              </p>
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
