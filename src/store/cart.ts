import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  productId: string
  name: string
  price: number
  image: string
  size: string
  color: string
  quantity: number
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  isCheckoutOpen: boolean
  isContactOpen: boolean
  isVideoOpen: boolean
  sessionId: string
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (productId: string, size: string, color: string) => void
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  openCheckout: () => void
  closeCheckout: () => void
  openContact: () => void
  closeContact: () => void
  openVideo: () => void
  closeVideo: () => void
  getTotal: () => number
  getItemCount: () => number
}

const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isCheckoutOpen: false,
      isContactOpen: false,
      isVideoOpen: false,
      sessionId: generateSessionId(),
      
      addItem: (item) => {
        const items = get().items
        const existingIndex = items.findIndex(
          (i) => i.productId === item.productId && i.size === item.size && i.color === item.color
        )
        
        if (existingIndex > -1) {
          const newItems = [...items]
          newItems[existingIndex].quantity += 1
          set({ items: newItems })
        } else {
          set({ items: [...items, { ...item, quantity: 1 }] })
        }
      },
      
      removeItem: (productId, size, color) => {
        set({
          items: get().items.filter(
            (i) => !(i.productId === productId && i.size === size && i.color === color)
          ),
        })
      },
      
      updateQuantity: (productId, size, color, quantity) => {
        const items = get().items
        const index = items.findIndex(
          (i) => i.productId === productId && i.size === size && i.color === color
        )
        if (index > -1) {
          const newItems = [...items]
          newItems[index].quantity = quantity
          set({ items: newItems })
        }
      },
      
      clearCart: () => set({ items: [] }),
      
      toggleCart: () => set({ isOpen: !get().isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      openCheckout: () => set({ isCheckoutOpen: true, isOpen: false }),
      closeCheckout: () => set({ isCheckoutOpen: false }),
      openContact: () => set({ isContactOpen: true, isOpen: false }),
      closeContact: () => set({ isContactOpen: false }),
      openVideo: () => set({ isVideoOpen: true }),
      closeVideo: () => set({ isVideoOpen: false }),
      
      getTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
      
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    {
      name: 'vton-cart',
      partialize: (state) => ({
        items: state.items,
        sessionId: state.sessionId,
      }),
    }
  )
)
