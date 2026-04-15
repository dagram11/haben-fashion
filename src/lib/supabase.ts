import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if Supabase is properly configured
const isSupabaseConfigured = supabaseUrl && 
  supabaseKey && 
  supabaseUrl.startsWith('http')

// Create Supabase client only if configured
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseKey)
  : null

// Server-side client with service role for admin operations
export const supabaseAdmin = () => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  
  if (!url || !url.startsWith('http') || !serviceKey) {
    return null
  }
  
  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Types
export interface Product {
  id: string
  name: string
  description: string
  category: 'upper_body' | 'lower_body' | 'dresses'
  price: number
  image_1: string
  image_2?: string
  image_3?: string
  sizes: string[]
  colors: string[]
  stock: number
  featured: boolean
  created_at: string
  updated_at: string
}

export interface Brand {
  id: string
  brand_name: string
  watermark_logo: string
  created_at: string
}

export interface UserTryOn {
  id: string
  product_id: string
  user_image: string
  size: string
  ip_address?: string
  country?: string
  city?: string
  user_agent?: string
  created_at: string
}

export interface GeneratedResult {
  id: string
  tryon_id: string
  image_base64: string
  downloaded: boolean
  created_at: string
}

export interface Cart {
  id: string
  session_id: string
  created_at: string
  updated_at: string
}

export interface CartItem {
  id: string
  cart_id: string
  product_id: string
  quantity: number
  size: string
  color?: string
  created_at: string
  product?: Product
}

export interface Order {
  id: string
  cart_id?: string
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  total: number
  customer_email?: string
  customer_name?: string
  shipping_address?: {
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
  created_at: string
}

// Helper to check if Supabase is configured
export function isConfigured(): boolean {
  return isSupabaseConfigured
}
