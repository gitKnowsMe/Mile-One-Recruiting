'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field'

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  yearsExperience: string
  currentCDL: boolean
  cdlPhoto: File | null
  medicalCardPhoto: File | null
}

export function ApplicationForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    yearsExperience: '',
    currentCDL: false,
    cdlPhoto: null,
    medicalCardPhoto: null,
  })

  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Create FormData object for multipart submission
      const data = new FormData()
      data.append('firstName', formData.firstName)
      data.append('lastName', formData.lastName)
      data.append('email', formData.email)
      data.append('phone', formData.phone)
      data.append('yearsExperience', formData.yearsExperience)
      data.append('currentCDL', String(formData.currentCDL))
      if (formData.cdlPhoto) {
        data.append('cdlPhoto', formData.cdlPhoto)
      }
      if (formData.medicalCardPhoto) {
        data.append('medicalCardPhoto', formData.medicalCardPhoto)
      }

      // Since we're not using a backend, just simulate success
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSubmitted(true)
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        yearsExperience: '',
        currentCDL: false,
        cdlPhoto: null,
        medicalCardPhoto: null,
      })

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000)
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
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
              <p className="text-green-800 font-semibold">
                ✓ Application submitted! We&apos;ll be in touch within 24 hours.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Row */}
            <div className="grid sm:grid-cols-2 gap-6">
              <FieldGroup>
                <FieldLabel htmlFor="firstName">First Name *</FieldLabel>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
              </FieldGroup>

              <FieldGroup>
                <FieldLabel htmlFor="lastName">Last Name *</FieldLabel>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Smith"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
              </FieldGroup>
            </div>

            {/* Contact Row */}
            <div className="grid sm:grid-cols-2 gap-6">
              <FieldGroup>
                <FieldLabel htmlFor="email">Email *</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
              </FieldGroup>

              <FieldGroup>
                <FieldLabel htmlFor="phone">Phone Number *</FieldLabel>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
              </FieldGroup>
            </div>

            {/* Experience */}
            <FieldGroup>
              <FieldLabel htmlFor="yearsExperience">Years of Driving Experience *</FieldLabel>
              <select
                id="yearsExperience"
                name="yearsExperience"
                value={formData.yearsExperience}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select experience level</option>
                <option value="new-grad">New Grad — No Experience</option>
                <option value="0-1">0-1 years</option>
                <option value="1-3">1-3 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5-10">5-10 years</option>
                <option value="10+">10+ years</option>
              </select>
            </FieldGroup>

            {/* CDL Status */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="currentCDL"
                  checked={formData.currentCDL}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded border-input cursor-pointer"
                />
                <span className="text-foreground font-medium">
                  I currently have a valid CDL
                </span>
              </label>
            </div>

            {/* CDL & Medical Card Photo Uploads */}
            {formData.currentCDL && (
              <div className="space-y-6">
                <FieldGroup>
                  <FieldLabel htmlFor="cdlPhoto">CDL Photo Upload *</FieldLabel>
                  <input
                    id="cdlPhoto"
                    name="cdlPhoto"
                    type="file"
                    accept="image/*,.pdf"
                    required
                    onChange={handleFileChange}
                    className="block w-full text-sm text-muted-foreground
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-lg file:border-0
                      file:text-sm file:font-semibold
                      file:bg-primary file:text-primary-foreground
                      hover:file:bg-primary/90
                      cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG, or PDF — max 10MB
                  </p>
                  {formData.cdlPhoto && (
                    <p className="text-sm text-muted-foreground mt-1">
                      ✓ {formData.cdlPhoto.name} selected
                    </p>
                  )}
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel htmlFor="medicalCardPhoto">Medical Card Photo Upload *</FieldLabel>
                  <input
                    id="medicalCardPhoto"
                    name="medicalCardPhoto"
                    type="file"
                    accept="image/*,.pdf"
                    required
                    onChange={handleFileChange}
                    className="block w-full text-sm text-muted-foreground
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-lg file:border-0
                      file:text-sm file:font-semibold
                      file:bg-primary file:text-primary-foreground
                      hover:file:bg-primary/90
                      cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG, or PDF — max 10MB
                  </p>
                  {formData.medicalCardPhoto && (
                    <p className="text-sm text-muted-foreground mt-1">
                      ✓ {formData.medicalCardPhoto.name} selected
                    </p>
                  )}
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
