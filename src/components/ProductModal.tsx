'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Product } from '@/types'
import { X, Plus, Minus, ShoppingCart, Heart, Star, ZoomIn, ZoomOut, Move } from 'lucide-react'
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
  const [displayImage, setDisplayImage] = useState<string>(product?.image || '')
  const [isMounted, setIsMounted] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomScale, setZoomScale] = useState(1)
  const [panX, setPanX] = useState(0)
  const [panY, setPanY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [clickStart, setClickStart] = useState({ x: 0, y: 0, time: 0 })
  const [hasMoved, setHasMoved] = useState(false)

  // Check if this is a Printful product
  const isPrintfulProduct = product?.id?.startsWith('printful-') || false
  const printfulProductId = isPrintfulProduct && product ? product.id.replace('printful-', '') : null

  // Set mounted state to prevent hydration issues
  useEffect(() => {
    setIsMounted(true)
    if (product && !isPrintfulProduct) {
      setDisplayImage(product.image)
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
              // Set initial image from first color - prefer thumbnail from variant
              const firstColorGroup = data.variants.colors[0]
              let thumbnailUrl = null
              if (firstColorGroup.variants && firstColorGroup.variants.length > 0) {
                const variantWithThumbnail = firstColorGroup.variants.find((v: any) => v.thumbnail_url)
                if (variantWithThumbnail) {
                  thumbnailUrl = variantWithThumbnail.thumbnail_url
                }
              }
              
              if (thumbnailUrl) {
                setDisplayImage(thumbnailUrl)
              } else {
                const firstColorImages = firstColorGroup.images || []
                if (firstColorImages.length > 0) {
                  // Check for thumbnail in images array
                  const thumbnailImg = firstColorImages.find((img: string) => 
                    typeof img === 'string' && (
                      img.includes('thumbnail') || 
                      img.includes('/thumb') || 
                      img.includes('_thumb')
                    )
                  )
                  setDisplayImage(thumbnailImg || firstColorImages[0])
                } else if (data.images && data.images.length > 0) {
                  setDisplayImage(data.images[0])
                } else {
                  setDisplayImage(product?.image || '')
                }
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
                setDisplayImage(data.images[0])
              } else {
                setDisplayImage(product?.image || '')
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
      setDisplayImage(product?.image || '')
      setIsZoomed(false)
      setZoomScale(1)
      setPanX(0)
      setPanY(0)
    } else if (isOpen && !isPrintfulProduct && product) {
      // For non-Printful products, just use the product image
      setDisplayImage(product.image)
    }
  }, [isOpen, isPrintfulProduct, printfulProductId, product])

  // Update image when color changes
  useEffect(() => {
    if (variants && selectedColor) {
      const colorGroup = variants.colors.find((c: any) => c.name === selectedColor)
      if (colorGroup) {
        // Update image for selected color - prefer thumbnail
        // Try to find thumbnail_url from variants first
        let thumbnailUrl = null
        if (colorGroup.variants && colorGroup.variants.length > 0) {
          const variantWithThumbnail = colorGroup.variants.find((v: any) => v.thumbnail_url)
          if (variantWithThumbnail) {
            thumbnailUrl = variantWithThumbnail.thumbnail_url
          }
        }
        
        // Use thumbnail_url if found, otherwise use first image from images array
        if (thumbnailUrl) {
          setDisplayImage(thumbnailUrl)
        } else {
          const colorImages = colorGroup.images || []
          if (colorImages.length > 0) {
            // Check if first image is a thumbnail
            const firstImage = colorImages[0]
            const isThumbnail = typeof firstImage === 'string' && (
              firstImage.includes('thumbnail') || 
              firstImage.includes('/thumb') || 
              firstImage.includes('_thumb')
            )
            setDisplayImage(isThumbnail ? firstImage : (colorImages.find((img: string) => 
              img.includes('thumbnail') || img.includes('/thumb') || img.includes('_thumb')
            ) || firstImage))
          } else if (productImages.length > 0) {
            setDisplayImage(productImages[0])
          } else {
            setDisplayImage(product?.image || '')
          }
        }
        // Reset zoom when color changes
        setIsZoomed(false)
        setZoomScale(1)
        setPanX(0)
        setPanY(0)
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

  const handleZoomOut = () => {
    setIsZoomed(false)
    setZoomScale(1)
    setPanX(0)
    setPanY(0)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setClickStart({ x: e.clientX, y: e.clientY, time: Date.now() })
    setHasMoved(false)
    if (isZoomed) {
      // Don't set isDragging yet - wait for movement
      setDragStart({ x: e.clientX - panX, y: e.clientY - panY })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isZoomed) {
      const moveDistance = Math.sqrt(
        Math.pow(e.clientX - clickStart.x, 2) + Math.pow(e.clientY - clickStart.y, 2)
      )
      
      // Only start dragging if mouse has moved more than 5px
      if (moveDistance > 5) {
        setHasMoved(true)
        setIsDragging(true)
        setPanX(e.clientX - dragStart.x)
        setPanY(e.clientY - dragStart.y)
      }
    }
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isZoomed) {
      // Check if this was a click (not a drag)
      const moveDistance = Math.sqrt(
        Math.pow(e.clientX - clickStart.x, 2) + Math.pow(e.clientY - clickStart.y, 2)
      )
      const timeElapsed = Date.now() - clickStart.time
      
      if (moveDistance < 5 && timeElapsed < 300) {
        // It's a click - zoom in
        setIsZoomed(true)
        setZoomScale(2.5)
        setPanX(0)
        setPanY(0)
      }
    } else if (isZoomed && !hasMoved) {
      // Click when zoomed without moving - zoom out
      const moveDistance = Math.sqrt(
        Math.pow(e.clientX - clickStart.x, 2) + Math.pow(e.clientY - clickStart.y, 2)
      )
      const timeElapsed = Date.now() - clickStart.time
      
      if (moveDistance < 5 && timeElapsed < 300) {
        handleZoomOut()
      }
    }
    setIsDragging(false)
    setHasMoved(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0]
      setClickStart({ x: touch.clientX, y: touch.clientY, time: Date.now() })
      setHasMoved(false)
      if (isZoomed) {
        setDragStart({ x: touch.clientX - panX, y: touch.clientY - panY })
      }
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isZoomed && e.touches.length === 1) {
      const touch = e.touches[0]
      const moveDistance = Math.sqrt(
        Math.pow(touch.clientX - clickStart.x, 2) + Math.pow(touch.clientY - clickStart.y, 2)
      )
      
      if (moveDistance > 10) {
        setHasMoved(true)
        setIsDragging(true)
        setPanX(touch.clientX - dragStart.x)
        setPanY(touch.clientY - dragStart.y)
      }
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isZoomed && e.changedTouches.length === 1) {
      // Check if this was a tap (not a swipe)
      const touch = e.changedTouches[0]
      const moveDistance = Math.sqrt(
        Math.pow(touch.clientX - clickStart.x, 2) + Math.pow(touch.clientY - clickStart.y, 2)
      )
      const timeElapsed = Date.now() - clickStart.time
      
      if (moveDistance < 10 && timeElapsed < 300) {
        // It's a tap - zoom in
        setIsZoomed(true)
        setZoomScale(2.5)
        setPanX(0)
        setPanY(0)
      }
    } else if (isZoomed && !hasMoved && e.changedTouches.length === 1) {
      // Tap when zoomed without moving - zoom out
      const touch = e.changedTouches[0]
      const moveDistance = Math.sqrt(
        Math.pow(touch.clientX - clickStart.x, 2) + Math.pow(touch.clientY - clickStart.y, 2)
      )
      const timeElapsed = Date.now() - clickStart.time
      
      if (moveDistance < 10 && timeElapsed < 300) {
        handleZoomOut()
      }
    }
    setIsDragging(false)
    setHasMoved(false)
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
              {/* Product Image with Zoom */}
              <div 
                className="relative h-64 md:h-full bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden"
                style={{ cursor: isZoomed ? (isDragging ? 'grabbing' : 'zoom-out') : 'zoom-in' }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {/* Image Container */}
                <div className="relative w-full h-full">
                  <motion.div
                    animate={{
                      scale: zoomScale,
                      x: panX,
                      y: panY,
                    }}
                    transition={{ duration: isZoomed ? 0.1 : 0.3 }}
                    className="absolute inset-0 origin-center"
                  >
                    <Image
                      src={displayImage || product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-8 select-none"
                      draggable={false}
                    />
                  </motion.div>
                </div>

                {/* Zoom Controls */}
                {isMounted && (
                  <>
                    {isZoomed ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleZoomOut()
                        }}
                        className="absolute top-4 right-4 px-3 py-2 bg-black/70 hover:bg-black rounded-full text-white text-sm font-bold sketchy-font-alt z-20 flex items-center gap-2 transition-colors"
                      >
                        <ZoomOut size={16} />
                        <span>Zoom Out</span>
                      </button>
                    ) : (
                      <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 rounded-full text-white text-sm font-bold sketchy-font-alt z-10 flex items-center gap-2">
                        <ZoomIn size={14} />
                        <span>Click to zoom</span>
                      </div>
                    )}
                  </>
                )}

                {/* Favorite Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleFavorite(product.id)
                  }}
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
