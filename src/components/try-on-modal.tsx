'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { X, Upload, Download, Camera, Check, Trash2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { applyWatermarks, downloadBlob } from '@/lib/client-watermark'

const SAVED_IMAGE_KEY = 'lidya_saved_user_image'

interface TryOnModalProps {
  productId: string
  productName: string
  productImage: string
  productDescription: string
  productCategory: string
  sizes: string[]
  onClose: () => void
}

type Status = 'upload' | 'processing' | 'completed' | 'error'

export function TryOnModal({
  productId,
  productName,
  productImage,
  productDescription,
  productCategory,
  sizes,
  onClose,
}: TryOnModalProps) {
  const [status, setStatus] = useState<Status>('upload')
  const [userImage, setUserImage] = useState<string>('')
  const [savedImage, setSavedImage] = useState<string>('')
  const [selectedSize, setSelectedSize] = useState<string>('M')
  const [resultImage, setResultImage] = useState<string>('')
  const [tryonId, setTryonId] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [isDragging, setIsDragging] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [predictionId, setPredictionId] = useState<string>('')
  const [imageLoaded, setImageLoaded] = useState(false)
  const pollingRef = useRef<NodeJS.Timeout | null>(null)

  // Load saved image from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SAVED_IMAGE_KEY)
      if (saved) {
        setSavedImage(saved)
      }
    } catch (e) {
      console.error('Failed to load saved image:', e)
    }
  }, [])

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
      }
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      processImage(file)
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processImage(file)
    }
  }, [])

  const processImage = (file: File) => {
    // Convert to base64 without compression
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const base64 = e.target?.result as string
      
      console.log('Image size:', Math.round(base64.length / 1024), 'KB')
      
      setUserImage(base64)
      // Save to localStorage for future use
      try {
        localStorage.setItem(SAVED_IMAGE_KEY, base64)
        setSavedImage(base64)
      } catch (err) {
        console.error('Failed to save image:', err)
      }
      // Auto-start processing after upload
      startProcessing(base64)
    }
    
    reader.onerror = () => {
      setError('Failed to load image')
    }
    
    reader.readAsDataURL(file)
  }

  const useSavedImage = () => {
    if (savedImage) {
      setUserImage(savedImage)
      startProcessing(savedImage)
    }
  }

  const clearSavedImage = () => {
    try {
      localStorage.removeItem(SAVED_IMAGE_KEY)
      setSavedImage('')
    } catch (e) {
      console.error('Failed to clear saved image:', e)
    }
  }

  const startProcessing = async (imageBase64: string) => {
    setStatus('processing')
    setError('')

    try {
      const response = await fetch('/api/tryon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          userImage: imageBase64,
          size: selectedSize,
          ip: '',
          country: '',
          city: '',
          productImage,
          productDescription,
          productCategory,
        }),
      })

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || `Server error (${response.status})`)
      }

      if (data.predictionId) {
        // Start polling for results
        setPredictionId(data.predictionId)
        
        // Poll every 2 seconds to avoid connection issues
        pollingRef.current = setInterval(() => {
          pollForResults(data.predictionId)
        }, 2000)

        // Also poll immediately after 1 second
        setTimeout(() => pollForResults(data.predictionId), 1000)
      } else {
        throw new Error('No prediction ID received')
      }
      
    } catch (err) {
      console.error('Try-on error:', err)
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      setStatus('error')
    }
  }

  const pollForResults = async (id: string, retryCount = 0) => {
    try {
      const response = await fetch(`/api/tryon?predictionId=${id}`)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const data = await response.json()

      if (data.status === 'succeeded' && data.imageUrl) {
        setTryonId(`tryon-${Date.now()}`)
        // Proxy the image through our server to avoid CORS/connection issues
        const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(data.imageUrl)}`
        setResultImage(proxyUrl)
        setImageLoaded(false)  // Reset image loaded state
        setStatus('completed')
        if (pollingRef.current) {
          clearInterval(pollingRef.current)
          pollingRef.current = null
        }
      } else if (data.status === 'failed') {
        setError(data.error || 'Generation failed')
        setStatus('error')
        if (pollingRef.current) {
          clearInterval(pollingRef.current)
          pollingRef.current = null
        }
      }
      // If still processing, continue polling (interval will call again)
    } catch (err) {
      console.error('Poll error:', err)
      // Don't stop polling on network errors, keep trying
      // The interval will retry automatically
    }
  }



  const handleDownload = async () => {
    if (!resultImage || isDownloading) return

    setIsDownloading(true)
    try {
      // Apply watermarks on client side to avoid Vercel serverless body size limits
      const watermarkedBlob = await applyWatermarks(resultImage, productName)
      
      // Create safe filename
      const safeFileName = (productName || 'style-preview')
        .replace(/[^a-z0-9]/gi, '-')
        .replace(/-+/g, '-')
        .toLowerCase()
      
      // Download directly
      downloadBlob(watermarkedBlob, `${safeFileName}.png`)
    } catch (err) {
      console.error('Download error:', err)
      setError('Failed to download image')
    } finally {
      setIsDownloading(false)
    }
  }

  const handleReset = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current)
      pollingRef.current = null
    }
    setUserImage('')
    setSelectedSize('M')
    setResultImage('')
    setTryonId('')
    setError('')
    setPredictionId('')
    setImageLoaded(false)
    setStatus('upload')
  }

  const handleClose = () => {
    handleReset()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative z-10 w-full max-w-lg lg:max-w-4xl mx-4 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 lg:p-6 border-b border-zinc-800">
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-white">AI Style Preview</h2>
            <p className="text-zinc-400 text-sm lg:text-base mt-0.5 lg:mt-1">{productName}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        <div className="p-4 lg:p-6 max-h-[80vh] overflow-y-auto">
          
          {status === 'upload' && (
            <div className="space-y-6">
              {/* Saved Image Section - Responsive */}
              {savedImage && (
                <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden bg-zinc-700 flex-shrink-0 mx-auto sm:mx-0">
                      <img
                        src={savedImage}
                        alt="Saved photo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 text-center sm:text-left w-full">
                      <p className="text-white font-medium text-sm sm:text-base">Use your saved photo?</p>
                      <p className="text-zinc-400 text-xs sm:text-sm mt-1">Quick preview with your previous photo</p>
                      <div className="flex flex-col sm:flex-row gap-2 mt-3">
                        <Button
                          onClick={useSavedImage}
                          className="rounded-lg bg-white text-black hover:bg-zinc-200 text-xs sm:text-sm"
                        >
                          <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          Use This Photo
                        </Button>
                        <Button
                          onClick={clearSavedImage}
                          variant="outline"
                          className="rounded-lg text-xs sm:text-sm border-zinc-600 hover:bg-zinc-800"
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Upload New Image Section */}
              <div
                className={cn(
                  'border-2 border-dashed rounded-xl p-8 lg:p-12 text-center transition-all cursor-pointer',
                  isDragging
                    ? 'border-white bg-zinc-800'
                    : 'border-zinc-700 hover:border-zinc-600'
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <input
                  type="file"
                  id="file-input"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-zinc-800 rounded-full">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-white">
                      {savedImage ? 'Upload a new photo' : 'Drag your image here'}
                    </p>
                    <p className="text-zinc-400 mt-1">or click to browse</p>
                  </div>
                  <Button variant="outline" className="mt-2 rounded-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Browse Files
                  </Button>
                </div>
              </div>
            </div>
          )}



          {status === 'processing' && (
            <div className="py-16 text-center">
              <div className="flex justify-center mb-6">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 border-4 border-zinc-700 rounded-full" />
                  <div className="absolute inset-0 border-4 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Creating Your Preview
              </h3>
              <p className="text-zinc-400 mb-2">
                AI is generating your personalized look...
              </p>
              <p className="text-yellow-400 text-sm font-medium">
                This may take 30 to 100 seconds
              </p>
              <p className="text-zinc-400 text-sm">
                Make sure you have a strong connection
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="py-12 text-center">
              <div className="p-4 bg-red-500/10 rounded-full w-fit mx-auto mb-4">
                <X className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-red-400 mb-4">{error || 'An error occurred'}</p>
              <Button
                onClick={handleReset}
                className="rounded-xl bg-white text-black"
              >
                Try Again
              </Button>
            </div>
          )}

          {status === 'completed' && resultImage && (
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
              {/* Image */}
              <div className="aspect-[3/4] rounded-xl overflow-hidden bg-zinc-800 w-full sm:w-64 flex-shrink-0 relative">
                <img
                  src={resultImage}
                  alt="Style preview"
                  className="w-full h-full object-cover"
                  onLoad={() => setImageLoaded(true)}
                />
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-zinc-800">
                    <div className="relative w-12 h-12">
                      <div className="absolute inset-0 border-4 border-zinc-700 rounded-full" />
                      <div className="absolute inset-0 border-4 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Buttons beside image on desktop, stacked on mobile */}
              <div className="flex flex-row sm:flex-col gap-3 justify-center sm:justify-start w-full sm:w-auto">
                {imageLoaded && (
                  <div className="flex items-center gap-2 text-green-400">
                    <Check className="w-4 h-4" />
                    <span className="text-sm">Success!</span>
                  </div>
                )}
                
                <Button
                  onClick={handleDownload}
                  disabled={isDownloading || !imageLoaded}
                  className="flex-1 sm:flex-none rounded-xl bg-white text-black hover:bg-zinc-200 px-6"
                >
                  {isDownloading ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Preparing...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Free Download
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isDownloading}
                  className="flex-1 sm:flex-none rounded-xl px-6"
                >
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
