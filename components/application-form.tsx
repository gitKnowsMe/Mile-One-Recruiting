'use client'

import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { upload } from '@vercel/blob/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { FieldLabel, FieldGroup, FieldError } from '@/components/ui/field'
import {
  applicationSchema,
  isWaitlistTrailerType,
  type ApplicationFormValues,
} from '@/lib/application-schema'

const defaultValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  yearsExperience: '',
  trailerType: '',
  carrierDataSharingAgreed: false,
}

export function ApplicationForm() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues,
  })

  const [submitted, setSubmitted] = useState(false)
  const [submittedAsWaitlist, setSubmittedAsWaitlist] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const trailerType = watch('trailerType')
  const cdlPhoto = watch('cdlPhoto')
  const medicalCardPhoto = watch('medicalCardPhoto')

  const onSubmit = async (values: ApplicationFormValues) => {
    setSubmitError(null)

    try {
      // Upload photos straight to Blob storage from the browser — phone
      // camera photos routinely exceed the 4.5MB request body limit that
      // Vercel's serverless functions enforce, so the files never pass
      // through /api/apply itself.
      const [cdlBlob, medicalCardBlob] = await Promise.all([
        upload(`applications/cdl-${values.cdlPhoto.name}`, values.cdlPhoto, {
          access: 'private',
          handleUploadUrl: '/api/apply/upload',
        }),
        upload(`applications/medical-${values.medicalCardPhoto.name}`, values.medicalCardPhoto, {
          access: 'private',
          handleUploadUrl: '/api/apply/upload',
        }),
      ])

      const response = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
          yearsExperience: values.yearsExperience,
          trailerType: values.trailerType,
          cdlPhotoUrl: cdlBlob.url,
          medicalCardPhotoUrl: medicalCardBlob.url,
          carrierDataSharingAgreed: values.carrierDataSharingAgreed,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        const fieldErrors = result?.errors as Record<string, string[]> | undefined
        console.error('Application submission failed:', fieldErrors)

        if (fieldErrors) {
          for (const [field, messages] of Object.entries(fieldErrors)) {
            if (field === '_form') continue
            setError(field as keyof ApplicationFormValues, { message: messages[0] })
          }
        }

        setSubmitError(
          fieldErrors?._form?.[0] ?? 'Please fix the highlighted fields and try again.'
        )
        return
      }

      setSubmittedAsWaitlist(result.isWaitlist)
      setSubmitted(true)
      reset(defaultValues)

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000)
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitError('Something went wrong submitting your application. Please try again.')
    }
  }

  return (
    <section id="application-form" className="w-full py-20 sm:py-32 bg-secondary/5">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-foreground text-balance">
            Ready to Hit the Road?
          </h2>
          <p className="text-lg text-muted-foreground">
            Apply now and join our team of professional flatbed drivers.
          </p>
        </div>

        <Card className="p-8 sm:p-12 bg-card border-border shadow-lg">
          {submitted && (
            <div className="mb-8 p-4 bg-green-100 border border-green-300 rounded-lg">
              {submittedAsWaitlist ? (
                <p className="text-green-800 font-semibold">
                  ✓ Thanks for applying! We don&apos;t have current openings for dry van or reefer
                  positions — our recruiting is focused on flatbed right now. We&apos;ll keep your
                  application on file and reach out if that changes.
                </p>
              ) : (
                <p className="text-green-800 font-semibold">
                  ✓ Thanks for applying! Our recruiting team will be in touch shortly about flatbed openings.
                </p>
              )}
            </div>
          )}

          {submitError && (
            <div className="mb-8 p-4 bg-red-100 border border-red-300 rounded-lg">
              <p className="text-red-800 font-semibold">{submitError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Row */}
            <div className="grid sm:grid-cols-2 gap-6">
              <FieldGroup>
                <FieldLabel htmlFor="firstName">First Name *</FieldLabel>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  className="w-full"
                  {...register('firstName')}
                />
                <FieldError errors={errors.firstName ? [errors.firstName] : undefined} />
              </FieldGroup>

              <FieldGroup>
                <FieldLabel htmlFor="lastName">Last Name *</FieldLabel>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Smith"
                  className="w-full"
                  {...register('lastName')}
                />
                <FieldError errors={errors.lastName ? [errors.lastName] : undefined} />
              </FieldGroup>
            </div>

            {/* Contact Row */}
            <div className="grid sm:grid-cols-2 gap-6">
              <FieldGroup>
                <FieldLabel htmlFor="email">Email *</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className="w-full"
                  {...register('email')}
                />
                <FieldError errors={errors.email ? [errors.email] : undefined} />
              </FieldGroup>

              <FieldGroup>
                <FieldLabel htmlFor="phone">Phone Number *</FieldLabel>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  className="w-full"
                  {...register('phone')}
                />
                <FieldError errors={errors.phone ? [errors.phone] : undefined} />
              </FieldGroup>
            </div>

            {/* Experience */}
            <FieldGroup>
              <FieldLabel htmlFor="yearsExperience">Years of Driving Experience *</FieldLabel>
              <select
                id="yearsExperience"
                className="w-full px-4 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                {...register('yearsExperience')}
              >
                <option value="">Select experience level</option>
                <option value="new-grad">New Grad — No Experience</option>
                <option value="0-1">0-1 years</option>
                <option value="1-3">1-3 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5-10">5-10 years</option>
                <option value="10+">10+ years</option>
              </select>
              <FieldError errors={errors.yearsExperience ? [errors.yearsExperience] : undefined} />
            </FieldGroup>

            {/* Trailer Type */}
            <FieldGroup>
              <FieldLabel htmlFor="trailerType">Trailer Type *</FieldLabel>
              <select
                id="trailerType"
                className="w-full px-4 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                {...register('trailerType')}
              >
                <option value="">Select trailer type</option>
                <option value="flatbed">Flatbed</option>
                <option value="reefer">Reefer</option>
                <option value="dry-van">Dry Van</option>
              </select>
              <FieldError errors={errors.trailerType ? [errors.trailerType] : undefined} />
              {isWaitlistTrailerType(trailerType) && (
                <p className="mt-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  Heads up — we&apos;re currently only hiring for flatbed positions. You&apos;re
                  welcome to apply anyway and we&apos;ll keep you on file.
                </p>
              )}
            </FieldGroup>

            {/* CDL & Medical Card Photo Uploads */}
            <div className="space-y-6">
              <FieldGroup>
                <FieldLabel htmlFor="cdlPhoto">CDL Photo Upload *</FieldLabel>
                <Controller
                  control={control}
                  name="cdlPhoto"
                  render={({ field: { onChange, onBlur, name, ref } }) => (
                    <input
                      id="cdlPhoto"
                      name={name}
                      ref={ref}
                      type="file"
                      accept="image/*,.pdf"
                      onBlur={onBlur}
                      onChange={(e) => onChange(e.target.files?.[0])}
                      className="block w-full text-sm text-muted-foreground
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-lg file:border-0
                        file:text-sm file:font-semibold
                        file:bg-primary file:text-primary-foreground
                        hover:file:bg-primary/90
                        cursor-pointer"
                    />
                  )}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG, or PDF — max 10MB
                </p>
                {cdlPhoto && (
                  <p className="text-sm text-muted-foreground mt-1">✓ {cdlPhoto.name} selected</p>
                )}
                <FieldError errors={errors.cdlPhoto ? [errors.cdlPhoto] : undefined} />
              </FieldGroup>

              <FieldGroup>
                <FieldLabel htmlFor="medicalCardPhoto">Medical Card Photo Upload *</FieldLabel>
                <Controller
                  control={control}
                  name="medicalCardPhoto"
                  render={({ field: { onChange, onBlur, name, ref } }) => (
                    <input
                      id="medicalCardPhoto"
                      name={name}
                      ref={ref}
                      type="file"
                      accept="image/*,.pdf"
                      onBlur={onBlur}
                      onChange={(e) => onChange(e.target.files?.[0])}
                      className="block w-full text-sm text-muted-foreground
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-lg file:border-0
                        file:text-sm file:font-semibold
                        file:bg-primary file:text-primary-foreground
                        hover:file:bg-primary/90
                        cursor-pointer"
                    />
                  )}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG, or PDF — max 10MB
                </p>
                {medicalCardPhoto && (
                  <p className="text-sm text-muted-foreground mt-1">
                    ✓ {medicalCardPhoto.name} selected
                  </p>
                )}
                <FieldError
                  errors={errors.medicalCardPhoto ? [errors.medicalCardPhoto] : undefined}
                />
              </FieldGroup>
            </div>

            {/* TCPA Consent */}
            <p className="text-xs text-muted-foreground text-center">
              By submitting this application, you agree to be contacted by phone, text, or email
              regarding this opportunity. Message and data rates may apply.
            </p>

            {/* Carrier Data-Sharing Disclosure */}
            <FieldGroup>
              <Controller
                control={control}
                name="carrierDataSharingAgreed"
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <label className="flex items-start gap-3 cursor-pointer">
                    <Checkbox
                      ref={ref}
                      checked={value}
                      onCheckedChange={(checked) => onChange(checked === true)}
                      onBlur={onBlur}
                      className="mt-1"
                    />
                    <span className="text-xs text-muted-foreground">
                      By submitting this application, I understand that Mile One Recruiting will
                      share my information with partner carriers that have current driving
                      openings matching my profile. These carriers conduct their own independent
                      hiring processes, which may include background checks, driving record
                      reviews, and drug and alcohol testing, in accordance with applicable law.
                    </span>
                  </label>
                )}
              />
              <FieldError
                errors={errors.carrierDataSharingAgreed ? [errors.carrierDataSharingAgreed] : undefined}
              />
            </FieldGroup>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-3 text-lg"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              We respect your privacy. Your information will never be shared without consent.
            </p>
          </form>
        </Card>
      </div>
    </section>
  )
}
