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
    description: 'Earn $75K+ in your first year. Top earners make well over $100K annually.',
    icon: '💰',
  },
  {
    title: 'Free Training',
    description: 'Comprehensive CDL training programs for new and experienced drivers.',
    icon: '🎓',
  },
  {
    title: 'Home Time',
    description: 'Flexible schedules and home time options. Your life matters.',
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
            Why Join Open Mile
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
