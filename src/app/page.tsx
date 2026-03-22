'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import { ProductDetailModal } from '@/components/product-detail-modal'
import { CartDrawer } from '@/components/cart-drawer'
import { CheckoutModal } from '@/components/checkout-modal'
import { TryOnModal } from '@/components/try-on-modal'
import { ContactModal } from '@/components/contact-modal'
import { AuthModal } from '@/components/auth-modal'
import { VideoModal } from '@/components/video-modal'
import { ArrowRight, Sparkles, Truck, Shield, RefreshCw, Star, Play, ChevronRight, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/cart'

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

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [clothType, setClothType] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  
  // Try-on modal state
  const [isTryOnModalOpen, setIsTryOnModalOpen] = useState(false)
  const [tryOnProduct, setTryOnProduct] = useState<Product | null>(null)

  // Video modal state
  const openVideo = useCartStore((state) => state.openVideo)

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        const clothTypeParam = clothType !== 'all' ? `&cloth_type=${clothType}` : ''
        const [allRes, featuredRes] = await Promise.all([
          fetch(`/api/products?category=all${clothTypeParam}`),
          fetch('/api/products?featured=true'),
        ])
        const allData = await allRes.json()
        const featuredData = await featuredRes.json()
        setProducts(allData)
        setFeaturedProducts(featuredData)
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
      <Header
        currentCategory={clothType}
        onCategoryChange={setClothType}
      />
      
      <main className="flex-1 pt-20">
        {/* Hero Section - Premium White/Black */}
        <section className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gray-100 to-transparent" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-gray-200/50 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gray-200/30 rounded-full blur-3xl" />
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
            {/* Desktop Hero */}
            <div className="hidden lg:grid lg:grid-cols-2 gap-8 lg:gap-16 items-center py-8 lg:py-12">
              {/* Left Content - Desktop Only */}
              <div className="space-y-4 lg:space-y-6">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white border border-gray-200 shadow-sm">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium">Personalized Shopping Experience</span>
                </div>
                
                {/* Main Heading */}
                <div className="space-y-2 lg:space-y-4">
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
                    <span className="block text-black">Your Style,</span>
                    <span className="block bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent">
                      Visualized
                    </span>
                  </h1>
                  <p className="text-lg sm:text-xl text-gray-600 max-w-lg leading-relaxed">
                    See yourself in any outfit before you buy. Our AI technology creates stunningly realistic personalized previews in seconds.
                  </p>
                </div>
                
                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4">
                  <Button
                    onClick={() => window.location.href = '/upper'}
                    className="group relative h-14 px-8 rounded-full bg-black text-white font-semibold text-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-black/20 hover:bg-gray-900"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Shop Collection
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-14 px-8 rounded-full border-gray-300 hover:bg-gray-100 font-semibold text-lg bg-white text-black"
                    onClick={openVideo}
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Watch Video
                  </Button>
                </div>
                
                {/* Social Proof */}
                <div className="flex flex-wrap items-center gap-4 lg:gap-6 pt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[
                        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
                        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
                        'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop',
                        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
                      ].map((src, i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden shadow-sm">
                          <img src={src} alt={`User ${i + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">10k+ happy shoppers</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">4.9/5 rating</span>
                  </div>
                </div>
                
                {/* Trust Badges */}
                <div className="flex flex-wrap items-center gap-6 pt-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Truck className="w-4 h-4" />
                    Free Shipping
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Shield className="w-4 h-4" />
                    Secure Checkout
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <RefreshCw className="w-4 h-4" />
                    Easy Returns
                  </div>
                </div>
              </div>
              
              {/* Right Content - Product Showcase */}
              <div className="relative hidden lg:block">
                <div className="relative">
                  {/* Main Product Image */}
                  <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gray-100 shadow-2xl shadow-gray-300/50">
                    <img
                      src="https://images2.imgbox.com/c8/d1/RBtLVU7d_o.jpeg"
                      alt="White Gown with Emerald Accents"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  </div>
                  
                  {/* Floating Secondary Images */}
                  <div className="absolute -right-8 top-20 w-32 aspect-square rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-gray-100">
                    <img
                      src="https://images2.imgbox.com/e9/0a/6Axbqy5o_o.png"
                      alt="Fashion"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="absolute -left-8 bottom-40 w-28 aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-gray-100">
                    <img
                      src="https://images2.imgbox.com/ef/70/HjWeBP2q_o.jpeg"
                      alt="Fashion"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Hero - Card Based Design */}
            <div className="lg:hidden py-6">
              {/* Centered Badge - Above Mobile Hero */}
              <div className="flex justify-center pb-3">
                <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-black text-white text-xs">
                  <Zap className="w-3 h-3 text-yellow-400" />
                  <span className="text-[11px] font-medium">Personalized Shopping Experience</span>
                </div>
              </div>
              
              <div className="bg-white rounded-3xl overflow-hidden shadow-lg">
                <div className="flex">
                  {/* Left Side - Text Content (38%) */}
                  <div className="w-[38%] p-4 flex flex-col justify-between">
                    <div>
                      {/* Spring Deal */}
                      <h3 className="text-lg font-bold text-black leading-tight">
                        Spring Deal
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        15% off / 5% off outlet
                      </p>
                    </div>
                    
                    {/* Buttons */}
                    <div className="space-y-2 mt-4">
                      <Button
                        onClick={() => window.location.href = '/upper'}
                        className="w-full rounded-full bg-black text-white text-xs py-2 h-8"
                      >
                        Shop Now
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full rounded-full border-gray-300 text-xs py-2 h-8 bg-white text-black"
                        onClick={openVideo}
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Watch Video
                      </Button>
                    </div>
                  </div>
                  
                  {/* Right Side - Image (62%) */}
                  <div className="w-[62%]">
                    <div className="aspect-[3/4] rounded-2xl overflow-hidden m-1">
                      <img
                        src="https://images2.imgbox.com/c8/d1/RBtLVU7d_o.jpeg"
                        alt="Winter Collection"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Pagination Dots */}
                <div className="flex justify-center gap-1.5 py-3">
                  <div className="w-2 h-2 rounded-full bg-black" />
                  <div className="w-2 h-2 rounded-full bg-gray-300" />
                  <div className="w-2 h-2 rounded-full bg-gray-300" />
                </div>
              </div>
              
              {/* Trust Badges */}
              <div className="flex justify-center gap-4 mt-4 px-4">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Truck className="w-3 h-3" />
                  Free Shipping
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Shield className="w-3 h-3" />
                  Secure Checkout
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <RefreshCw className="w-3 h-3" />
                  Easy Returns
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-8 lg:py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6 lg:mb-8">
              <div>
                <h2 className="text-3xl font-bold text-black">Featured Collection</h2>
                <p className="text-gray-500 mt-2">Handpicked styles for you</p>
              </div>
              <Button
                variant="outline"
                onClick={() => window.location.href = '/upper'}
                className="rounded-full hidden sm:flex border-gray-300 hover:bg-gray-100 text-black"
              >
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <div className="aspect-[3/4] bg-gray-100 rounded-2xl animate-pulse" />
                    <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
                    <div className="h-4 bg-gray-100 rounded animate-pulse w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {featuredProducts.slice(0, 4).map((product) => (
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

        {/* All Products */}
        <section className="py-8 lg:py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6 lg:mb-8">
              <h2 className="text-3xl font-bold text-black">
                {clothType === 'all' ? 'All Products' : clothType}
              </h2>
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

        {/* CTA Section */}
        <section className="py-8 lg:py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-black rounded-3xl p-8 lg:p-12 text-center relative overflow-hidden">
              {/* Decorative gradient */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.08),transparent)]" />
              <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/5 to-transparent" />
              
              <div className="relative">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-white">
                  Experience AI Personalization
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto mb-10 text-lg">
                  See how any outfit looks on you before making a purchase. 
                  Our AI technology creates realistic personalized previews instantly.
                </p>
                <Button
                  onClick={() => {
                    if (featuredProducts.length > 0) {
                      handleViewDetails(featuredProducts[0])
                    }
                  }}
                  className="rounded-full bg-white text-black hover:bg-gray-100 px-10 py-7 text-lg font-semibold transition-all hover:shadow-2xl hover:shadow-white/20"
                >
                  Try It Now
                  <Sparkles className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-12 lg:py-16 border-t border-gray-200 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
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
      <CheckoutModal />
      <ContactModal />
      <AuthModal />
      <VideoModal />
      
      {/* Style Preview Modal */}
      {isTryOnModalOpen && tryOnProduct && (
        <TryOnModal
          productId={tryOnProduct.id}
          productName={tryOnProduct.name}
          productImage={tryOnProduct.image_3 || tryOnProduct.image_1}
          productDescription={tryOnProduct.description}
          productCategory={tryOnProduct.cloth_type}
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
