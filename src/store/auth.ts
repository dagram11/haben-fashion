import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  name: string
  phone?: string
  avatar?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  isAuthModalOpen: boolean
  authModalMode: 'login' | 'signup'
  
  // Actions
  setUser: (user: User | null) => void
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (email: string, password: string, name: string, phone?: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  checkSession: () => Promise<void>
  openAuthModal: (mode?: 'login' | 'signup') => void
  closeAuthModal: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isAuthModalOpen: false,
      authModalMode: 'login',

      setUser: (user) => {
        set({ 
          user, 
          isAuthenticated: !!user 
        })
      },

      login: async (email, password) => {
        set({ isLoading: true })
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          })
          const data = await response.json()

          if (!response.ok) {
            set({ isLoading: false })
            return { success: false, error: data.error || 'Login failed' }
          }

          set({ 
            user: data.user, 
            isAuthenticated: true, 
            isLoading: false,
            isAuthModalOpen: false 
          })
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          return { success: false, error: 'An error occurred' }
        }
      },

      signup: async (email, password, name, phone) => {
        set({ isLoading: true })
        try {
          const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name, phone }),
          })
          const data = await response.json()

          if (!response.ok) {
            set({ isLoading: false })
            return { success: false, error: data.error || 'Signup failed' }
          }

          set({ 
            user: data.user, 
            isAuthenticated: true, 
            isLoading: false,
            isAuthModalOpen: false 
          })
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          return { success: false, error: 'An error occurred' }
        }
      },

      logout: async () => {
        try {
          await fetch('/api/auth/logout', { method: 'POST' })
        } catch (error) {
          console.error('Logout error:', error)
        }
        set({ 
          user: null, 
          isAuthenticated: false 
        })
      },

      checkSession: async () => {
        try {
          const response = await fetch('/api/auth/session')
          const data = await response.json()

          if (data.authenticated && data.user) {
            set({ 
              user: data.user, 
              isAuthenticated: true 
            })
          } else {
            set({ 
              user: null, 
              isAuthenticated: false 
            })
          }
        } catch (error) {
          set({ 
            user: null, 
            isAuthenticated: false 
          })
        }
      },

      openAuthModal: (mode = 'login') => {
        set({ isAuthModalOpen: true, authModalMode: mode })
      },

      closeAuthModal: () => {
        set({ isAuthModalOpen: false })
      },
    }),
    {
      name: 'vton-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
