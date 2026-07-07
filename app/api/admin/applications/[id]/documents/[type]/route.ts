import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { get } from '@vercel/blob'
import { db } from '@/lib/db'
import { applications } from '@/lib/db/schema'

export const runtime = 'nodejs'

function isAuthorized(request: NextRequest) {
  const expected = process.env.ADMIN_ACCESS_TOKEN
  if (!expected) return false
  return request.nextUrl.searchParams.get('token') === expected
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; type: string }> }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id, type } = await params
  if (type !== 'cdl' && type !== 'medical-card') {
    return NextResponse.json({ error: 'Invalid document type' }, { status: 400 })
  }

  const [application] = await db
    .select()
    .from(applications)
    .where(eq(applications.id, id))
    .limit(1)

  if (!application) {
    return NextResponse.json({ error: 'Application not found' }, { status: 404 })
  }

  const blobUrl = type === 'cdl' ? application.cdlPhotoUrl : application.medicalCardPhotoUrl

  const result = await get(blobUrl, { access: 'private' })
  if (!result) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 })
  }

  return new NextResponse(result.stream, {
    headers: {
      'Content-Type': result.blob.contentType ?? 'application/octet-stream',
      'Content-Disposition': `inline; filename="${type}-${id}"`,
    },
  })
}
