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
    <section className="py-20 md:py-32 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">The Hidden Revenue Crisis</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Across Nigeria, governments are losing billions because they simply do not know what properties exist.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center mb-4">
                <problem.icon className="w-6 h-6 text-destructive" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">{problem.stat}</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{problem.title}</h3>
              <p className="text-muted-foreground text-sm">{problem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
