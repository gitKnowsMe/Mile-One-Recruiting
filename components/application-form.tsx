'use client'

import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { FieldLabel, FieldGroup, FieldError } from '@/components/ui/field'
import {
  applicationSchema,
  isWaitlistTrailerType,
  type ApplicationFormValues,
} from '@/lib/application-schema'

const defaultValues: ApplicationFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  yearsExperience: '',
  trailerType: '',
  currentCDL: false,
  cdlPhoto: null,
  medicalCardPhoto: null,
}

export function ApplicationForm() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues,
  })

  const [submitted, setSubmitted] = useState(false)
  const [submittedAsWaitlist, setSubmittedAsWaitlist] = useState(false)
  const [submitError, setSubmitError] = useState(false)

  const currentCDL = watch('currentCDL')
  const trailerType = watch('trailerType')
  const cdlPhoto = watch('cdlPhoto')
  const medicalCardPhoto = watch('medicalCardPhoto')

  const onSubmit = async (values: ApplicationFormValues) => {
    setSubmitError(false)

    try {
      const data = new FormData()
      data.append('firstName', values.firstName)
      data.append('lastName', values.lastName)
      data.append('email', values.email)
      data.append('phone', values.phone)
      data.append('yearsExperience', values.yearsExperience)
      data.append('trailerType', values.trailerType)
      data.append('currentCDL', String(values.currentCDL))
      if (values.cdlPhoto) {
        data.append('cdlPhoto', values.cdlPhoto)
      }
      if (values.medicalCardPhoto) {
        data.append('medicalCardPhoto', values.medicalCardPhoto)
      }

      const response = await fetch('/api/apply', {
        method: 'POST',
        body: data,
      })

      if (!response.ok) {
        throw new Error('Application submission failed')
      }

      const result = (await response.json()) as { isWaitlist: boolean }

      setSubmittedAsWaitlist(result.isWaitlist)
      setSubmitted(true)
      reset(defaultValues)

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000)
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitError(true)
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
              <p className="text-red-800 font-semibold">
                Something went wrong submitting your application. Please try again.
              </p>
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

            {/* CDL Status */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-input cursor-pointer"
                  {...register('currentCDL')}
                />
                <span className="text-foreground font-medium">
                  I currently have a valid CDL
                </span>
              </label>
            </div>

            {/* CDL & Medical Card Photo Uploads */}
            {currentCDL && (
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
                        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
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
                        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
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
            )}

            {/* TCPA Consent */}
            <p className="text-xs text-muted-foreground text-center">
              By submitting this application, you agree to be contacted by phone, text, or email
              regarding this opportunity. Message and data rates may apply.
            </p>

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
