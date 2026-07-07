import { z } from 'zod'

export const yearsExperienceOptions = ['new-grad', '0-1', '1-3', '3-5', '5-10', '10+'] as const
export const trailerTypeOptions = ['flatbed', 'reefer', 'dry-van'] as const

export const isWaitlistTrailerType = (trailerType: string) =>
  trailerType === 'reefer' || trailerType === 'dry-van'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

const fileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_FILE_SIZE, 'File must be 10MB or smaller')
  .refine(
    (file) => file.type.startsWith('image/') || file.type === 'application/pdf',
    'File must be an image or PDF'
  )

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

export const applicationSchema = z
  .object({
    firstName: z.string().trim().min(1, 'First name is required'),
    lastName: z.string().trim().min(1, 'Last name is required'),
    email: z.string().trim().min(1, 'Email is required').email('Enter a valid email'),
    phone: z.string().trim().min(7, 'Enter a valid phone number'),
    yearsExperience: yearsExperienceSchema,
    trailerType: trailerTypeSchema,
    currentCDL: z.boolean(),
    cdlPhoto: fileSchema.nullable().optional(),
    medicalCardPhoto: fileSchema.nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.currentCDL) {
      if (!data.cdlPhoto) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'CDL photo is required',
          path: ['cdlPhoto'],
        })
      }
      if (!data.medicalCardPhoto) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Medical card photo is required',
          path: ['medicalCardPhoto'],
        })
      }
    }
  })

export type ApplicationFormValues = z.infer<typeof applicationSchema>
