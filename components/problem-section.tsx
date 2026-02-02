"use client"

import { Building, Banknote, BarChart3, Ban } from "lucide-react"

const problems = [
  {
    icon: Building,
    stat: "60%",
    title: "Unregistered Properties",
    description: "of properties in Nigeria are not in government records",
  },
  {
    icon: Banknote,
    stat: "₦2T",
    title: "Lost Revenue Annually",
    description: "governments lose trillions in property taxes every year",
  },
  {
    icon: BarChart3,
    stat: "Years",
    title: "Manual Surveys",
    description: "traditional surveys take years and are always outdated",
  },
  {
    icon: Ban,
    stat: "Hidden",
    title: "Illegal Construction",
    description: "unauthorized buildings go undetected for decades",
  },
]

export function ProblemSection() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-muted/20 via-background to-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/20 mb-4">
            <Ban className="w-4 h-4 text-destructive" />
            <span className="text-sm font-semibold text-destructive">The Challenge</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            The Hidden{" "}
            <span className="bg-gradient-to-r from-destructive to-orange-600 bg-clip-text text-transparent">
              Revenue Crisis
            </span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Across Nigeria, governments are losing billions because they simply do not know what properties exist.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="glass rounded-2xl p-6 shadow-ios hover-lift border border-border/50"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-destructive/20 to-orange-600/20 rounded-xl flex items-center justify-center mb-4 shadow-ios">
                <problem.icon className="w-7 h-7 text-destructive" />
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-destructive to-orange-600 bg-clip-text text-transparent mb-2">
                {problem.stat}
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{problem.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{problem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
