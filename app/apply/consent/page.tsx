'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  PENDING_APPLICATION_STORAGE_KEY,
  isWaitlistTrailerType,
  pendingApplicationSchema,
  type PendingApplicationPayload,
} from '@/lib/application-schema'

type LoadState =
  | { status: 'loading' }
  | { status: 'redirecting' }
  | { status: 'ready'; pendingApplication: PendingApplicationPayload }
  | { status: 'submitted'; isWaitlist: boolean }

export default function ConsentPage() {
  const router = useRouter()
  const [state, setState] = useState<LoadState>({ status: 'loading' })
  const [agreed, setAgreed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    const raw = sessionStorage.getItem(PENDING_APPLICATION_STORAGE_KEY)
    const parsed = raw ? pendingApplicationSchema.safeParse(JSON.parse(raw)) : null

    if (!parsed?.success) {
      setState({ status: 'redirecting' })
      router.replace('/')
      return
    }

    setState({ status: 'ready', pendingApplication: parsed.data })
  }, [router])

  if (state.status === 'loading' || state.status === 'redirecting') {
    return null
  }

  if (state.status === 'submitted') {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-16">
        <Card className="w-full max-w-lg p-8 sm:p-10 text-center">
          {state.isWaitlist ? (
            <p className="text-green-800 font-semibold">
              ✓ Thanks for applying! We don&apos;t have current openings for dry van or reefer
              positions — our recruiting is focused on flatbed right now. We&apos;ll keep your
              application on file and reach out if that changes.
            </p>
          ) : (
            <p className="text-green-800 font-semibold">
              ✓ Thanks for applying! Our recruiting team will be in touch shortly about flatbed
              openings.
            </p>
          )}
        </Card>
      </main>
    )
  }

  const { pendingApplication } = state

  const onAgreeAndSubmit = async () => {
    if (!agreed || submitting) return

    setSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...pendingApplication,
          drivingRecordDisclosureAcknowledged: true,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setSubmitError(
          result?.errors?._form?.[0] ?? 'Something went wrong submitting your application. Please try again.'
        )
        setSubmitting(false)
        return
      }

      sessionStorage.removeItem(PENDING_APPLICATION_STORAGE_KEY)
      setState({ status: 'submitted', isWaitlist: isWaitlistTrailerType(pendingApplication.trailerType) })
    } catch (error) {
      console.error('Consent submission error:', error)
      setSubmitError('Something went wrong submitting your application. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16">
      <Card className="w-full max-w-lg p-8 sm:p-10">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Driving Record Disclosure</h1>

          {/*
            PLACEHOLDER LEGAL TEXT — NOT FINAL.
            This disclosure has not been reviewed by an attorney and must not
            ship to production until legal counsel has approved the final
            wording (grep "PLACEHOLDER LEGAL TEXT" to find this before launch).
          */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            Mile One Recruiting may obtain a copy of your motor vehicle driving record and related
            driving history reports from state departments of motor vehicles and/or third-party
            reporting agencies as part of your application for employment. This report may include
            information about your license status, driving violations, accidents, and other
            records maintained by the applicable licensing authority.
          </p>

          <label className="flex items-start gap-3 pt-2 cursor-pointer">
            <Checkbox
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked === true)}
              className="mt-1"
            />
            <span className="text-sm text-foreground">
              I have read and understand this disclosure, and I authorize Mile One Recruiting to
              obtain such a report.
            </span>
          </label>

          {submitError && (
            <div className="p-4 bg-red-100 border border-red-300 rounded-lg">
              <p className="text-red-800 font-semibold text-sm">{submitError}</p>
            </div>
          )}

          <Button
            type="button"
            disabled={!agreed || submitting}
            onClick={onAgreeAndSubmit}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-3 text-lg"
          >
            {submitting ? 'Submitting...' : 'I Agree & Submit Application'}
          </Button>
        </div>
      </Card>
    </main>
  )
}
