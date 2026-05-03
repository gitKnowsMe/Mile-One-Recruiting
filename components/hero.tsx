'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'

export function Hero() {
  const scrollToForm = () => {
    const formElement = document.getElementById('application-form')
    formElement?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative w-full min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-truck.jpg"
          alt="Flatbed truck on open highway"
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="max-w-2xl">
          <div className="mb-6 inline-block">
            <span className="bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-semibold">
              CDL Graduates Welcome
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight text-balance">
            Your Open Road Starts Here
          </h1>

          <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-xl leading-relaxed">
            Join Open Mile Recruiting and earn competitive pay driving premium flatbed OTR routes. Training programs, steady work, and opportunities for professional truck drivers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
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
              className="bg-white/10 border-white text-white hover:bg-white/20"
            >
              Learn More
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-2xl">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-accent leading-tight">$2,500–$3,000/week</p>
              <p className="text-sm text-white/80 mt-2">Weekly Pay</p>
            </div>
            <div>
              <p className="text-lg sm:text-2xl font-bold text-accent leading-tight">Paid Training</p>
              <p className="text-sm text-white/80 mt-2">($500/week)</p>
            </div>
            <div>
              <p className="text-lg sm:text-2xl font-bold text-accent leading-tight">Every 2–3 Weeks</p>
              <p className="text-sm text-white/80 mt-2">Home Time</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
