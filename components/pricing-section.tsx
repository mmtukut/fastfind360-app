"use client"

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
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
  },
]

export function PricingSection() {
  return (
    <section className="py-20 md:py-32 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Ready to Unlock Your State's Revenue Potential?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your needs. No hidden fees, full transparency.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-2xl p-8 ${
                plan.highlighted
                  ? "bg-primary text-primary-foreground border-2 border-secondary shadow-xl scale-105"
                  : "bg-card border border-border"
              }`}
            >
              <div className="text-sm font-medium mb-2 opacity-70">{plan.name}</div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-sm opacity-70">{plan.setup}</span>
              </div>
              <div
                className={`text-sm mb-4 ${plan.highlighted ? "text-primary-foreground/70" : "text-muted-foreground"}`}
              >
                + {plan.monthly}
              </div>
              <p
                className={`text-sm mb-6 ${plan.highlighted ? "text-primary-foreground/80" : "text-muted-foreground"}`}
              >
                {plan.description}
              </p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <Check className={`w-5 h-5 ${plan.highlighted ? "text-secondary" : "text-accent"}`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="#contact">
                <Button
                  className={`w-full ${
                    plan.highlighted
                      ? "bg-secondary hover:bg-secondary/90 text-secondary-foreground"
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
