"use client"

import { Satellite, Bot, BarChart3, Map, FileText, Shield } from "lucide-react"

const features = [
  {
    icon: Satellite,
    title: "Satellite-Powered",
    description: "Complete state coverage in 48 hours using high-resolution satellite imagery",
  },
  {
    icon: Bot,
    title: "AI Classification",
    description: "99.998% accuracy in detecting and classifying Residential, Commercial, and Industrial properties",
  },
  {
    icon: BarChart3,
    title: "Revenue Dashboard",
    description: "Real-time insights to track revenue potential and ROI across your entire jurisdiction",
  },
  {
    icon: Map,
    title: "Interactive Maps",
    description: "Filter, search, and analyze properties spatially with our powerful mapping tools",
  },
  {
    icon: FileText,
    title: "Report Generator",
    description: "Generate professional PDF exports for stakeholders, commissioners, and the governor",
  },
  {
    icon: Shield,
    title: "Government-Grade Security",
    description: "Secure, compliant, enterprise-grade hosting with role-based access control",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-32 bg-primary scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
            Everything You Need to Recover Lost Revenue
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/70 max-w-2xl mx-auto">
            A complete platform built specifically for Nigerian government agencies.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-6 border border-primary-foreground/20 hover:bg-primary-foreground/15 transition-colors"
            >
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-secondary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-primary-foreground mb-2">{feature.title}</h3>
              <p className="text-primary-foreground/70 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
