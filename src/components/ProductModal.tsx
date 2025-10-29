'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Product } from '@/types'
import { X, Plus, Minus, ShoppingCart, Heart, Star, ChevronLeft, ChevronRight } from 'lucide-react'
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
  const [variants, setVariants] = useState<any>(null)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [selectedVariant, setSelectedVariant] = useState<any>(null)
  const [variantPrice, setVariantPrice] = useState<number | null>(null)
  const [loadingVariants, setLoadingVariants] = useState(false)
  const [productImages, setProductImages] = useState<string[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [displayImages, setDisplayImages] = useState<string[]>([product?.image || ''])
  const [isMounted, setIsMounted] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Check if this is a Printful product
  const isPrintfulProduct = product?.id?.startsWith('printful-') || false
  const printfulProductId = isPrintfulProduct && product ? product.id.replace('printful-', '') : null

  // Set mounted state to prevent hydration issues
  useEffect(() => {
    setIsMounted(true)
    if (product && !isPrintfulProduct) {
      setDisplayImages([product.image])
    }
  }, [product, isPrintfulProduct])

  // Fetch variants when modal opens for Printful products
  useEffect(() => {
    if (isOpen && isPrintfulProduct && printfulProductId) {
      setLoadingVariants(true)
      fetch(`/api/printful/product/${printfulProductId}`)
        .then(res => res.json())
        .then(data => {
          if (data.variants) {
            setVariants(data.variants)
            // Store product-level images
            if (data.images && Array.isArray(data.images)) {
              setProductImages(data.images)
            }
            // Auto-select first size and color if available
            if (data.variants.sizes.length > 0) {
              setSelectedSize(data.variants.sizes[0])
            }
            if (data.variants.colors.length > 0) {
              const firstColor = data.variants.colors[0].name
              setSelectedColor(firstColor)
              // Set initial images from first color
              if (data.variants.colors[0].images && data.variants.colors[0].images.length > 0) {
                setDisplayImages(data.variants.colors[0].images)
              } else if (data.images && data.images.length > 0) {
                setDisplayImages(data.images)
              } else {
                setDisplayImages([product?.image || ''])
              }
              // Set initial variant and price
              const firstColorVariants = data.variants.colors[0].variants
              if (firstColorVariants.length > 0) {
                const firstVariant = firstColorVariants[0]
                setSelectedVariant(firstVariant)
                setVariantPrice(Number.parseFloat(firstVariant.retail_price || firstVariant.price || product?.price || 0))
              }
            } else {
              // No colors, use product images
              if (data.images && data.images.length > 0) {
                setDisplayImages(data.images)
              } else {
                setDisplayImages([product?.image || ''])
              }
            }
          }
          setLoadingVariants(false)
        })
        .catch(err => {
          console.error('Error fetching variants:', err)
          setLoadingVariants(false)
        })
    } else if (!isOpen) {
      // Reset when modal closes
      setVariants(null)
      setSelectedSize('')
      setSelectedColor('')
      setSelectedVariant(null)
      setVariantPrice(null)
      setQuantity(1)
      setProductImages([])
      setCurrentImageIndex(0)
      setDisplayImages([product?.image || ''])
    } else if (isOpen && !isPrintfulProduct && product) {
      // For non-Printful products, just use the product image
      setDisplayImages([product.image])
      setCurrentImageIndex(0)
    }
  }, [isOpen, isPrintfulProduct, printfulProductId, product])

  // Update images when color changes
  useEffect(() => {
    if (variants && selectedColor) {
      const colorGroup = variants.colors.find((c: any) => c.name === selectedColor)
      if (colorGroup) {
        // Update images for selected color
        if (colorGroup.images && colorGroup.images.length > 0) {
          setDisplayImages(colorGroup.images)
        } else if (productImages.length > 0) {
          setDisplayImages(productImages)
        } else {
          setDisplayImages([product?.image || ''])
        }
        setCurrentImageIndex(0)
      }
    }
  }, [selectedColor, variants, productImages, product])

  // Update selected variant when size or color changes
  useEffect(() => {
    if (variants && selectedSize && selectedColor) {
      const colorGroup = variants.colors.find((c: any) => c.name === selectedColor)
      if (colorGroup) {
        const matchingVariant = colorGroup.variants.find((v: any) => v.size === selectedSize)
        if (matchingVariant) {
          setSelectedVariant(matchingVariant)
          setVariantPrice(Number.parseFloat(matchingVariant.retail_price || matchingVariant.price || product?.price || 0))
        }
      }
    }
  }, [selectedSize, selectedColor, variants, product])

  if (!product) return null

  const isSoldOut = product.isSoldOut || false
  const displayPrice = variantPrice !== null ? variantPrice : product.price

  const handleAddToCart = () => {
    if (!isSoldOut) {
      const productToAdd: Product = {
        ...product,
        price: displayPrice,
        variant: selectedVariant ? {
          variantId: selectedVariant.id,
          size: selectedVariant.size,
          color: selectedVariant.color || selectedColor,
          price: displayPrice
        } : undefined
      }
      addToCart(productToAdd, quantity)
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

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % displayImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length)
  }

  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    
    if (isLeftSwipe && displayImages.length > 1) {
      nextImage()
    }
    if (isRightSwipe && displayImages.length > 1) {
      prevImage()
    }
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
              {/* Product Image Carousel */}
              <div className="relative h-64 md:h-full bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                {/* Image Container */}
                <div 
                  className="relative w-full h-full"
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                >
                  {displayImages.length > 1 && isMounted ? (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentImageIndex}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={displayImages[currentImageIndex] || product.image}
                          alt={`${product.name} - Image ${currentImageIndex + 1}`}
                          fill
                          className="object-contain p-8"
                        />
                      </motion.div>
                    </AnimatePresence>
                  ) : (
                    <div className="absolute inset-0">
                      <Image
                        src={displayImages[0] || product.image}
                        alt={product.name}
                        fill
                        className="object-contain p-8"
                      />
                    </div>
                  )}
                </div>

                {/* Navigation Arrows */}
                {isMounted && displayImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors z-10"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={24} className="text-white" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors z-10"
                      aria-label="Next image"
                    >
                      <ChevronRight size={24} className="text-white" />
                    </button>

                    {/* Image Indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                      {displayImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`h-2 rounded-full transition-all ${
                            currentImageIndex === index
                              ? 'w-8 bg-black'
                              : 'w-2 bg-black/50 hover:bg-black/70'
                          }`}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>

                    {/* Image Counter */}
                    <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 rounded-full text-white text-sm font-bold sketchy-font-alt z-10">
                      {currentImageIndex + 1} / {displayImages.length}
                    </div>
                  </>
                )}
                
                {/* Favorite Button */}
                <button
                  onClick={() => onToggleFavorite(product.id)}
                  className="absolute top-4 left-4 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors z-10"
                >
                  <Heart 
                    size={20} 
                    className={favorites.has(product.id) ? 'text-red-500 fill-current' : 'text-white'} 
                  />
                </button>

                {/* Rating Stars */}
                <div className="absolute bottom-4 left-4 flex gap-1 z-10">
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
                      £{displayPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Variant Selectors for Printful Products */}
                {isPrintfulProduct && (
                  <div className="mb-8 space-y-4">
                    {loadingVariants ? (
                      <div className="text-center py-4">
                        <div className="inline-block animate-pulse">
                          <div className="h-8 w-32 bg-gray-300 rounded mx-auto"></div>
                        </div>
                      </div>
                    ) : variants && (
                      <>
                        {/* Color Selector */}
                        {variants.colors.length > 0 && (
                          <div>
                            <label className="block text-sm font-bold text-black mb-3 sketchy-font-alt">
                              COLOR
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {variants.colors.map((colorGroup: any, index: number) => (
                                <button
                                  key={`color-${index}`}
                                  onClick={() => setSelectedColor(colorGroup.name)}
                                  className={`px-4 py-2 rounded-lg font-bold sketchy-font-alt transition-all ${
                                    selectedColor === colorGroup.name
                                      ? 'bg-black text-white'
                                      : 'bg-gray-200 text-black hover:bg-gray-300'
                                  }`}
                                >
                                  {colorGroup.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Size Selector */}
                        {variants.sizes.length > 0 && (
                          <div>
                            <label className="block text-sm font-bold text-black mb-3 sketchy-font-alt">
                              SIZE
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {variants.sizes.map((size: string, index: number) => {
                                const colorGroup = variants.colors.find((c: any) => c.name === selectedColor)
                                const hasSize = colorGroup?.variants.some((v: any) => v.size === size)
                                
                                return (
                                  <button
                                    key={`size-${index}`}
                                    onClick={() => hasSize && setSelectedSize(size)}
                                    disabled={!hasSize}
                                    className={`px-4 py-2 rounded-lg font-bold sketchy-font-alt transition-all ${
                                      selectedSize === size && hasSize
                                        ? 'bg-black text-white'
                                        : hasSize
                                        ? 'bg-gray-200 text-black hover:bg-gray-300'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                                    }`}
                                  >
                                    {size}
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

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
                  ) : isPrintfulProduct && (!selectedSize || !selectedColor) ? (
                    <div className="w-full bg-gray-400 text-white font-bold py-4 px-4 rounded-lg sketchy-font-alt text-center cursor-not-allowed">
                      SELECT SIZE & COLOR
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
                            if (typeof window !== 'undefined') {
                              window.location.href = '/cart'
                            }
                          }, 500)
                        }}
                        className="flex-1 bg-gray-800 text-white font-bold py-4 px-4 rounded-lg hover:bg-gray-700 transition-all duration-300 sketchy-font-alt flex items-center justify-center gap-2 text-base whitespace-nowrap"
                      >
                        <ShoppingCart size={20} />
                        <span>BUY NOW - £{(displayPrice * quantity).toFixed(2)}</span>
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
