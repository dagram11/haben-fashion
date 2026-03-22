'use client'

import Link from 'next/link'
import { Instagram, Twitter, Facebook } from 'lucide-react'
import { useCartStore } from '@/store/cart'

export function Footer() {
  const openContact = useCartStore((state) => state.openContact)

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <img
                src="/logo.png"
                alt="LIDYA FASHION"
                className="h-10 w-auto object-contain"
              />
              <span className="text-xl font-bold tracking-tight" style={{ fontFamily: "'Times New Roman', Times, serif" }}>LIDYA FASHION</span>
            </Link>
            <p className="text-gray-400 text-sm max-w-md leading-relaxed">
              Experience fashion like never before with our AI personalization technology.
              See how clothes look on you before you buy.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold mb-6 text-sm uppercase tracking-wider">Shop</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li>
                <Link href="/upper" className="hover:text-white transition-colors">
                  Women
                </Link>
              </li>
              <li>
                <Link href="/lower" className="hover:text-white transition-colors">
                  Men
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-semibold mb-6 text-sm uppercase tracking-wider">Help</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li>
                <button 
                  onClick={openContact}
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>&copy; 2026 LIDYA FASHION. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>

        {/* Developer Credit */}
        <div className="mt-6 pt-4 border-t border-white/10 text-center">
          <p className="text-xs text-gray-500">Developed and Managed by Garment.ai</p>
        </div>
      </div>
    </footer>
  )
}
