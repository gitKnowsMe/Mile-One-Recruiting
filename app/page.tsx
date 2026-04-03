import { Hero } from '@/components/hero'
import { Benefits } from '@/components/benefits'
import { ApplicationForm } from '@/components/application-form'
import { CTA } from '@/components/cta'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <main className="w-full">
      <Hero />
      <Benefits />
      <ApplicationForm />
      <CTA />
      <Footer />
    </main>
  )
}
