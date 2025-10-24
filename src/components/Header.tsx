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
        <div className={`md:hidden flex items-center justify-between ${isMobileMenuOpen ? 'opacity-0 pointer-events-none' : ''}`}>
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={closeMobileMenu}
            >
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute left-0 top-0 h-full w-80 bg-white shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  {/* Close Button */}
                  <div className="flex justify-end mb-8">
                    <button
                      onClick={closeMobileMenu}
                      className="p-2 text-black hover:bg-gray-100 rounded-lg transition-colors duration-300"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  {/* Navigation */}
                  <nav className="flex flex-col space-y-6">
                    <Link 
                      href="/products" 
                      onClick={closeMobileMenu}
                      className="text-gray-700 hover:text-black transition-colors duration-300 sketchy-font-alt text-lg py-3 border-b border-gray-200"
                    >
                      PRODUCTS
                    </Link>
                    <Link 
                      href="/about" 
                      onClick={closeMobileMenu}
                      className="text-gray-700 hover:text-black transition-colors duration-300 sketchy-font-alt text-lg py-3 border-b border-gray-200"
                    >
                      ABOUT
                    </Link>
                    <Link 
                      href="/contact" 
                      onClick={closeMobileMenu}
                      className="text-gray-700 hover:text-black transition-colors duration-300 sketchy-font-alt text-lg py-3 border-b border-gray-200"
                    >
                      CONTACT
                    </Link>
                  </nav>

                  {/* Logo at bottom */}
                  <div className="absolute bottom-6 left-6">
                    <Image
                      src="/logo-forever-february.svg"
                      alt="Forever February"
                      width={120}
                      height={60}
                      className="h-8 w-auto object-contain opacity-50"
                      style={{ aspectRatio: '2/1' }}
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
