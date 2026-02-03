"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Lock, Shield, AlertTriangle, ArrowLeft, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    if (email === 'admin@gombegis.org' && password === 'demo123') {
      router.push('/dashboard')
    } else {
      setError('Invalid official credentials. Access denied.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A192F] flex items-center justify-center p-4 relative overflow-hidden">

      {/* Background Grid Effect */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #1e3a8a 2px, transparent 0)',
          backgroundSize: '50px 50px'
        }}
      />

      {/* Animated Rotating Globe Wireframe Effect */}
      <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute inset-0 border border-blue-800 rounded-full"
              style={{
                transform: `rotate(${i * 15}deg) rotateY(60deg)`,
                animation: `spin ${20 + i * 2}s linear infinite`
              }}
            />
          ))}
        </div>
      </div>

      {/* Back to Home Link */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-white transition group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition" />
        <span className="text-sm font-medium">Back to Home</span>
      </Link>

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#0A192F] border-2 border-slate-800 rounded-xl shadow-2xl p-10 relative z-10">

        {/* Security Badge */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-900/40 to-blue-950/40 border-2 border-blue-700 text-blue-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/30">
              <Lock size={32} strokeWidth={2.5} />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-[#0A192F] rounded-full flex items-center justify-center">
              <Shield size={12} className="text-white" />
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">
            Government Portal
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Restricted access for authorized Revenue Board and Ministry officials only.
          </p>
        </div>

        {/* Security Alert */}
        <div className="mb-8 bg-blue-950/20 border border-blue-900/50 rounded-lg p-4 flex gap-3">
          <AlertTriangle size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-blue-300 leading-relaxed">
            This system is protected by multi-factor authentication. All access attempts are logged and monitored.
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-950/30 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
            <Shield size={16} />
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Official Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@revenue.state.gov.ng"
              className="w-full bg-slate-950 border-2 border-slate-800 rounded-lg px-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition font-medium"
              required
            />
            <p className="text-xs text-slate-500 mt-2">Use your official government email (.gov.ng domain)</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Secure Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••••••"
              className="w-full bg-slate-950 border-2 border-slate-800 rounded-lg px-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition font-medium"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-lg transition shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Verifying Credentials...
              </>
            ) : (
              <>
                <Lock size={18} className="group-hover:scale-110 transition" />
                Authenticate Access
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Hint */}
        <div className="mt-8 p-3 bg-slate-900/50 border border-slate-800 rounded text-center">
          <p className="text-xs text-slate-500 font-mono">
            <span className="text-slate-400">DEMO ACCESS:</span> admin@gombegis.org / demo123
          </p>
        </div>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-[#0A192F] px-3 text-slate-500 uppercase tracking-wider">
              First Time User?
            </span>
          </div>
        </div>

        {/* Request Access */}
        <a href="/#contact">
          <button
            type="button"
            className="w-full border-2 border-slate-700 bg-slate-900/50 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-600 font-semibold py-3.5 rounded-lg transition"
          >
            Request Government Access
          </button>
        </a>

        {/* Legal Footer */}
        <div className="mt-10 pt-8 border-t border-slate-800">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Shield size={16} className="text-slate-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-500 leading-relaxed">
                <span className="text-slate-400 font-semibold">Security Notice:</span> Unauthorized access is a punishable offense under the
                <span className="text-white"> Nigerian Cybercrimes Act 2024</span>.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <Lock size={16} className="text-slate-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-500 leading-relaxed">
                This system is monitored by <span className="text-white font-semibold">Zippatek Security</span>. All login attempts are recorded and audited.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Badge */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
        <div className="text-xs text-slate-600 uppercase tracking-wider">
          Powered by
        </div>
        <div className="text-sm text-slate-500 font-bold mt-1">
          FastFind<span className="text-blue-500">360</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg) rotateY(60deg);
          }
          to {
            transform: rotate(360deg) rotateY(60deg);
          }
        }
      `}</style>
    </div>
  )
}
