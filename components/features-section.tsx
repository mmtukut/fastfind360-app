"use client"

import { Satellite, Bot, BarChart3, Map, FileText, Shield, Sparkles } from "lucide-react"

const features = [
  {
    icon: Satellite,
    title: "Satellite-Powered",
    description: "Complete state coverage in 48 hours using high-resolution satellite imagery",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Bot,
    title: "AI Classification",
    description: "92%+ accuracy in detecting and classifying Residential, Commercial, and Industrial properties",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: BarChart3,
    title: "Revenue Dashboard",
    description: "Real-time insights to track revenue potential and ROI across your entire jurisdiction",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Map,
    title: "Interactive Maps",
    description: "Filter, search, and analyze properties spatially with powerful mapping tools",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: FileText,
    title: "Report Generator",
    description: "Generate professional PDF exports for stakeholders, commissioners, and the governor",
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    icon: Shield,
    title: "Government-Grade Security",
    description: "Secure, compliant, enterprise-grade hosting with role-based access control",
    gradient: "from-teal-500 to-cyan-500",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-32 bg-gradient-to-br from-primary via-primary/95 to-secondary scroll-mt-16 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark border border-white/20 mb-4">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-sm font-semibold text-white">Features</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-yellow-300 to-green-300 bg-clip-text text-transparent">
              Recover Lost Revenue
            </span>
          </h2>
          <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
            A complete platform built specifically for Nigerian government agencies.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-dark rounded-2xl p-6 border border-white/20 hover-lift shadow-ios-lg group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 shadow-ios group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-white/70 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
