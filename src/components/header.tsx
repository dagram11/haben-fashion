'use client'

import { useState, useEffect, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { ShoppingBag, Menu, X, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/cart'
import { useAuthStore } from '@/store/auth'
import { cn } from '@/lib/utils'

const categories = [
  { name: 'Women', filter: 'Women', href: '/upper' },
  { name: 'Men', filter: 'Men', href: '/lower' },
]

// Helper for hydration-safe client-side only rendering
const emptySubscribe = () => () => {}
const getSnapshot = () => true
const getServerSnapshot = () => false

interface HeaderProps {
  currentCategory?: string
  onCategoryChange?: (category: string) => void
  showFilters?: boolean
}

export function Header({ currentCategory = 'all', onCategoryChange, showFilters = true }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const isMounted = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot)
  const itemCount = useCartStore((state) => state.getItemCount())
  const openCart = useCartStore((state) => state.openCart)
  const openContact = useCartStore((state) => state.openContact)
  
  // Auth state
  const { user, isAuthenticated, openAuthModal, logout } = useAuthStore()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const showCartCount = isMounted && itemCount > 0

  return (
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
          {showFilters && (
            <nav className="hidden lg:flex items-center gap-8">
              {categories.map((cat) => (
                <Link
                  key={cat.filter}
                  href={cat.href}
                  className={cn(
                    'text-sm font-medium transition-colors relative py-2',
                    currentCategory === cat.filter
                      ? 'text-black'
                      : 'text-gray-500 hover:text-black'
                  )}
                >
                  {cat.name}
                  {currentCategory === cat.filter && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full" />
                  )}
                </Link>
              ))}
              <button
                onClick={openContact}
                className="text-sm font-medium text-gray-500 hover:text-black transition-colors py-2"
              >
                Contact
              </button>
            </nav>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* User Button */}
            {isAuthenticated && user ? (
              <button
                onClick={logout}
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Logout"
              >
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="text-sm font-medium text-black hidden md:block">
                  Hi, {user.name?.split(' ')[0]}
                </span>
              </button>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Sign in"
              >
                <User className="w-5 h-5 text-black" />
              </button>
            )}

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
        {isMobileMenuOpen && showFilters && (
          <div className="lg:hidden py-4 border-t border-gray-100 bg-white/98 backdrop-blur-md absolute left-0 right-0 top-full shadow-2xl">
            <nav className="flex flex-col gap-2 px-4">
              {categories.map((cat) => (
                <Link
                  key={cat.filter}
                  href={cat.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'px-4 py-3 rounded-xl text-left text-sm font-medium transition-colors',
                    currentCategory === cat.filter
                      ? 'bg-gray-100 text-black'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-black'
                  )}
                >
                  {cat.name}
                </Link>
              ))}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  openContact()
                }}
                className="px-4 py-3 rounded-xl text-left text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-black transition-colors"
              >
                Contact
              </button>
              
              {/* Auth Buttons */}
              <div className="border-t border-gray-100 mt-2 pt-2">
                {isAuthenticated && user ? (
                  <>
                    <div className="px-4 py-3 flex items-center gap-3">
                      <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {user.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-black">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        logout()
                      }}
                      className="w-full px-4 py-3 rounded-xl text-left text-sm font-medium text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      openAuthModal('login')
                    }}
                    className="w-full px-4 py-3 rounded-xl text-left text-sm font-medium text-black hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Sign In
                  </button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
