'use client'

import { X, Play, Sparkles } from 'lucide-react'
import { useCartStore } from '@/store/cart'

export function VideoModal() {
  const isVideoOpen = useCartStore((state) => state.isVideoOpen)
  const closeVideo = useCartStore((state) => state.closeVideo)

  if (!isVideoOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={closeVideo}
      />
      
      {/* Video Container */}
      <div className="relative z-10 w-full max-w-4xl mx-4">
        {/* Close Button */}
        <button
          onClick={closeVideo}
          className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Close video"
        >
          <X className="w-6 h-6 text-white" />
        </button>
        
        {/* Video Player */}
        <div className="bg-black rounded-2xl overflow-hidden shadow-2xl">
          <div className="aspect-video relative">
            <video
              className="w-full h-full object-cover"
              controls
              autoPlay
              playsInline
            >
              <source src="/promo-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Fallback placeholder when no video file */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black">
              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-6">
                <Play className="w-10 h-10 text-white ml-1" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                LIDYA FASHION
              </h3>
              <p className="text-gray-400 text-center max-w-sm px-4">
                Discover our AI-powered personalization technology
              </p>
              <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
                <Sparkles className="w-4 h-4" />
                <span>Video coming soon</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
