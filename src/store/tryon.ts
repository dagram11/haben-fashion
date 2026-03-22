import { create } from 'zustand'

export type TryOnStatus = 'idle' | 'uploading' | 'processing' | 'completed' | 'error'

interface TryOnState {
  status: TryOnStatus
  productId: string | null
  productName: string | null
  userImage: string | null
  selectedSize: string | null
  resultImage: string | null
  tryonId: string | null
  error: string | null
  isModalOpen: boolean
  
  // Actions
  openModal: (productId: string, productName: string) => void
  closeModal: () => void
  setUserImage: (image: string) => void
  setSelectedSize: (size: string) => void
  setStatus: (status: TryOnStatus) => void
  setResult: (tryonId: string, imageBase64: string) => void
  setError: (error: string) => void
  reset: () => void
}

const initialState = {
  status: 'idle' as TryOnStatus,
  productId: null,
  productName: null,
  userImage: null,
  selectedSize: null,
  resultImage: null,
  tryonId: null,
  error: null,
  isModalOpen: false,
}

export const useTryOnStore = create<TryOnState>((set) => ({
  ...initialState,
  
  openModal: (productId, productName) =>
    set({
      isModalOpen: true,
      productId,
      productName,
      status: 'idle',
      userImage: null,
      selectedSize: null,
      resultImage: null,
      tryonId: null,
      error: null,
    }),
  
  closeModal: () => set({ isModalOpen: false }),
  
  setUserImage: (image) => set({ userImage: image, status: 'idle' }),
  
  setSelectedSize: (size) => set({ selectedSize: size }),
  
  setStatus: (status) => set({ status }),
  
  setResult: (tryonId, imageBase64) =>
    set({
      tryonId,
      resultImage: imageBase64,
      status: 'completed',
    }),
  
  setError: (error) => set({ error, status: 'error' }),
  
  reset: () => set(initialState),
}))
