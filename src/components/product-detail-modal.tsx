'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Heart, ShoppingBag, Camera, ChevronLeft, ChevronRight, ChevronDown, Truck, RotateCcw, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/cart'
import { cn } from '@/lib/utils'

interface Product {
  id: string
  name: string
  description: string
  category: string
  cloth_type: string
  price: number
  image_1: string
  image_2?: string
  image_3?: string
  sizes: string[]
  colors: string[]
  stock?: number
}

interface ProductDetailModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onTryOn?: (product: Product) => void
}

export function ProductDetailModal({ product, isOpen, onClose, onTryOn }: ProductDetailModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [currentImage, setCurrentImage] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [openAccordion, setOpenAccordion] = useState<string | null>('description')
  
  const addItem = useCartStore((state) => state.addItem)
  const openCart = useCartStore((state) => state.openCart)
  
  // Track previous product to reset state when product changes
  const prevProductIdRef = useRef<string | null>(null)
  
  // Reset all state when product changes
  if (product?.id !== prevProductIdRef.current) {
    prevProductIdRef.current = product?.id ?? null
    if (isOpen && product) {
      setCurrentImage(0)
      setSelectedSize('')
      setSelectedColor('')
      setIsLiked(false)
      setOpenAccordion('description')
    }
  }

  if (!isOpen || !product) return null

  const images = [product.image_1, product.image_2, product.image_3].filter(Boolean)
  const categoryLabel = product.cloth_type

  const handleAddToCart = () => {
    if (!selectedSize) return
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image_1,
      size: selectedSize,
      color: selectedColor || product.colors[0] || 'Default',
    })
    openCart()
  }

  const handleTryOn = () => {
    if (onTryOn) {
      onTryOn(product)
    }
  }

  return (
    <div className="fixed inset-0 z-40 bg-white">
      {/* Back Button - Fixed */}
      <button
        onClick={onClose}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-gray-100 transition-colors shadow-lg border border-gray-200 text-gray-700 text-sm font-medium"
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </button>
      
      {/* Close Button - Fixed */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white hover:bg-gray-100 transition-colors shadow-lg border border-gray-200"
      >
        <X className="w-5 h-5 text-gray-700" />
      </button>

      {/* Scrollable Content */}
      <div className="h-full overflow-y-auto">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <button onClick={onClose} className="hover:text-black transition-colors">Home</button>
            <span>/</span>
            <span className="text-black">{categoryLabel}</span>
            <span>/</span>
            <span className="text-gray-400 truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            
            {/* Left - Images Section */}
            <div className="flex gap-4">
              {/* Vertical Thumbnails - Desktop Only */}
              {images.length > 1 && (
                <div className="hidden lg:flex flex-col gap-3 w-20 flex-shrink-0">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImage(idx)}
                      className={cn(
                        'w-20 h-24 rounded-lg overflow-hidden border-2 transition-all',
                        currentImage === idx ? 'border-black' : 'border-gray-200 hover:border-gray-400'
                      )}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Image */}
              <div className="flex-1 relative">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 lg:sticky lg:top-4">
                  <img
                    src={images[currentImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Navigation Arrows - Both Mobile and Desktop */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentImage((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                        className="absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/90 hover:bg-white transition-colors shadow-lg flex items-center justify-center"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-700" />
                      </button>
                      <button
                        onClick={() => setCurrentImage((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                        className="absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/90 hover:bg-white transition-colors shadow-lg flex items-center justify-center"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-700" />
                      </button>
                    </>
                  )}

                  {/* Heart Button */}
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={cn(
                      'absolute top-4 right-4 p-3 rounded-full bg-white/90 shadow-lg transition-all',
                      isLiked ? 'text-red-500' : 'text-gray-600 hover:text-gray-800'
                    )}
                  >
                    <Heart className={cn('w-5 h-5', isLiked && 'fill-current')} />
                  </button>
                </div>

                {/* Horizontal Thumbnails - Mobile Only */}
                {images.length > 1 && (
                  <div className="flex lg:hidden gap-3 mt-4 justify-center">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImage(idx)}
                        className={cn(
                          'w-16 h-20 rounded-lg overflow-hidden border-2 transition-all',
                          currentImage === idx ? 'border-black' : 'border-gray-200'
                        )}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right - Product Info - Sticky on Desktop */}
            <div className="lg:sticky lg:top-4 lg:self-start">
              {/* Category Badge */}
              <p className="text-xs text-gray-500 uppercase tracking-[0.2em] mb-3 font-medium">
                {categoryLabel}
              </p>

              {/* Title */}
              <h1 className="text-2xl lg:text-3xl font-medium text-black mb-2 leading-tight">
                {product.name}
              </h1>

              {/* Price */}
              <p className="text-xl font-medium text-black mb-6">${product.price.toFixed(2)}</p>

              {/* Try On Button - Shopify Style */}
              <div className="relative mb-4">
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 rounded-full opacity-75 blur-sm animate-pulse" />
                <Button
                  onClick={handleTryOn}
                  className="relative w-full rounded-full py-7 bg-black text-white hover:bg-gray-900 text-base font-medium shadow-xl"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Try Online
                  <span className="ml-2 px-2 py-0.5 text-[10px] bg-white text-black rounded-full font-bold uppercase">New</span>
                </Button>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-6" />

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm text-gray-700 mb-3">
                    Color: <span className="font-medium">{selectedColor || 'Select'}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={cn(
                          'px-5 py-2.5 rounded-full text-sm font-medium transition-all border',
                          selectedColor === color
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-black border-gray-300 hover:border-black'
                        )}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-700">
                    Size: <span className="font-medium">{selectedSize || 'Select'}</span>
                  </p>
                  <button className="text-sm text-gray-500 hover:text-black underline underline-offset-2">
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        'min-w-[48px] h-12 px-4 rounded-full text-sm font-medium transition-all border',
                        selectedSize === size
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-black border-gray-300 hover:border-black'
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                disabled={!selectedSize}
                className="w-full rounded-full py-4 bg-white text-black border-2 border-black hover:bg-black hover:text-white text-base font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>

              {!selectedSize && (
                <p className="text-center text-sm text-red-500 mt-2">Please select a size</p>
              )}

              {/* Divider */}
              <div className="border-t border-gray-200 my-6" />

              {/* Accordion Sections */}
              <div className="space-y-0">
                {/* Description */}
                <div className="border-b border-gray-200">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === 'description' ? null : 'description')}
                    className="w-full py-4 flex items-center justify-between text-left"
                  >
                    <span className="text-sm font-medium text-black">Description</span>
                    <ChevronDown className={cn('w-4 h-4 text-gray-500 transition-transform', openAccordion === 'description' && 'rotate-180')} />
                  </button>
                  {openAccordion === 'description' && (
                    <div className="pb-4">
                      <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
                    </div>
                  )}
                </div>

                {/* Shipping */}
                <div className="border-b border-gray-200">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === 'shipping' ? null : 'shipping')}
                    className="w-full py-4 flex items-center justify-between text-left"
                  >
                    <span className="text-sm font-medium text-black">Shipping & Returns</span>
                    <ChevronDown className={cn('w-4 h-4 text-gray-500 transition-transform', openAccordion === 'shipping' && 'rotate-180')} />
                  </button>
                  {openAccordion === 'shipping' && (
                    <div className="pb-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <Truck className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-black">Free Shipping</p>
                          <p className="text-sm text-gray-500">On all orders over $150</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <RotateCcw className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-black">Easy Returns</p>
                          <p className="text-sm text-gray-500">30-day return policy</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Care */}
                <div className="border-b border-gray-200">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === 'care' ? null : 'care')}
                    className="w-full py-4 flex items-center justify-between text-left"
                  >
                    <span className="text-sm font-medium text-black">Care Instructions</span>
                    <ChevronDown className={cn('w-4 h-4 text-gray-500 transition-transform', openAccordion === 'care' && 'rotate-180')} />
                  </button>
                  {openAccordion === 'care' && (
                    <div className="pb-4">
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li>• Machine wash cold with similar colors</li>
                        <li>• Tumble dry low</li>
                        <li>• Do not bleach</li>
                        <li>• Iron on low heat if needed</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-6 mt-8 py-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 text-gray-600">
                  <Shield className="w-4 h-4" />
                  <span className="text-xs font-medium">Secure Checkout</span>
                </div>
                <div className="w-px h-4 bg-gray-300" />
                <div className="flex items-center gap-2 text-gray-600">
                  <Truck className="w-4 h-4" />
                  <span className="text-xs font-medium">Fast Delivery</span>
                </div>
              </div>

              {/* Wishlist - Desktop */}
              <div className="hidden lg:flex items-center justify-center mt-6">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={cn(
                    'flex items-center gap-2 text-sm transition-colors',
                    isLiked ? 'text-red-500' : 'text-gray-500 hover:text-black'
                  )}
                >
                  <Heart className={cn('w-4 h-4', isLiked && 'fill-current')} />
                  {isLiked ? 'Added to Wishlist' : 'Add to Wishlist'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
