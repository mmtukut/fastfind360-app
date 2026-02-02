"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, CheckCircle, Mail } from "lucide-react"

const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River", "Delta",
  "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi",
  "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto",
  "Taraba", "Yobe", "Zamfara",
]

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <section id="contact" className="py-20 md:py-32 bg-gradient-to-br from-primary/5 via-background to-secondary/5 scroll-mt-16">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-accent/20 to-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
            <CheckCircle className="w-10 h-10 text-accent" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Thank You for Your Interest!</h2>
          <p className="text-muted-foreground leading-relaxed">
            Our team will contact you within 24 hours to schedule a demo and discuss how FastFind360 can help your state
            recover lost revenue.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" className="py-20 md:py-32 bg-gradient-to-br from-primary/5 via-background to-secondary/5 scroll-mt-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 mb-4">
            <Mail className="w-4 h-4 text-secondary" />
            <span className="text-sm font-semibold text-secondary">Contact Us</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Request a{" "}
            <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
              Demo
            </span>
          </h2>
          <p className="mt-4 text-muted-foreground">See FastFind360 in action with your state's data.</p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 shadow-ios-lg border border-border/50 space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground font-semibold">Full Name</Label>
              <Input
                id="name"
                placeholder="Dr. John Doe"
                required
                className="glass border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-semibold">Official Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@state.gov.ng"
                required
                className="glass border-border/50"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="agency" className="text-foreground font-semibold">Agency/Department</Label>
              <Input
                id="agency"
                placeholder="e.g., Board of Internal Revenue"
                required
                className="glass border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state" className="text-foreground font-semibold">State</Label>
              <Select required>
                <SelectTrigger className="glass border-border/50">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {nigerianStates.map((state) => (
                    <SelectItem key={state} value={state.toLowerCase()}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-foreground font-semibold">Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Tell us about your property revenue challenges..."
              rows={4}
              className="glass border-border/50"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-secondary to-accent hover:opacity-90 text-white font-semibold shadow-ios py-6 text-base"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              "Sending..."
            ) : (
              <>
                Request Demo
                <Send className="ml-2 w-4 h-4" />
              </>
            )}
          </Button>
        </form>
      </div>
    </section>
  )
}
