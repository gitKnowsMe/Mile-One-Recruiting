'use client'

import { Card } from '@/components/ui/card'

interface BenefitItem {
  title: string
  description: string
  icon: string
}

const benefits: BenefitItem[] = [
  {
    title: 'Competitive Pay',
    description: 'Earn $2,500–$3,500 per week. Top earners exceed this with experience and performance.',
    icon: '💰',
  },
  {
    title: 'Paid Training ($500/week)',
    description: 'Hands-on CDL training plus specialized flatbed load securement and flatbed safety instruction — and you get paid while you learn.',
    icon: '🎓',
  },
  {
    title: 'Home Time',
    description: 'Expect home time every 2–3 weeks. If loads to your home location are scarce after 3 weeks on the road, we pay for your flight home. Your life and family matter.',
    icon: '🏠',
  },
  {
    title: 'Premium Routes',
    description: 'Flatbed OTR work with predictable routes and high-value loads.',
    icon: '🛣️',
  },
  {
    title: 'Equipment',
    description: 'Modern, well-maintained trucks and safety-first equipment.',
    icon: '🚛',
  },
  {
    title: 'Support Team',
    description: '24/7 dispatch support and a dedicated team behind you.',
    icon: '🤝',
  },
]

export function Benefits() {
  return (
    <section className="w-full py-20 sm:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-foreground text-balance">
            Why Join Mile One
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We offer more than just a job—we offer a career with benefits that matter to you and your family.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className="p-8 bg-card border border-border hover:shadow-lg transition-shadow"
            >
              <div className="text-5xl mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-foreground">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
