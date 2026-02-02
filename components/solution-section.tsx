"use client"

import { Satellite, Brain, Palette, LineChart, ArrowRight } from "lucide-react"

const steps = [
  {
    icon: Satellite,
    step: 1,
    title: "Satellite Intelligence",
    description:
      "We acquire high-resolution satellite imagery covering your entire state, capturing every structure visible from space.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Brain,
    step: 2,
    title: "AI Detection",
    description:
      "Our machine learning model identifies every building footprint with 92%+ accuracy, even in dense urban areas.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Palette,
    step: 3,
    title: "Classification & Analysis",
    description:
      "Properties are automatically classified as Residential, Commercial, or Industrial based on size and structural patterns.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: LineChart,
    step: 4,
    title: "Revenue Intelligence",
    description:
      "You receive a complete digital cadastre with estimated property tax recovery potential for each building.",
    color: "from-orange-500 to-red-500",
  },
]

export function SolutionSection() {
  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-gradient-to-br from-background via-primary/5 to-background scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Our Solution</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            How{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              FastFind360
            </span>{" "}
            Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            From satellite imagery to actionable revenue insights in just 48 hours.
          </p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 via-green-500 to-orange-500 opacity-20 rounded-full" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="relative group" style={{ animationDelay: `${index * 150}ms` }}>
                {/* Step circle badge */}
                <div className={`hidden lg:flex absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl items-center justify-center z-10 shadow-ios-lg`}>
                  <span className="text-white font-bold text-xl">{step.step}</span>
                </div>

                {/* Arrow connector (except last card) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-0 -right-3 z-0">
                    <ArrowRight className="w-6 h-6 text-muted-foreground/30" />
                  </div>
                )}

                <div className="glass rounded-2xl p-6 shadow-ios hover-lift border border-border/50 lg:mt-10 h-full">
                  {/* Mobile step indicator */}
                  <div className={`lg:hidden w-12 h-12 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center mb-4 shadow-ios`}>
                    <span className="text-white font-bold">{step.step}</span>
                  </div>

                  {/* Icon */}
                  <div className={`w-14 h-14 bg-gradient-to-br ${step.color} opacity-10 rounded-xl flex items-center justify-center mb-4`}>
                    <step.icon className={`w-7 h-7 bg-gradient-to-br ${step.color} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent' }} />
                  </div>

                  <h3 className="text-lg font-bold text-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
