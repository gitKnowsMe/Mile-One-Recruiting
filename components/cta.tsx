'use client'

import { Button } from '@/components/ui/button'

export function CTA() {
  const scrollToForm = () => {
    const formElement = document.getElementById('application-form')
    formElement?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="w-full py-20 sm:py-32 bg-primary text-primary-foreground">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-balance">
          Don&apos;t Wait—Start Your Journey Today
        </h2>
        <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto opacity-90 leading-relaxed">
          Opportunities are waiting for qualified CDL drivers. Apply now and join hundreds of professional drivers earning top-tier pay with Mile One Recruiting.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={scrollToForm}
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold"
          >
            Apply Now
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
          >
            Call: 1-800-MILEONE
          </Button>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <p className="text-3xl sm:text-4xl font-bold text-accent mb-2">500+</p>
            <p className="opacity-90">Active Drivers</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-bold text-accent mb-2">10K+</p>
            <p className="opacity-90">Miles Monthly</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-bold text-accent mb-2">99%</p>
            <p className="opacity-90">Driver Retention</p>
          </div>
        </div>
      </div>
    </section>
  )
}
