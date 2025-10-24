'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/contexts/CartContext'

export default function Header() {
  const { getCartCount } = useCart()
  const cartCount = getCartCount()

  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-gray-300 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/" className="flex items-center">
              <Image
                src="/logo-forever-february.svg"
                alt="Forever February"
                width={240}
                height={120}
                className="h-12 w-auto object-contain"
                style={{ aspectRatio: '2/1' }}
                priority
              />
            </Link>
          </motion.div>
          
          <nav className="hidden md:flex space-x-8">
            <Link href="/products" className="text-gray-700 hover:text-black transition-colors duration-300 sketchy-font-alt">
              PRODUCTS
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-black transition-colors duration-300 sketchy-font-alt">
              ABOUT
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-black transition-colors duration-300 sketchy-font-alt">
              CONTACT
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link href="/cart">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded font-bold transition-colors duration-300 sketchy-font-alt relative"
              >
                CART ({cartCount})
                {cartCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold"
                  >
                    {cartCount}
                  </motion.div>
                )}
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
