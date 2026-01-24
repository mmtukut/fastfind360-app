"use client"

import { Quote, TrendingUp, Building2 } from "lucide-react"

export function CaseStudySection() {
  return (
    <section id="case-study" className="py-20 md:py-32 bg-background scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Proven Results in Gombe State</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Quote Card */}
          <div className="bg-muted rounded-2xl p-8 md:p-10 relative">
            <Quote className="w-12 h-12 text-secondary/20 absolute top-6 left-6" />
            <div className="relative z-10">
              <p className="text-lg md:text-xl text-foreground leading-relaxed mb-6 italic">
                "FastFind360 detected 28,375 commercial properties we did not have in our records. That is ₦1.5 billion
                in potential annual revenue."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">DK</span>
                </div>
                <div>
                  <div className="font-semibold text-foreground">Dr. Kabiru Usman Hassan</div>
                  <div className="text-sm text-muted-foreground">Director-General, Gombe GIS (GOGIS)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Comparison */}
          <div className="space-y-6">
            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="text-sm text-muted-foreground">Before FastFind360</div>
              </div>
              <div className="text-3xl font-bold text-foreground">5,000</div>
              <div className="text-sm text-muted-foreground">Properties in Tax Roll</div>
              <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-muted-foreground/30 rounded-full" style={{ width: "2%" }} />
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 border border-secondary/30 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-secondary" />
                </div>
                <div className="text-sm text-secondary">After FastFind360</div>
              </div>
              <div className="text-3xl font-bold text-foreground">245,254</div>
              <div className="text-sm text-muted-foreground">Properties Detected</div>
              <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-secondary rounded-full" style={{ width: "100%" }} />
              </div>
            </div>

            <div className="bg-accent/10 rounded-xl p-6 border border-accent/20">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-accent font-medium mb-1">Coverage Improvement</div>
                  <div className="text-4xl font-bold text-accent">4,805%</div>
                </div>
                <TrendingUp className="w-12 h-12 text-accent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
