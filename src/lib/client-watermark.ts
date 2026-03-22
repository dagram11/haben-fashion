// Client-side watermarking utility to avoid Vercel serverless body size limits

export async function applyWatermarks(
  imageBase64: string,
  productName: string
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    img.onload = async () => {
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'))
          return
        }
        
        canvas.width = img.width
        canvas.height = img.height
        
        // Draw original image
        ctx.drawImage(img, 0, 0)
        
        const padding = 20
        
        // Load and draw logo watermark (top-right)
        try {
          const logoImg = new Image()
          logoImg.crossOrigin = 'anonymous'
          
          await new Promise<void>((res, rej) => {
            logoImg.onload = () => res()
            logoImg.onerror = () => rej(new Error('Failed to load logo'))
            logoImg.src = '/assets/watermark-logo.png'
          })
          
          // Logo size: 25% of image width, max 300px
          const logoWidth = Math.min(300, img.width * 0.25)
          const logoHeight = (logoImg.height / logoImg.width) * logoWidth
          
          const logoX = img.width - logoWidth - padding
          const logoY = padding
          
          ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight)
        } catch (logoErr) {
          console.warn('Logo watermark failed, using text fallback:', logoErr)
          // Fallback: draw text logo
          const fontSize = Math.max(16, img.width * 0.025)
          ctx.font = `bold ${fontSize}px Arial`
          ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
          const text = 'LIDYA FASHION'
          const textWidth = ctx.measureText(text).width
          const textX = img.width - textWidth - padding - 10
          const textY = padding + fontSize + 10
          
          ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
          ctx.fillRect(textX - 10, textY - fontSize - 5, textWidth + 20, fontSize + 15)
          ctx.fillStyle = 'white'
          ctx.fillText(text, textX, textY)
        }
        
        // Draw URL watermark (bottom-right)
        const urlFontSize = Math.max(20, img.width * 0.03)
        ctx.font = `bold ${urlFontSize}px Arial`
        const urlText = 'lidyafashion.com'
        const urlWidth = ctx.measureText(urlText).width
        
        // URL size: 27% of image width, max 370px
        const urlBgWidth = Math.min(370, img.width * 0.27)
        const urlBgHeight = urlFontSize * 2.2
        const urlX = img.width - urlBgWidth - padding
        const urlY = img.height - urlBgHeight - padding
        
        // Draw background
        const gradient = ctx.createLinearGradient(urlX, urlY, urlX + urlBgWidth, urlY + urlBgHeight)
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0.85)')
        gradient.addColorStop(1, 'rgba(20, 20, 20, 0.85)')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.roundRect(urlX, urlY, urlBgWidth, urlBgHeight, 6)
        ctx.fill()
        
        // Draw URL text
        ctx.fillStyle = 'white'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(urlText, urlX + urlBgWidth / 2, urlY + urlBgHeight / 2)
        
        // Convert to blob
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Failed to create blob'))
          }
        }, 'image/png', 1.0)
        
      } catch (err) {
        reject(err)
      }
    }
    
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = `data:image/png;base64,${imageBase64}`
  })
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  a.remove()
}
