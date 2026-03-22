'use client'

import { useState, useEffect, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { ArrowLeft, ShoppingBag, Menu, X, Search, Sparkles, Truck, Shield, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/product-card'
import { ProductDetailModal } from '@/components/product-detail-modal'
import { CartDrawer } from '@/components/cart-drawer'
import { CheckoutModal } from '@/components/checkout-modal'
import { TryOnModal } from '@/components/try-on-modal'
import { Footer } from '@/components/footer'
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
  stock?: number
}

const categories = [
  { name: 'Women', filter: 'Women', href: '/upper' },
  { name: 'Men', filter: 'Men', href: '/lower' },
]

// Helper for hydration-safe client-side only rendering
const emptySubscribe = () => () => {}
const getSnapshot = () => true
const getServerSnapshot = () => false

interface CategoryPageProps {
  clothType: 'Women' | 'Men'
  title: string
  description: string
}

export function CategoryPage({ clothType, title, description }: CategoryPageProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // Style Preview modal state
  const [isTryOnModalOpen, setIsTryOnModalOpen] = useState(false)
  const [tryOnProduct, setTryOnProduct] = useState<Product | null>(null)

  const isMounted = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot)
  const itemCount = useCartStore((state) => state.getItemCount())
  const openCart = useCartStore((state) => state.openCart)
  const showCartCount = isMounted && itemCount > 0

  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Check if checkout param is in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('checkout') === 'true') {
      setIsCheckoutOpen(true)
    }
  }, [])

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/products?cloth_type=${clothType}`)
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, [clothType])

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product)
    setIsProductModalOpen(true)
  }

  const handleOpenTryOn = (product: Product) => {
    setTryOnProduct(product)
    setIsTryOnModalOpen(true)
    setIsProductModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Header */}
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-30 transition-all duration-300',
          isScrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="LIDYA FASHION"
                className="h-10 w-auto object-contain"
              />
              <span className="text-xl font-bold tracking-tight text-black" style={{ fontFamily: "'Times New Roman', Times, serif" }}>LIDYA FASHION</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {categories.map((cat) => (
                <Link
                  key={cat.filter}
                  href={cat.href}
                  className={cn(
                    'text-sm font-medium transition-colors relative py-2',
                    clothType === cat.filter
                      ? 'text-black'
                      : 'text-gray-500 hover:text-black'
                  )}
                >
                  {cat.name}
                  {clothType === cat.filter && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <button
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-black" />
              </button>
              
              <button
                onClick={openCart}
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5 text-black" />
                {showCartCount && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-black" />
                ) : (
                  <Menu className="w-5 h-5 text-black" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-100 bg-white/98 backdrop-blur-md absolute left-0 right-0 top-full shadow-2xl">
              <nav className="flex flex-col gap-2 px-4">
                {categories.map((cat) => (
                  <Link
                    key={cat.filter}
                    href={cat.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'px-4 py-3 rounded-xl text-left text-sm font-medium transition-colors',
                      clothType === cat.filter
                        ? 'bg-gray-100 text-black'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-black'
                    )}
                  >
                    {cat.name}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 pt-20">
        {/* Hero Section - Premium White/Black */}
        <section className="relative bg-gradient-to-br from-white via-gray-50 to-white overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gray-100 to-transparent" />
          <div className="absolute top-10 left-10 w-64 h-64 bg-gray-200/40 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-80 h-80 bg-gray-200/30 rounded-full blur-3xl" />
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to All Products
            </Link>
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white border border-gray-200 shadow-sm mb-6">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium">Personalized Shopping Experience</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-black">
                {title}
              </h1>
              <p className="text-lg sm:text-xl text-gray-600">
                {description}
              </p>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-8 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-black">{title}</h2>
              <p className="text-gray-500 mt-2">
                {products.length} {products.length === 1 ? 'item' : 'items'}
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <div className="aspect-[3/4] bg-gray-200 rounded-2xl animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">No products found in this category</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Features */}
        <section className="py-20 border-t border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Truck className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-black">Free Shipping</h3>
                <p className="text-gray-500">On all orders over $150</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-black">Secure Payment</h3>
                <p className="text-gray-500">100% secure transactions</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <RefreshCw className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-black">Easy Returns</h3>
                <p className="text-gray-500">30-day return policy</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Modals */}
      <CartDrawer />
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onTryOn={handleOpenTryOn}
      />
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
      
      {/* Style Preview Modal */}
      {isTryOnModalOpen && tryOnProduct && (
        <TryOnModal
          productId={tryOnProduct.id}
          productName={tryOnProduct.name}
          productImage={tryOnProduct.image_3 || tryOnProduct.image_1}
          productDescription={tryOnProduct.description}
          productCategory={tryOnProduct.category}
          sizes={tryOnProduct.sizes}
          onClose={() => {
            setIsTryOnModalOpen(false)
            setTryOnProduct(null)
          }}
        />
      )}
    </div>
  )
}
