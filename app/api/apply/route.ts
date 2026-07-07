import { createElement } from 'react'
import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { Resend } from 'resend'
import { db } from '@/lib/db'
import { applications } from '@/lib/db/schema'
import { applicationSchema, isWaitlistTrailerType } from '@/lib/application-schema'
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

export async function POST(request: NextRequest) {
  const formData = await request.formData()

  const parsed = applicationSchema.safeParse({
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    yearsExperience: formData.get('yearsExperience'),
    trailerType: formData.get('trailerType'),
    cdlPhoto: formData.get('cdlPhoto'),
    medicalCardPhoto: formData.get('medicalCardPhoto'),
  })

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const data = parsed.data
  const isWaitlist = isWaitlistTrailerType(data.trailerType)

  try {
    const cdlBlob = await put(`applications/cdl-${data.cdlPhoto.name}`, data.cdlPhoto, {
      access: 'public',
      addRandomSuffix: true,
    })

    const medicalCardBlob = await put(
      `applications/medical-${data.medicalCardPhoto.name}`,
      data.medicalCardPhoto,
      { access: 'public', addRandomSuffix: true }
    )

    await db.insert(applications).values({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      yearsExperience: data.yearsExperience,
      trailerType: data.trailerType,
      cdlPhotoUrl: cdlBlob.url,
      medicalCardPhotoUrl: medicalCardBlob.url,
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
      await getResend().emails.send({
        from: fromAddress,
        to: notifyAddress,
        subject: `New ${isWaitlist ? 'waitlist' : 'flatbed'} application: ${data.firstName} ${data.lastName}`,
        text: `${data.firstName} ${data.lastName}\n${data.email}\n${data.phone}\nExperience: ${data.yearsExperience}\nTrailer type: ${data.trailerType}`,
      })
    }
  } catch (error) {
    console.error('Failed to send confirmation email:', error)
  }

  return NextResponse.json({ success: true, isWaitlist })
}
