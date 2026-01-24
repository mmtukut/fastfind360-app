"use client"

import { Button } from "@/components/ui/button"
import { AnimatedCounter } from "./animated-counter"
import { ArrowDown, Building2, Banknote, Home, Clock } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-16 overflow-hidden">
      {/* Background with satellite imagery effect */}
      <div className="absolute inset-0 bg-primary">
        <div className="absolute inset-0 bg-[url('/satellite-view-african-city-buildings-aerial.jpg')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/70 to-primary" />
      </div>

      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight text-balance">
            Making the Invisible, <span className="text-secondary">Visible</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-primary-foreground/80 max-w-3xl mx-auto text-pretty">
            Discover unregistered properties and unlock billions in lost revenue with satellite imagery and AI. Built
            for Nigerian state governments.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#contact">
              <Button
                size="lg"
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-6 text-lg"
              >
                Request Demo
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 px-8 py-6 text-lg bg-transparent"
              >
                See How It Works
                <ArrowDown className="ml-2 w-5 h-5 animate-bounce" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="relative z-10 mt-16 md:mt-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-card rounded-xl shadow-2xl p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Building2 className="w-8 h-8 text-secondary" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-foreground">
                <AnimatedCounter end={245254} />
              </div>
              <div className="text-sm text-muted-foreground mt-1">Buildings Detected</div>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Banknote className="w-8 h-8 text-accent" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-foreground">
                <AnimatedCounter end={500} prefix="₦" suffix="B+" />
              </div>
              <div className="text-sm text-muted-foreground mt-1">Revenue Potential</div>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Home className="w-8 h-8 text-secondary" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-foreground">
                <AnimatedCounter end={88} suffix="%" />
              </div>
              <div className="text-sm text-muted-foreground mt-1">Residential Properties</div>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Clock className="w-8 h-8 text-accent" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-foreground">
                <AnimatedCounter end={48} suffix=" hrs" />
              </div>
              <div className="text-sm text-muted-foreground mt-1">Detection Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowDown className="w-6 h-6 text-primary-foreground/50" />
      </div>
    </section>
  )
}
