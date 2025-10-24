'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import { Menu, X, ShoppingCart } from 'lucide-react'

export default function Header() {
  const { getCartCount } = useCart()
  const cartCount = getCartCount()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-gray-300 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between">
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
          
          <nav className="flex space-x-8">
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

        {/* Mobile Layout */}
        <div className="md:hidden flex items-center justify-between">
          {/* Mobile Menu Button - Left */}
          <div className="flex items-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleMobileMenu}
              className="p-2 text-black hover:bg-gray-100 rounded-lg transition-colors duration-300"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>

          {/* Mobile Logo - Centered */}
          <div className="flex-1 flex justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo-forever-february.svg"
                  alt="Forever February"
                  width={200}
                  height={100}
                  className="h-10 w-auto object-contain"
                  style={{ aspectRatio: '2/1' }}
                  priority
                />
              </Link>
            </motion.div>
          </div>

          {/* Mobile Cart Button - Right */}
          <div className="flex items-center">
            <Link href="/cart">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-black hover:bg-gray-800 text-white p-2 rounded font-bold transition-colors duration-300 sketchy-font-alt relative"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                  >
                    {cartCount}
                  </motion.div>
                )}
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 border-t border-gray-200">
                <nav className="flex flex-col space-y-4">
                  <Link 
                    href="/products" 
                    onClick={closeMobileMenu}
                    className="text-gray-700 hover:text-black transition-colors duration-300 sketchy-font-alt text-center py-2"
                  >
                    PRODUCTS
                  </Link>
                  <Link 
                    href="/about" 
                    onClick={closeMobileMenu}
                    className="text-gray-700 hover:text-black transition-colors duration-300 sketchy-font-alt text-center py-2"
                  >
                    ABOUT
                  </Link>
                  <Link 
                    href="/contact" 
                    onClick={closeMobileMenu}
                    className="text-gray-700 hover:text-black transition-colors duration-300 sketchy-font-alt text-center py-2"
                  >
                    CONTACT
                  </Link>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
