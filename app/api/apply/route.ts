import { createElement } from 'react'
import { NextRequest, NextResponse } from 'next/server'
import { get } from '@vercel/blob'
import { Resend } from 'resend'
import { db } from '@/lib/db'
import { applications } from '@/lib/db/schema'
import { applicationApiSchema, isWaitlistTrailerType } from '@/lib/application-schema'
import { StandardConfirmationEmail } from '@/emails/standard-confirmation'
import { WaitlistConfirmationEmail } from '@/emails/waitlist-confirmation'

export const runtime = 'nodejs'

let cachedResend: Resend | undefined

function getResend() {
  if (!cachedResend) {
    cachedResend = new Resend(process.env.RESEND_API_KEY)
  }
  return cachedResend
}

async function fetchBlobAttachment(url: string) {
  try {
    const result = await get(url, { access: 'private' })
    if (!result || result.statusCode !== 200) return null

    const buffer = Buffer.from(await new Response(result.stream).arrayBuffer())
    return { filename: result.blob.pathname.split('/').pop() ?? 'attachment', content: buffer }
  } catch (error) {
    console.error('Failed to fetch blob attachment:', error)
    return null
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  const parsed = applicationApiSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const data = parsed.data
  const isWaitlist = isWaitlistTrailerType(data.trailerType)

  try {
    // Photos were already uploaded directly to Blob storage from the
    // browser (see /api/apply/upload) — we just persist their URLs here.
    // carrierDataSharingAgreedAt is stamped here, from the server's own
    // clock, rather than trusting any client-supplied timestamp — the
    // request body only asserts that the checkbox was checked.
    await db.insert(applications).values({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      yearsExperience: data.yearsExperience,
      trailerType: data.trailerType,
      cdlPhotoUrl: data.cdlPhotoUrl,
      medicalCardPhotoUrl: data.medicalCardPhotoUrl,
      carrierDataSharingAgreedAt: new Date(),
      isWaitlist,
    })
  } catch (error) {
    console.error('Failed to save application:', error)
    return NextResponse.json(
      { success: false, errors: { _form: ['Something went wrong. Please try again.'] } },
      { status: 500 }
    )
  }

  // The application is saved at this point — an email hiccup below must not
  // turn a successful submission into a reported failure.
  try {
    const fromAddress = process.env.APPLICATIONS_FROM_EMAIL
    if (!fromAddress) {
      throw new Error('APPLICATIONS_FROM_EMAIL is not set')
    }

    await getResend().emails.send({
      from: fromAddress,
      to: data.email,
      subject: isWaitlist
        ? 'Your application is on file with Mile One Recruiting'
        : 'We received your flatbed driver application',
      react: isWaitlist
        ? createElement(WaitlistConfirmationEmail, { firstName: data.firstName })
        : createElement(StandardConfirmationEmail, { firstName: data.firstName }),
    })

    const notifyAddress = process.env.APPLICATIONS_NOTIFY_EMAIL
    if (notifyAddress) {
      const [cdlAttachment, medicalCardAttachment] = await Promise.all([
        fetchBlobAttachment(data.cdlPhotoUrl),
        fetchBlobAttachment(data.medicalCardPhotoUrl),
      ])

      await getResend().emails.send({
        from: fromAddress,
        to: notifyAddress,
        subject: `New ${isWaitlist ? 'waitlist' : 'flatbed'} application: ${data.firstName} ${data.lastName}`,
        text: `${data.firstName} ${data.lastName}\n${data.email}\n${data.phone}\nExperience: ${data.yearsExperience}\nTrailer type: ${data.trailerType}`,
        attachments: [cdlAttachment, medicalCardAttachment].filter((a) => a !== null),
      })
    }
  } catch (error) {
    console.error('Failed to send confirmation email:', error)
  }

  return NextResponse.json({ success: true, isWaitlist })
}
