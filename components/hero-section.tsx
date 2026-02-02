"use client"

import { Button } from "@/components/ui/button"
import { AnimatedCounter } from "./animated-counter"
import { ArrowDown, Building2, Target, TrendingUp, Zap } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-16 overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-secondary">
      {/* Premium background with satellite imagery effect */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-[url('/satellite-view-african-city-buildings-aerial.jpg')] bg-cover bg-center opacity-15"
          style={{ mixBlendMode: 'overlay' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-transparent to-primary/90" />
      </div>

      {/* Animated grid pattern - iOS style */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in space-y-6">
          {/* Premium badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/20 shadow-ios mb-4">
            <Zap className="w-4 h-4 text-yellow-300" />
            <span className="text-sm font-medium text-white">AI-Powered Property Intelligence</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
            Making the Invisible,{" "}
            <span className="bg-gradient-to-r from-yellow-300 via-green-300 to-emerald-300 bg-clip-text text-transparent">
              Visible
            </span>
          </h1>

          <p className="mt-6 text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed font-medium">
            Transform property tax revenue with satellite imagery and AI.{" "}
            <span className="text-white font-semibold">Detect unregistered properties in hours,</span>{" "}
            not months.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#contact">
              <Button
                size="lg"
                className="bg-white hover:bg-white/90 text-primary px-8 py-6 text-lg font-semibold shadow-ios-lg hover-lift rounded-xl"
              >
                Request Demo
                <TrendingUp className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button
                size="lg"
                variant="outline"
                className="glass border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold rounded-xl shadow-ios"
              >
                See How It Works
                <ArrowDown className="ml-2 w-5 h-5 animate-bounce" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Premium Stats Bar - iOS style cards */}
      <div className="relative z-10 mt-16 md:mt-24 mb-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="glass rounded-2xl shadow-ios-lg p-6 md:p-10 border border-white/20">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {/* Pilot Results Card */}
              <div className="text-center group hover-lift">
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-ios">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground bg-gradient-to-br from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  <AnimatedCounter end={12450} />+
                </div>
                <div className="text-sm font-medium text-muted-foreground mt-2">Properties Detected</div>
                <div className="text-xs text-muted-foreground/70 mt-1">Pilot Phase</div>
              </div>

              {/* Revenue Potential Card */}
              <div className="text-center group hover-lift">
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-ios">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground bg-gradient-to-br from-green-600 to-emerald-800 bg-clip-text text-transparent">
                  <AnimatedCounter end={85} prefix="₦" suffix="M+" />
                </div>
                <div className="text-sm font-medium text-muted-foreground mt-2">Revenue Potential</div>
                <div className="text-xs text-muted-foreground/70 mt-1">Annualized Est.</div>
              </div>

              {/* Accuracy Card */}
              <div className="text-center group hover-lift">
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-ios">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground bg-gradient-to-br from-purple-600 to-purple-800 bg-clip-text text-transparent">
                  <AnimatedCounter end={92} suffix="%" />
                </div>
                <div className="text-sm font-medium text-muted-foreground mt-2">AI Accuracy</div>
                <div className="text-xs text-muted-foreground/70 mt-1">Classification Rate</div>
              </div>

              {/* Detection Time Card */}
              <div className="text-center group hover-lift">
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-ios">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground bg-gradient-to-br from-orange-600 to-orange-800 bg-clip-text text-transparent">
                  <AnimatedCounter end={48} suffix=" hrs" />
                </div>
                <div className="text-sm font-medium text-muted-foreground mt-2">Detection Time</div>
                <div className="text-xs text-muted-foreground/70 mt-1">vs 4-6 months manual</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator - subtle iOS style */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-white/60 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  )
}
