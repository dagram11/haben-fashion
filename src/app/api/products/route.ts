import { NextRequest, NextResponse } from 'next/server'

// Mock products data for when Supabase is not configured
const mockProducts = [
  // Women - Products from uploaded data
  {
    id: '1',
    name: 'Navy Velvet Evening Gown',
    description: 'Luxurious navy blue velvet gown with a square neckline and heavy gold embroidery on the bodice. The floor-length skirt finishes with an elaborate, wide band of gold architectural patterns.',
    category: 'women',
    cloth_type: 'Women',
    price: 650.00,
    image_1: 'https://images2.imgbox.com/ef/70/HjWeBP2q_o.jpeg',
    image_2: 'https://images2.imgbox.com/ff/b8/3HBfa7sk_o.jpeg',
    image_3: 'https://images2.imgbox.com/b2/17/aJ9SGK0x_o.png',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'Gold'],
    featured: true,
    stock: 50,
  },
  {
    id: '2',
    name: 'White & Purple Floral Maxi',
    description: 'Elegant sleeveless white maxi dress with a scoop neckline detailed in purple floral embroidery. The hem features a wide, semi-sheer panel showcasing a dense pattern of purple flowers.',
    category: 'women',
    cloth_type: 'Women',
    price: 350.00,
    image_1: 'https://images2.imgbox.com/16/a4/DxmL4oel_o.jpeg',
    image_2: 'https://images2.imgbox.com/27/18/YFUlPZMb_o.jpeg',
    image_3: 'https://images2.imgbox.com/d4/c5/AIOLDu9i_o.png',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['White', 'Purple'],
    featured: true,
    stock: 45,
  },
  {
    id: '3',
    name: 'Traditional White & Red Kemis',
    description: 'Traditional white dress with puffed sleeves and a bold red center panel featuring gold embroidery and a cross motif. The neckline, cuffs, and hem are trimmed with matching red fabric and gold diamond patterns.',
    category: 'women',
    cloth_type: 'Women',
    price: 480.00,
    image_1: 'https://images2.imgbox.com/dc/44/vhCF2ud2_o.jpeg',
    image_2: 'https://images2.imgbox.com/04/96/fUCHT9ct_o.jpeg',
    image_3: 'https://images2.imgbox.com/ba/bd/RF97HgbR_o.png',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['White', 'Red'],
    featured: false,
    stock: 40,
  },
  {
    id: '4',
    name: 'Black Tunic with Gold Trim',
    description: 'Relaxed black midi dress with short sleeves and a V-neckline trimmed in yellow braided embroidery. A vertical yellow line runs down the center, ending in a large geometric cross design.',
    category: 'women',
    cloth_type: 'Women',
    price: 400.00,
    image_1: 'https://images2.imgbox.com/1a/10/V2zILFP9_o.jpeg',
    image_2: 'https://images2.imgbox.com/8a/af/zPEUvDmN_o.jpeg',
    image_3: 'https://images2.imgbox.com/4a/b3/EnAvPDCD_o.png',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'Gold'],
    featured: true,
    stock: 35,
  },
  {
    id: '5',
    name: 'White Dress with Patterned Hem',
    description: 'Sleeveless white A-line dress with a V-neckline accented by black and yellow floral motifs. The skirt features a bold, contrasting lower section with a black and yellow abstract leaf pattern.',
    category: 'women',
    cloth_type: 'Women',
    price: 450.00,
    image_1: 'https://images2.imgbox.com/47/87/v2DB4nQx_o.jpeg',
    image_2: 'https://images2.imgbox.com/53/c4/PkLlCujJ_o.jpeg',
    image_3: 'https://images2.imgbox.com/74/34/bg1KzKzF_o.png',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['White', 'Black', 'Gold'],
    featured: true,
    stock: 30,
  },
  {
    id: '6',
    name: 'White & Purple Geometric Dress',
    description: 'Classic white dress with puffed sleeves and purple diamond embroidery running down the center. It features a decorative cross motif and a matching geometric border along the hem.',
    category: 'women',
    cloth_type: 'Women',
    price: 400.00,
    image_1: 'https://images2.imgbox.com/06/50/G46JjkhT_o.jpeg',
    image_2: 'https://images2.imgbox.com/5d/09/frULytAZ_o.jpeg',
    image_3: 'https://images2.imgbox.com/c9/d6/Q8i59Jl1_o.png',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['White', 'Purple'],
    featured: false,
    stock: 35,
  },
  {
    id: '7',
    name: 'White Maxi with Gold & Blue Trim',
    description: 'Elegant white maxi with ruffled puff sleeves and a V-neckline detailed in gold and turquoise. The wide hem displays an intricate band of traditional cross motifs in matching colors.',
    category: 'women',
    cloth_type: 'Women',
    price: 420.00,
    image_1: 'https://images2.imgbox.com/a6/62/jlDiBFib_o.jpeg',
    image_2: 'https://images2.imgbox.com/a6/b2/ITdH6HcT_o.jpeg',
    image_3: 'https://images2.imgbox.com/2d/e9/fAyFM6DE_o.jpeg',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['White', 'Golden'],
    featured: false,
    stock: 25,
  },
  {
    id: '8',
    name: 'White Gown with Emerald Accents',
    description: 'Traditional white gown with puffed sleeves and emerald green embroidery running from the neck to a central diamond motif. Includes a matching green waistband and a wide, patterned green border at the hem.',
    category: 'women',
    cloth_type: 'Women',
    price: 450.00,
    image_1: 'https://images2.imgbox.com/c8/d1/RBtLVU7d_o.jpeg',
    image_2: 'https://images2.imgbox.com/78/e7/3MiWDJb3_o.jpeg',
    image_3: 'https://images2.imgbox.com/e9/0a/6Axbqy5o_o.png',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['White', 'Emerald'],
    featured: true,
    stock: 20,
  },
  {
    id: '9',
    name: 'Sleeveless White Dress with Teal Bands',
    description: 'Sleeveless white dress with a square neckline framed by teal and gold embroidered fabric. The lower skirt features two wide, horizontal bands of intricate teal patterning.',
    category: 'women',
    cloth_type: 'Women',
    price: 400.00,
    image_1: 'https://images2.imgbox.com/8f/9c/BERiDoYx_o.jpeg',
    image_2: 'https://images2.imgbox.com/94/57/VQkysw70_o.jpeg',
    image_3: 'https://images2.imgbox.com/cf/05/r1w4MMYz_o.png',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['White', 'Teal'],
    featured: false,
    stock: 30,
  },
  {
    id: '10',
    name: 'Cream Dress with Lime Green Detail',
    description: 'Cream maxi dress with puffed sleeves and a bold lime green zig-zag embroidery panel down the center. The hem is finished with a wide, shiny green band featuring delicate floral vine stitching.',
    category: 'women',
    cloth_type: 'Women',
    price: 400.00,
    image_1: 'https://images2.imgbox.com/be/82/0Aq78CU0_o.jpeg',
    image_2: 'https://images2.imgbox.com/58/81/fKe2RjRM_o.jpeg',
    image_3: 'https://images2.imgbox.com/26/92/KEigdIGE_o.png',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['White', 'Lime'],
    featured: false,
    stock: 25,
  },
  // Men - Products from uploaded male data
  {
    id: '11',
    name: 'White Kurta with Green Side Panel',
    description: 'Classic white long-sleeved kurta featuring a vertical green and gold patterned panel on the left side. Matching embroidered trim accents the mandarin collar and sleeve cuffs.',
    category: 'men',
    cloth_type: 'Men',
    price: 350.00,
    image_1: 'https://images2.imgbox.com/ad/b2/Jf9zURoS_o.jpeg',
    image_2: 'https://images2.imgbox.com/eb/49/LMG9aTax_o.png',
    image_3: 'https://images2.imgbox.com/eb/49/LMG9aTax_o.png',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['White', 'Gold'],
    featured: true,
    stock: 45,
  },
  {
    id: '12',
    name: 'White Tunic with Red Geometric Yoke',
    description: 'Simple white long-sleeved tunic distinguished by a bold red and orange geometric pattern around the neckline. The design is mirrored on the sleeve cuffs for a cohesive look.',
    category: 'men',
    cloth_type: 'Men',
    price: 300.00,
    image_1: 'https://images2.imgbox.com/28/4e/xfZTzfhc_o.jpeg',
    image_2: 'https://images2.imgbox.com/65/30/Fs2U39cc_o.png',
    image_3: 'https://images2.imgbox.com/65/30/Fs2U39cc_o.png',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['White', 'Red'],
    featured: true,
    stock: 35,
  },
  {
    id: '13',
    name: 'White Kurta with Colorful Chest Embroidery',
    description: 'Traditional white kurta featuring vibrant multi-colored embroidery running down the center chest in vertical stripes. The detailed stitching ends in a geometric diamond motif, with matching cuffs.',
    category: 'men',
    cloth_type: 'Men',
    price: 385.00,
    image_1: 'https://images2.imgbox.com/3f/86/5YGwz875_o.jpeg',
    image_2: 'https://images2.imgbox.com/22/2e/vhXO5XSX_o.png',
    image_3: 'https://images2.imgbox.com/22/2e/vhXO5XSX_o.png',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['White', 'Red', 'Gold'],
    featured: true,
    stock: 40,
  },
  {
    id: '14',
    name: 'Emerald Green Embroidered Shirt',
    description: 'Deep green long-sleeved shirt featuring intricate white geometric embroidery on the upper right chest. It has a clean mandarin collar and a subtle button placket.',
    category: 'men',
    cloth_type: 'Men',
    price: 300.00,
    image_1: 'https://images2.imgbox.com/d3/db/buMr2Mm3_o.jpeg',
    image_2: 'https://images2.imgbox.com/e4/60/vhMg0H08_o.png',
    image_3: 'https://images2.imgbox.com/e4/60/vhMg0H08_o.png',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Green'],
    featured: false,
    stock: 30,
  },
  {
    id: '15',
    name: 'White Linen Shirt with Black Motif',
    description: 'Relaxed white linen shirt featuring bold black geometric embroidery on the left shoulder and chest. Matching black patterned trim adorns the rolled-up sleeve cuffs.',
    category: 'men',
    cloth_type: 'Men',
    price: 320.00,
    image_1: 'https://images2.imgbox.com/18/fa/FxAGXeEA_o.jpeg',
    image_2: 'https://images2.imgbox.com/37/0c/tWibS957_o.png',
    image_3: 'https://images2.imgbox.com/37/0c/tWibS957_o.png',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['White', 'Black'],
    featured: true,
    stock: 35,
  },
]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const category = searchParams.get('category')
  const clothType = searchParams.get('cloth_type')
  const featured = searchParams.get('featured')
  const id = searchParams.get('id')

  try {
    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const isSupabaseConfigured = supabaseUrl && !supabaseUrl.includes('your-supabase')

    if (!isSupabaseConfigured) {
      // Return mock data
      let filteredProducts = [...mockProducts]
      
      if (id) {
        const product = filteredProducts.find(p => p.id === id)
        return NextResponse.json(product || null)
      }
      
      // Filter by cloth_type (for page classification) - case insensitive
      if (clothType) {
        filteredProducts = filteredProducts.filter(p => p.cloth_type.toLowerCase() === clothType.toLowerCase())
      } else if (category && category !== 'all') {
        // Fallback to category filter for backward compatibility
        filteredProducts = filteredProducts.filter(p => p.category === category)
      }
      
      if (featured === 'true') {
        filteredProducts = filteredProducts.filter(p => p.featured)
      }

      return NextResponse.json(filteredProducts)
    }

    // Use Supabase if configured
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    if (id) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return NextResponse.json(data)
    }

    let query = supabase.from('products').select('*')

    // Filter by cloth_type (for page classification) - case insensitive
    if (clothType) {
      query = query.ilike('cloth_type', clothType)
    } else if (category && category !== 'all') {
      // Fallback to category filter for backward compatibility
      query = query.eq('category', category)
    }

    if (featured === 'true') {
      query = query.eq('featured', true)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error('Products API error:', error)
    // Fallback to mock data on error
    let filteredProducts = [...mockProducts]
    
    if (id) {
      const product = filteredProducts.find(p => p.id === id)
      return NextResponse.json(product || null)
    }
    
    // Filter by cloth_type (for page classification) - case insensitive
    if (clothType) {
      filteredProducts = filteredProducts.filter(p => p.cloth_type.toLowerCase() === clothType.toLowerCase())
    } else if (category && category !== 'all') {
      // Fallback to category filter for backward compatibility
      filteredProducts = filteredProducts.filter(p => p.category === category)
    }
    
    if (featured === 'true') {
      filteredProducts = filteredProducts.filter(p => p.featured)
    }

    return NextResponse.json(filteredProducts)
  }
}
