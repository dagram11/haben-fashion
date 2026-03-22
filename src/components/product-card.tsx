'use client'

import { useState } from 'react'
import { Heart, ShoppingBag } from 'lucide-react'
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
  featured?: boolean
}

interface ProductCardProps {
  product: Product
  onViewDetails: (product: Product) => void
}

export function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const addItem = useCartStore((state) => state.addItem)
  const openCart = useCartStore((state) => state.openCart)

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation()
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image_1,
      size: product.sizes[2] || 'M',
      color: product.colors[0] || 'Black',
    })
    openCart()
  }

  // Check if product has a second image for hover effect
  const hasSecondImage = Boolean(product.image_2)

  return (
    <div
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onViewDetails(product)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 mb-4 shadow-lg shadow-gray-200/50">
        {/* Primary Image */}
        <img
          src={product.image_1}
          alt={product.name}
          className={cn(
            'w-full h-full object-cover transition-all duration-500',
            hasSecondImage && isHovered ? 'opacity-0' : 'opacity-100'
          )}
        />
        
        {/* Secondary Image - Shows on Hover (Shopify style) */}
        {hasSecondImage && (
          <img
            src={product.image_2}
            alt={`${product.name} - alternate view`}
            className={cn(
              'absolute inset-0 w-full h-full object-cover transition-all duration-500',
              isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            )}
          />
        )}
        
        {/* Overlay */}
        <div
          className={cn(
            'absolute inset-0 bg-black/5 transition-opacity duration-300',
            isHovered ? 'opacity-100' : 'opacity-0'
          )}
        />

        {/* Actions - Hidden on mobile */}
        <div
          className={cn(
            'hidden sm:flex absolute bottom-4 left-4 right-4 gap-2 transition-all duration-300',
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          )}
        >
          <Button
            onClick={handleQuickAdd}
            className="flex-1 bg-white/95 text-black hover:bg-white rounded-xl shadow-xl font-semibold backdrop-blur-sm border border-gray-200"
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Add to Bag
          </Button>
        </div>

        {/* Like Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsLiked(!isLiked)
          }}
          className={cn(
            'absolute top-4 right-4 p-2 rounded-full transition-all shadow-lg z-10',
            isLiked ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-600 hover:bg-white'
          )}
        >
          <Heart className={cn('w-4 h-4', isLiked && 'fill-current')} />
        </button>

        {/* Featured Badge - Hidden on mobile */}
        {product.featured && (
          <div className="hidden sm:block absolute top-4 left-4 px-3 py-1.5 bg-gradient-to-r from-black to-gray-800 text-white text-xs font-semibold rounded-full shadow-lg backdrop-blur-sm">
            Featured
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-1">
        <p className="text-xs text-gray-500 uppercase tracking-wider">
          {product.cloth_type}
        </p>
        <h3 className="font-medium text-black group-hover:text-gray-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-lg font-semibold text-black">${product.price.toFixed(2)}</p>
      </div>
    </div>
  )
}
