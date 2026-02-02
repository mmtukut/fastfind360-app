"use client"

import { Quote, TrendingUp, Building2, ArrowRight, CheckCircle2 } from "lucide-react"

export function CaseStudySection() {
  return (
    <section id="case-study" className="py-20 md:py-32 bg-gradient-to-br from-background via-muted/20 to-background scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-4">
            <TrendingUp className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold text-accent">Pilot Program Results</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Early Success in{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Gombe State
            </span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Pilot deployment demonstrates the power of AI-driven property detection
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Quote Card - Premium iOS style */}
          <div className="glass rounded-3xl p-8 md:p-10 relative shadow-ios-lg hover-lift border border-border/50">
            <div className="absolute top-6 left-8 w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center">
              <Quote className="w-8 h-8 text-primary/40" />
            </div>
            <div className="relative z-10 mt-12">
              <p className="text-lg md:text-xl text-foreground leading-relaxed font-medium italic">
                "Our pilot with FastFind360 detected over <span className="font-bold text-primary">3,500 commercial properties</span> that were not in our existing database.
                This represents significant untapped revenue potential for the state."
              </p>
              <div className="flex items-center gap-4 mt-8 pt-6 border-t border-border/50">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-ios">
                  <span className="text-primary-foreground font-bold text-xl">GS</span>
                </div>
                <div>
                  <div className="font-semibold text-foreground text-lg">Gombe State Revenue Board</div>
                  <div className="text-sm text-muted-foreground">Pilot Program - Q4 2025</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Comparison - Modern cards */}
          <div className="space-y-6">
            {/* Before Card */}
            <div className="bg-card rounded-2xl p-6 border border-border shadow-ios hover-lift">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Before FastFind360</div>
                  <div className="text-xs text-muted-foreground/70">Manual Survey Methods</div>
                </div>
              </div>
              <div className="text-4xl font-bold text-foreground mb-2">~8,200</div>
              <div className="text-sm text-muted-foreground mb-4">Commercial Properties on Record</div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-muted-foreground/40 to-muted-foreground/30 rounded-full transition-all"
                  style={{ width: "40%" }}
                />
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="w-3 h-3" />
                <span>Limited coverage in urban areas</span>
              </div>
            </div>

            {/* After Card - Premium highlight */}
            <div className="glass rounded-2xl p-6 border-2 border-accent/30 shadow-ios-lg relative overflow-hidden hover-lift">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/20 to-transparent rounded-bl-3xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-accent">After FastFind360 Pilot</div>
                    <div className="text-xs text-muted-foreground">AI-Powered Detection</div>
                  </div>
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-accent to-green-600 bg-clip-text text-transparent mb-2">
                  12,450+
                </div>
                <div className="text-sm text-muted-foreground mb-4">Properties Detected (Pilot Area)</div>
                <div className="h-3 bg-accent/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-accent to-green-500 rounded-full animate-pulse" style={{ width: "100%" }} />
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs font-medium text-accent">
                  <TrendingUp className="w-3 h-3" />
                  <span>52% increase in property identification</span>
                </div>
              </div>
            </div>

            {/* Key Achievement Card */}
            <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-2xl p-6 border border-primary/10 shadow-ios">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-2">Time to Detection</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      48
                    </span>
                    <span className="text-xl font-semibold text-muted-foreground">hours</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">vs 4-6+ months traditional survey</div>
                </div>
                <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center">
                  <ArrowRight className="w-10 h-10 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
