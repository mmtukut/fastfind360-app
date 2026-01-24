"use client"

import { Satellite, Brain, Palette, LineChart } from "lucide-react"

const steps = [
  {
    icon: Satellite,
    step: 1,
    title: "Satellite Intelligence",
    description:
      "We acquire high-resolution satellite imagery covering your entire state, capturing every structure visible from space.",
  },
  {
    icon: Brain,
    step: 2,
    title: "AI Detection",
    description:
      "Our machine learning model identifies every building footprint with 99.998% accuracy, even in dense urban areas.",
  },
  {
    icon: Palette,
    step: 3,
    title: "Classification & Analysis",
    description:
      "Properties are automatically classified as Residential, Commercial, or Industrial based on size and structural patterns.",
  },
  {
    icon: LineChart,
    step: 4,
    title: "Revenue Intelligence",
    description:
      "You receive a complete digital cadastre with estimated property tax recovery potential for each building.",
  },
]

export function SolutionSection() {
  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-background scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">How FastFind360 Works</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            From satellite imagery to actionable revenue insights in just 48 hours.
          </p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-border" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Step circle on desktop */}
                <div className="hidden lg:flex absolute -top-3 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-secondary rounded-full items-center justify-center z-10">
                  <span className="text-secondary-foreground font-bold">{step.step}</span>
                </div>

                <div className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow lg:mt-12">
                  <div className="lg:hidden w-10 h-10 bg-secondary rounded-full flex items-center justify-center mb-4">
                    <span className="text-secondary-foreground font-bold text-sm">{step.step}</span>
                  </div>
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                    <step.icon className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
