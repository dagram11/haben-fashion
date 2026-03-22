import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'

// Initialize Replicate with the API token
const getReplicate = () => {
  const token = process.env.REPLICATE_API_TOKEN
  if (!token) {
    throw new Error('AI service is not configured')
  }
  return new Replicate({ auth: token })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, userImage, size, ip, country, city, productImage, productDescription, productCategory } = body

    // Validate required fields
    if (!productId || !userImage || !size) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate prompts based on category
    const getPrompt = (category: string) => {
      const prompts: Record<string, string> = {
        Women: "Make the woman in Image 1 wear the outfit from Image 2. Keep her face, body ,height, the person pose , the person location in the image ,the person size, background, and lighting the same. Ensure realistic fabric integration, natural shadows, and accurate colour adaptation so the new outfit blends seamlessly into Image 1, the garment description is it's a full long floor length dress covering legs and widening shape from waist to hem",
        Men: "Make the man in Image 1 wear the outfit from Image 2. Keep his face, body ,height, the person pose , the person location in the image ,the person size, background, and lighting the same. Ensure realistic fabric integration, natural shadows, and accurate colour adaptation so the new outfit blends seamlessly into Image 1, the garment description is it's a top outfit covering hands",
        upper_body: "Make the person in Image 1 wear the outfit from Image 2. Keep their face, body, height, pose, location, size, background, and lighting the same. Ensure realistic fabric integration, natural shadows, and accurate colour adaptation.",
        lower_body: "Make the person in Image 1 wear the outfit from Image 2. Keep their face, body, height, pose, location, size, background, and lighting the same. Ensure realistic fabric integration, natural shadows, and accurate colour adaptation.",
        dresses: "Make the person in Image 1 wear the outfit from Image 2. Keep their face, body, height, pose, location, size, background, and lighting the same. Ensure realistic fabric integration, natural shadows, and accurate colour adaptation.",
      }
      return prompts[category] || prompts.Women
    }

    const prompt = getPrompt(productCategory || 'Women')

    // Initialize Replicate
    const replicate = getReplicate()

    console.log('Calling Replicate Seedream 5 Lite with input:', {
      productImage: '[IMAGE]',
      userImage: '[IMAGE]',
      prompt: prompt,
      productCategory: productCategory
    })

    // Create prediction with bytedance/seedream-5-lite model
    const prediction = await replicate.predictions.create({
      version: 'bytedance/seedream-5-lite',
      input: {
        image_input: [userImage, productImage],
        prompt: prompt,
        negative_prompt: 'low quality, bad quality, blurry, distorted, ugly, deformed',
        num_inference_steps: 28,
        guidance_scale: 3.5,
        seed: Math.floor(Math.random() * 1000000),
      }
    })

    console.log('Prediction created:', prediction.id, 'Status:', prediction.status)

    // Return the prediction ID for polling
    return NextResponse.json({
      success: true,
      predictionId: prediction.id,
      status: prediction.status,
    })
  } catch (error) {
    console.error('Try-on error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate try-on' },
      { status: 500 }
    )
  }
}

// Poll endpoint to check prediction status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const predictionId = searchParams.get('predictionId')

    if (!predictionId) {
      return NextResponse.json(
        { error: 'Missing predictionId' },
        { status: 400 }
      )
    }

    const replicate = getReplicate()

    // Get prediction status
    const prediction = await replicate.predictions.get(predictionId)

    console.log('Prediction status:', prediction.id, prediction.status)

    if (prediction.status === 'succeeded') {
      // Get the output image
      const output = prediction.output
      let outputUrl: string | null = null

      if (Array.isArray(output) && output.length > 0) {
        outputUrl = output[0]
      } else if (typeof output === 'string') {
        outputUrl = output
      } else if (output && typeof output === 'object' && 'url' in output) {
        outputUrl = (output as { url: () => string }).url()
      }

      if (!outputUrl) {
        return NextResponse.json({
          status: 'failed',
          error: 'No output image received'
        })
      }

      console.log('Output URL:', outputUrl)

      // Download and convert to base64
      const imageResponse = await fetch(outputUrl)
      const arrayBuffer = await imageResponse.arrayBuffer()
      const base64Image = Buffer.from(arrayBuffer).toString('base64')

      console.log('Image downloaded and converted, size:', arrayBuffer.byteLength, 'bytes')

      return NextResponse.json({
        status: 'succeeded',
        preview: base64Image,
      })
    } else if (prediction.status === 'failed') {
      return NextResponse.json({
        status: 'failed',
        error: prediction.error || 'Prediction failed'
      })
    } else {
      // Still processing
      return NextResponse.json({
        status: prediction.status,
      })
    }
  } catch (error) {
    console.error('Poll error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to check status' },
      { status: 500 }
    )
  }
}
