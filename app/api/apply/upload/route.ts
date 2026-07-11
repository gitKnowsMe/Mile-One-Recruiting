import { NextRequest, NextResponse } from 'next/server'
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { ACCEPTED_UPLOAD_CONTENT_TYPES, MAX_FILE_SIZE } from '@/lib/application-schema'

export const runtime = 'nodejs'

// Issues short-lived client tokens so the browser can upload CDL/medical
// card photos directly to Blob storage, bypassing the serverless function's
// 4.5MB request body limit that large phone photos would otherwise hit.
export async function POST(request: NextRequest) {
  const body = (await request.json()) as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!/^applications\/(cdl|medical)-/.test(pathname)) {
          throw new Error('Invalid upload path')
        }

        return {
          allowedContentTypes: ACCEPTED_UPLOAD_CONTENT_TYPES,
          maximumSizeInBytes: MAX_FILE_SIZE,
          addRandomSuffix: true,
        }
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 400 }
    )
  }
}
