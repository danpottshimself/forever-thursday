'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft } from 'lucide-react'

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart()

  if (cart.length === 0) {
    return (
      <div className="bg-white min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
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
              <h1 className="text-4xl md:text-6xl font-bold sketchy-font-alt text-black mb-6">
                YOUR CART
              </h1>
              <p className="text-xl text-gray-700 sketchy-font-alt mb-8">
                Your cart is empty, but your emo soul is full
              </p>
              <Link
                href="/products"
                className="inline-block px-8 py-4 bg-black text-white font-bold rounded-lg hover:scale-105 transition-transform duration-300 sketchy-font-alt"
              >
                START SHOPPING
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
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
            <h1 className="text-4xl md:text-6xl font-bold sketchy-font-alt text-black mb-6">
              YOUR CART
            </h1>
            <p className="text-xl text-gray-700 sketchy-font-alt">
              {cart.length === 1 ? `${cart.length} item` : `${cart.length} items`} ready for checkout
            </p>
          </motion.div>
        </div>
      </section>

      {/* Cart Items */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-6">
            {cart.map((item, index) => (
              <motion.div
                key={item.product.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-gray-50 p-6 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-6">
                  {/* Product Image */}
                  <div className="relative w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-black mb-2 sketchy-font-alt">
                      {item.product.name}
                    </h3>
                    {item.product.variant && (
                      <p className="text-xs text-gray-500 mb-1 sketchy-font-alt">
                        {item.product.variant.size && item.product.variant.color 
                          ? `${item.product.variant.size} - ${item.product.variant.color}`
                          : item.product.variant.size || item.product.variant.color || ''}
                      </p>
                    )}
                    <p className="text-gray-600 text-sm mb-2 sketchy-font-alt">
                      {item.product.description}
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-black sketchy-font">
                        £{item.product.price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
                    >
                      <Minus size={16} className="text-black" />
                    </button>
                    <span className="text-lg font-bold text-black sketchy-font-alt min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
                    >
                      <Plus size={16} className="text-black" />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-2 bg-red-100 hover:bg-red-200 rounded-full transition-colors"
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Cart Summary */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-12 bg-black text-white p-8 rounded-lg"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold sketchy-font-alt">
                ORDER SUMMARY
              </h2>
              <button
                onClick={clearCart}
                className="text-gray-300 hover:text-white transition-colors sketchy-font-alt"
              >
                Clear Cart
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              {cart.map(item => (
                <div key={item.product.id} className="flex justify-between">
                  <span className="sketchy-font-alt">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="sketchy-font-alt">
                    £{(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-600 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold sketchy-font-alt">
                  TOTAL
                </span>
                <span className="text-2xl font-bold sketchy-font-alt">
                  £{getCartTotal().toFixed(2)}
                </span>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <Link
                href="/products"
                className="flex-1 bg-gray-800 text-white font-bold py-4 rounded-lg hover:bg-gray-700 transition-colors duration-300 sketchy-font-alt text-center flex items-center justify-center gap-2"
              >
                <ArrowLeft size={20} />
                CONTINUE SHOPPING
              </Link>
              <Link
                href="/checkout"
                className="flex-1 bg-white text-black font-bold py-4 rounded-lg hover:bg-gray-100 transition-colors duration-300 sketchy-font-alt flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} />
                CHECKOUT
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

