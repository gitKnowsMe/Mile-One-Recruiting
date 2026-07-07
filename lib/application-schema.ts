import { z } from 'zod'

export const yearsExperienceOptions = ['new-grad', '0-1', '1-3', '3-5', '5-10', '10+'] as const
export const trailerTypeOptions = ['flatbed', 'reefer', 'dry-van'] as const

export const isWaitlistTrailerType = (trailerType: string) =>
  trailerType === 'reefer' || trailerType === 'dry-van'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

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

export const applicationSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email'),
  phone: z.string().trim().min(7, 'Enter a valid phone number'),
  yearsExperience: yearsExperienceSchema,
  trailerType: trailerTypeSchema,
  // Every applicant must hold a valid CDL to drive commercially, so both
  // documents are always required.
  cdlPhoto: requiredFileSchema('CDL photo is required'),
  medicalCardPhoto: requiredFileSchema('Medical card photo is required'),
})

export type ApplicationFormValues = z.infer<typeof applicationSchema>
