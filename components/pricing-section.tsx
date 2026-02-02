"use client"

import { Button } from "@/components/ui/button"
import { Check, Rocket, Star } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Pilot Program",
    price: "₦5M",
    setup: "Setup",
    monthly: "₦2M/month",
    description: "Perfect for proof of concept",
    features: [
      "Coverage: 1-2 LGAs",
      "30-day proof of concept",
      "Full training included",
      "Dedicated support",
      "Basic reports",
    ],
    highlighted: false,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    name: "Statewide Deployment",
    price: "Custom",
    setup: "Pricing",
    monthly: "Contact us",
    description: "Complete state coverage",
    features: [
      "Full state coverage",
      "Ongoing satellite updates",
      "API integration",
      "Priority support",
      "Advanced analytics",
      "Custom reports",
    ],
    highlighted: true,
    gradient: "from-green-500 to-emerald-500",
  },
]

export function PricingSection() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-muted/20 via-background to-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-4">
            <Star className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold text-accent">Pricing</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Ready to Unlock Your State's{" "}
            <span className="bg-gradient-to-r from-accent to-green-600 bg-clip-text text-transparent">
              Revenue Potential?
            </span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your needs. No hidden fees, full transparency.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-2xl p-8 relative overflow-hidden ${plan.highlighted
                  ? "glass border-2 border-accent shadow-ios-lg hover-lift scale-105"
                  : "glass border border-border/50 shadow-ios hover-lift"
                }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {plan.highlighted && (
                <div className="absolute top-4 right-4">
                  <div className={`bg-gradient-to-r ${plan.gradient} px-3 py-1 rounded-full text-xs font-bold text-white shadow-ios flex items-center gap-1`}>
                    <Rocket className="w-3 h-3" />
                    <span>Popular</span>
                  </div>
                </div>
              )}

              <div className="text-sm font-semibold text-muted-foreground mb-2">{plan.name}</div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className={`text-5xl font-bold ${plan.highlighted ? "bg-gradient-to-r from-accent to-green-600 bg-clip-text text-transparent" : "text-foreground"}`}>
                  {plan.price}
                </span>
                <span className="text-sm text-muted-foreground">{plan.setup}</span>
              </div>
              <div className="text-sm mb-6 text-muted-foreground">+ {plan.monthly}</div>
              <p className="text-sm mb-8 text-muted-foreground">{plan.description}</p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${plan.gradient} flex items-center justify-center flex-shrink-0`}>
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="#contact">
                <Button
                  className={`w-full font-semibold shadow-ios ${plan.highlighted
                      ? `bg-gradient-to-r ${plan.gradient} hover:opacity-90 text-white`
                      : "bg-primary hover:bg-primary/90 text-primary-foreground"
                    }`}
                >
                  Get Started
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
