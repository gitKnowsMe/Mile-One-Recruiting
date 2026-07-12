import { z } from 'zod'

export const yearsExperienceOptions = ['new-grad', '0-1', '1-3', '3-5', '5-10', '10+'] as const
export const trailerTypeOptions = ['flatbed', 'reefer', 'dry-van'] as const

export const isWaitlistTrailerType = (trailerType: string) =>
  trailerType === 'reefer' || trailerType === 'dry-van'

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

// Vercel Blob accepts this alongside real MIME types so uploads aren't
// rejected when a browser fails to sniff a type (see isAcceptedFile below).
export const ACCEPTED_UPLOAD_CONTENT_TYPES = ['image/*', 'application/pdf', 'application/octet-stream']

// Browsers are inconsistent about what `file.type` reports for HEIC/HEIF
// (iPhone's default camera format) — some report it correctly, some report
// an empty string. Fall back to the file extension so iPhone uploads aren't
// rejected just because the browser didn't sniff a MIME type.
const ACCEPTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif', '.pdf']

const isAcceptedFile = (file: File) =>
  file.type.startsWith('image/') ||
  file.type === 'application/pdf' ||
  ACCEPTED_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext))

const requiredFileSchema = (requiredMessage: string) =>
  z
    .instanceof(File, { message: requiredMessage })
    .refine((file) => file.size <= MAX_FILE_SIZE, 'File must be 10MB or smaller')
    .refine(isAcceptedFile, 'File must be an image or PDF')

const uploadedBlobUrlSchema = (pathPrefix: string, requiredMessage: string) =>
  z
    .string({ message: requiredMessage })
    .trim()
    .url(requiredMessage)
    .refine((url) => url.includes(`/applications/${pathPrefix}-`), requiredMessage)

const requiredCheckboxSchema = (message: string) =>
  z.boolean().refine((value) => value === true, { message })

const CARRIER_DATA_SHARING_MESSAGE =
  'You must agree to the data-sharing disclosure to submit your application'

const yearsExperienceSchema = z
  .string()
  .refine((value) => (yearsExperienceOptions as readonly string[]).includes(value), {
    message: 'Select your experience level',
  })

const trailerTypeSchema = z
  .string()
  .refine((value) => (trailerTypeOptions as readonly string[]).includes(value), {
    message: 'Select a trailer type',
  })

const baseApplicationFields = {
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email'),
  phone: z.string().trim().min(7, 'Enter a valid phone number'),
  yearsExperience: yearsExperienceSchema,
  trailerType: trailerTypeSchema,
}

// Client-side form schema — validates the raw File objects the user picked,
// before they're uploaded to Blob storage.
export const applicationSchema = z.object({
  ...baseApplicationFields,
  // Every applicant must hold a valid CDL to drive commercially, so both
  // documents are always required.
  cdlPhoto: requiredFileSchema('CDL photo is required'),
  medicalCardPhoto: requiredFileSchema('Medical card photo is required'),
  carrierDataSharingAgreed: requiredCheckboxSchema(CARRIER_DATA_SHARING_MESSAGE),
})

export type ApplicationFormValues = z.infer<typeof applicationSchema>

// Server-side schema for POST /api/apply — by the time this request is made,
// the photos have already been uploaded directly to Blob storage from the
// browser (see /api/apply/upload), so the API only receives their URLs. This
// keeps large photo uploads from ever passing through the serverless
// function body, which has a hard 4.5MB platform limit.
//
// carrierDataSharingAgreed is just a client-asserted gate — the route
// handler derives the actual carrierDataSharingAgreedAt timestamp itself at
// request time rather than trusting a client-supplied value, so a tampered
// clock can't misrepresent when consent was given.
export const applicationApiSchema = z.object({
  ...baseApplicationFields,
  cdlPhotoUrl: uploadedBlobUrlSchema('cdl', 'CDL photo is required'),
  medicalCardPhotoUrl: uploadedBlobUrlSchema('medical', 'Medical card photo is required'),
  carrierDataSharingAgreed: requiredCheckboxSchema(CARRIER_DATA_SHARING_MESSAGE),
})

export type ApplicationApiValues = z.infer<typeof applicationApiSchema>
