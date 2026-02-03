"use client"

import React from 'react'
import Link from 'next/link'
import { ArrowRight, ShieldCheck, Map, Database, FileText, Lock, Satellite, AlertTriangle, CheckCircle2, Zap } from 'lucide-react'

export default function HomePage() {
  const stats = [
    { value: "245,254", label: "Buildings Mapped", sublabel: "Gombe State Pilot" },
    { value: "₦100M+", label: "Revenue Identified", sublabel: "Recoverable Tax" },
    { value: "48 Hours", label: "Detection Time", sublabel: "vs 4-6 months manual" },
    { value: "NIGCOMSAT", label: "Federal Partnership", sublabel: "Satellite Provider" }
  ]

  const mechanism = [
    {
      icon: <Satellite className="w-6 h-6 text-blue-400" />,
      title: "Satellite Ingest",
      desc: "We pull fresh Sentinel-2 & high-resolution satellite imagery of your Local Government Areas (LGAs)."
    },
    {
      icon: <Map className="w-6 h-6 text-blue-400" />,
      title: "AI Detection",
      desc: "Our U-Net architecture (trained on Nigerian roof typologies) identifies every structure down to individual buildings."
    },
    {
      icon: <Database className="w-6 h-6 text-blue-400" />,
      title: "Cross-Reference",
      desc: "We overlay your existing Tax Identification Number (TIN) database to identify discrepancies and unregistered properties."
    },
    {
      icon: <FileText className="w-6 h-6 text-blue-400" />,
      title: "Revenue Recovery",
      desc: "We generate a comprehensive Revenue Leakage Report listing every property owing tax, ready for enforcement."
    }
  ]

  const pricing = [
    {
      name: "Pilot Audit",
      desc: "Single District Assessment",
      features: ["One LGA Coverage", "30-Day Turnaround", "PDF Revenue Report", "No Upfront Cost"],
      cta: "Start Pilot"
    },
    {
      name: "Statewide Recovery",
      desc: "Full State Revenue Intelligence",
      features: ["All LGAs Covered", "Quarterly Updates", "Live Dashboard Access", "Commission on Recovery"],
      cta: "Request Proposal",
      featured: true
    }
  ]

  return (
    <div className="min-h-screen bg-[#0A192F] text-slate-200 font-sans selection:bg-blue-500 selection:text-white">

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A192F]/80 backdrop-blur-md border-b border-slate-800">
        <div className="flex justify-between items-center px-6 lg:px-8 py-4 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-600 rounded-sm flex items-center justify-center shadow-lg shadow-blue-900/50">
              <div className="w-5 h-5 border-2 border-white rounded-full relative">
                <div className="absolute top-1/2 left-1/2 w-0.5 h-5 bg-white -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute top-1/2 left-1/2 w-5 h-0.5 bg-white -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">FastFind360</span>
          </Link>

          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
            <a href="#methodology" className="hover:text-white transition">Methodology</a>
            <a href="#pilot" className="hover:text-white transition">Gombe Pilot</a>
            <a href="#pricing" className="hover:text-white transition">Partnership Model</a>
          </div>

          <div className="flex gap-3">
            <Link href="/login">
              <button className="text-sm font-medium text-slate-300 hover:text-white transition px-4 py-2">
                Government Login
              </button>
            </Link>
            <a href="#contact">
              <button className="bg-white hover:bg-slate-100 text-[#0A192F] px-5 py-2 rounded-md text-sm font-bold transition shadow-lg">
                Request State Audit
              </button>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto text-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #3b82f6 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Live Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/30 border border-blue-800 text-blue-400 text-sm font-medium mb-8 relative">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Live in Gombe State: 245,254 Buildings Mapped
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
          Recover Uncollected <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-emerald-400">
            Property Tax From Space
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
          We use satellite AI to identify unregistered buildings and generate revenue audit reports
          for Nigerian State Governments. <span className="text-white font-semibold">No upfront cost.</span>
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
          <a href="#pilot">
            <button className="bg-white text-[#0A192F] px-8 py-4 rounded-lg font-bold text-lg hover:bg-slate-100 transition flex items-center justify-center gap-2 shadow-2xl">
              View Pilot Data <ArrowRight size={20} />
            </button>
          </a>
          <a href="#contact">
            <button className="border-2 border-slate-600 bg-slate-900/50 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-slate-800 hover:border-slate-500 transition">
              Schedule Demo
            </button>
          </a>
        </div>

        {/* Hero Visual - Revenue Alert Dashboard Mockup */}
        <div className="mt-12 relative rounded-xl border border-slate-700 bg-slate-900/80 p-3 shadow-2xl overflow-hidden group max-w-5xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-transparent to-transparent z-10 pointer-events-none"></div>

          <div className="aspect-[16/9] bg-slate-950 rounded-lg relative overflow-hidden">
            {/* Alert Card Overlay */}
            <div className="absolute top-6 left-6 bg-black/90 backdrop-blur border border-red-900/50 p-5 rounded-lg z-20 max-w-xs shadow-2xl">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <div className="text-xs text-red-400 uppercase tracking-wider font-bold">Revenue Leakage Alert</div>
              </div>
              <div className="text-3xl font-bold text-white font-mono mb-1">₦85,400,000</div>
              <div className="text-sm text-red-400 mt-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                2,300 Unregistered Properties Found
              </div>
              <div className="text-xs text-slate-500 mt-3">Gombe Metropolitan LGA</div>
            </div>

            {/* Map Grid Pattern */}
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: 'radial-gradient(circle, #ef4444 2px, transparent 2px)',
              backgroundSize: '30px 30px'
            }}></div>

            {/* Simulated Map Lines */}
            <svg className="absolute inset-0 w-full h-full opacity-30">
              <line x1="0" y1="30%" x2="100%" y2="35%" stroke="#3b82f6" strokeWidth="1" />
              <line x1="0" y1="60%" x2="100%" y2="58%" stroke="#3b82f6" strokeWidth="1" />
              <line x1="25%" y1="0" x2="28%" y2="100%" stroke="#3b82f6" strokeWidth="1" />
              <line x1="70%" y1="0" x2="68%" y2="100%" stroke="#3b82f6" strokeWidth="1" />
            </svg>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section id="pilot" className="border-y border-slate-800 bg-slate-950/50">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 divide-x divide-slate-800">
          {stats.map((stat, i) => (
            <div key={i} className="p-8 text-center hover:bg-slate-900/50 transition">
              <div className="text-3xl lg:text-4xl font-bold text-white mb-2 font-mono">{stat.value}</div>
              <div className="text-sm font-semibold text-slate-300 uppercase tracking-wide">{stat.label}</div>
              <div className="text-xs text-slate-500 mt-1">{stat.sublabel}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works - The Mechanism */}
      <section id="methodology" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="mb-16 max-w-3xl">
          <h2 className="text-4xl font-bold text-white mb-4">The New Standard for Revenue Intelligence</h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Traditional surveying takes months and costs millions. Our satellite-first approach delivers
            actionable tax rolls in <span className="text-white font-semibold">48 hours</span>.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mechanism.map((item, i) => (
            <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 rounded-xl hover:border-blue-900 hover:bg-slate-900 transition group">
              <div className="mb-6 p-3 bg-slate-800 w-fit rounded-lg group-hover:bg-blue-900/30 transition">
                {item.icon}
              </div>
              <div className="text-sm text-blue-400 font-bold mb-2 uppercase tracking-wider">Step {i + 1}</div>
              <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Global Validation - France Case Study */}
      <section className="py-20 px-6 bg-slate-950/50 border-y border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-3 py-1 bg-emerald-900/30 border border-emerald-800 text-emerald-400 text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                Global Precedent
              </div>
              <h2 className="text-4xl font-bold text-white mb-6">Proven at Scale: The France Case Study</h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-6">
                France used satellite AI to identify <span className="text-white font-bold">20,000 undeclared swimming pools</span>,
                recovering <span className="text-white font-bold">€10 million</span> in unpaid property tax in just one year.
              </p>
              <p className="text-slate-400 leading-relaxed">
                If satellite technology can find luxury pools in Europe, imagine what it can recover from
                entirely unregistered buildings across Nigeria's 36 States.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
                  <div>
                    <div className="text-white font-semibold mb-1">20,000 Properties Identified</div>
                    <div className="text-slate-400 text-sm">Undeclared swimming pools detected via satellite imagery</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
                  <div>
                    <div className="text-white font-semibold mb-1">€10 Million Recovered</div>
                    <div className="text-slate-400 text-sm">In the first year of deployment alone</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
                  <div>
                    <div className="text-white font-semibold mb-1">Nationwide Rollout</div>
                    <div className="text-slate-400 text-sm">Now being expanded across all French municipalities</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Model - No Risk Partnership */}
      <section id="pricing" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">We Don't Sell Software. We Partner on Recovery.</h2>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto leading-relaxed">
            Stop paying millions for surveys that yield no results. FastFind360 operates on a commission basis.
            <span className="text-white font-semibold"> We only get paid when you recover revenue.</span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {pricing.map((plan, i) => (
            <div key={i} className={`border rounded-xl p-8 ${plan.featured
                ? 'border-blue-600 bg-blue-950/20 shadow-2xl shadow-blue-900/20'
                : 'border-slate-800 bg-slate-900/50'
              }`}>
              {plan.featured && (
                <div className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                  Recommended
                </div>
              )}
              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-slate-400 mb-6">{plan.desc}</p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <a href="#contact">
                <button className={`w-full py-3 rounded-lg font-bold transition ${plan.featured
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg'
                    : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}>
                  {plan.cta}
                </button>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 bg-slate-950/50 border-y border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Recover Lost Revenue?</h2>
          <p className="text-slate-300 text-lg mb-10">
            Schedule a confidential briefing with our Revenue Intelligence team.
          </p>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 max-w-2xl mx-auto">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-left">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Commissioner John Doe"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  />
                </div>

                <div className="text-left">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Official Email
                  </label>
                  <input
                    type="email"
                    placeholder="name@state.gov.ng"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  />
                </div>
              </div>

              <div className="text-left">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  State / Ministry
                </label>
                <input
                  type="text"
                  placeholder="e.g., Gombe State Board of Internal Revenue"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>

              <div className="text-left">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell us about your revenue collection challenges..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-lg transition shadow-lg"
              >
                Request State Audit
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 px-6 bg-[#0A192F]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white rounded-full relative">
                  <div className="absolute top-1/2 left-1/2 w-0.5 h-4 bg-white -translate-x-1/2 -translate-y-1/2" />
                  <div className="absolute top-1/2 left-1/2 w-4 h-0.5 bg-white -translate-x-1/2 -translate-y-1/2" />
                </div>
              </div>
              <span className="font-bold text-lg text-white">FastFind360</span>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-slate-400 text-sm">
              <a href="#methodology" className="hover:text-white transition">Methodology</a>
              <a href="#pilot" className="hover:text-white transition">Gombe Pilot</a>
              <a href="#pricing" className="hover:text-white transition">Partnership Model</a>
              <Link href="/login" className="hover:text-white transition">Government Login</Link>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-slate-500 text-sm">
              © 2026 Zippatek Digital Ltd. RC 8527315. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-slate-400 text-sm">
              <span className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-blue-400" />
                NDPR Compliant
              </span>
              <span className="flex items-center gap-2">
                <Lock size={16} className="text-blue-400" />
                Government-Grade Security
              </span>
              <span className="flex items-center gap-2">
                Built in Nigeria 🇳🇬
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
