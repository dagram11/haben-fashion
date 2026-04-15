import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import { readFile } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tryonId, productName, imageBase64 } = body

    if (!tryonId) {
      return NextResponse.json(
        { error: 'Missing tryonId' },
        { status: 400 }
      )
    }

    if (!imageBase64) {
      return NextResponse.json(
        { error: 'Missing image data. Please regenerate the preview.' },
        { status: 400 }
      )
    }

    let watermarkedImage: Buffer

    try {
      // Convert base64 to buffer
      const cleanBuffer = Buffer.from(imageBase64, 'base64')

      // Get the main image dimensions
      const mainImageMeta = await sharp(cleanBuffer).metadata()
      const mainWidth = mainImageMeta.width || 800
      const mainHeight = mainImageMeta.height || 1000
      console.log('Main image dimensions:', mainWidth, 'x', mainHeight)

      // Load logo watermark for top-right corner
      const watermarkPath = path.join(process.cwd(), 'public', 'assets', 'watermark-logo.png')
      let logoWatermark: Buffer
      
      try {
        const watermarkBuffer = await readFile(watermarkPath)
        // Increased logo size: 25% of image width, max 300px
        const logoWidth = Math.round(Math.min(300, mainWidth * 0.25))
        logoWatermark = await sharp(watermarkBuffer)
          .resize(logoWidth, null, { fit: 'inside' })
          .png()
          .toBuffer()
        console.log('Logo watermark loaded, size:', logoWidth)
      } catch (fileError) {
        console.error('Logo watermark not found, creating fallback:', fileError)
        logoWatermark = await createLogoWatermark(mainWidth)
      }

      // Get logo dimensions
      const logoMeta = await sharp(logoWatermark).metadata()
      const logoWidth = logoMeta.width || 100
      const logoHeight = logoMeta.height || 50

      // Create URL watermark for bottom-right corner
      const urlWatermark = await createUrlWatermark(mainWidth)
      const urlMeta = await sharp(urlWatermark).metadata()
      const urlWidth = urlMeta.width || 150
      const urlHeight = urlMeta.height || 30

      // Calculate positions
      const padding = 20
      const logoX = mainWidth - logoWidth - padding
      const logoY = padding

      const urlX = mainWidth - urlWidth - padding
      const urlY = mainHeight - urlHeight - padding

      console.log('Logo position: top=', logoY, 'left=', logoX)
      console.log('URL position: top=', urlY, 'left=', urlX)

      // Apply both watermarks
      watermarkedImage = await sharp(cleanBuffer)
        .composite([
          {
            input: logoWatermark,
            top: logoY,
            left: logoX,
          },
          {
            input: urlWatermark,
            top: urlY,
            left: urlX,
          },
        ])
        .png()
        .toBuffer()
    } catch (imageError) {
      console.error('Image processing error:', imageError)
      // Return original image if watermarking fails
      watermarkedImage = Buffer.from(imageBase64, 'base64')
    }

    // Create safe filename
    const safeFileName = (productName || 'style-preview')
      .replace(/[^a-z0-9]/gi, '-')
      .replace(/-+/g, '-')
      .toLowerCase()

    // Return the watermarked image
    return new NextResponse(watermarkedImage, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="${safeFileName}.png"`,
        'Content-Length': watermarkedImage.length.toString(),
      },
    })
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process download' },
      { status: 500 }
    )
  }
}

// Create logo watermark (top-right corner) - fallback
async function createLogoWatermark(imageWidth: number): Promise<Buffer> {
  // Increased size: 25% of image width
  const textWidth = Math.min(280, Math.round(imageWidth * 0.25))
  const fontSize = Math.max(16, Math.round(textWidth / 10))
  const height = Math.round(fontSize * 2)
  
  const watermarkSvg = `
    <svg width="${textWidth}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:rgba(0,0,0,0.8)"/>
          <stop offset="100%" style="stop-color:rgba(30,30,30,0.8)"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)" rx="8"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">LIDYA FASHION</text>
    </svg>
  `
  return Buffer.from(watermarkSvg)
}

// Create URL watermark for bottom-right corner
async function createUrlWatermark(imageWidth: number): Promise<Buffer> {
  // Increased size: 27% of image width, max 370px
  const textWidth = Math.min(370, Math.round(imageWidth * 0.27))
  const fontSize = Math.max(20, Math.round(textWidth / 10))
  const height = Math.round(fontSize * 2.2)
  
  const watermarkSvg = `
    <svg width="${textWidth}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="urlBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:rgba(0,0,0,0.85)"/>
          <stop offset="100%" style="stop-color:rgba(20,20,20,0.85)"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#urlBg)" rx="6"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">lidyafashion.com</text>
    </svg>
  `
  return Buffer.from(watermarkSvg)
}
