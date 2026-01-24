"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth"
import { Loader2, AlertCircle, Eye, EyeOff, Satellite } from "lucide-react"
import Link from "next/link"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const result = await login(email, password)

    if (result.success) {
      router.push("/dashboard")
    } else {
      setError(result.error || "Login failed")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/satellite-view-african-city-buildings-aerial.jpg')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/70" />

        <div className="relative z-10 flex flex-col justify-center px-12">
          <Link href="/" className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
              <Satellite className="w-7 h-7 text-secondary-foreground" />
            </div>
            <span className="font-bold text-2xl text-primary-foreground">FastFind360</span>
          </Link>

          <h1 className="text-4xl font-bold text-primary-foreground mb-4">Government Property Intelligence</h1>
          <p className="text-xl text-primary-foreground/80 mb-8">
            Access your state's comprehensive property detection and revenue intelligence dashboard.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center">
                <span className="text-secondary font-bold text-sm">1</span>
              </div>
              <span className="text-primary-foreground/80">245,254 buildings detected in Gombe State</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center">
                <span className="text-secondary font-bold text-sm">2</span>
              </div>
              <span className="text-primary-foreground/80">99.998% classification accuracy</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center">
                <span className="text-secondary font-bold text-sm">3</span>
              </div>
              <span className="text-primary-foreground/80">500B+ revenue potential identified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Satellite className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground">FastFind360</span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">Government Portal Login</h2>
            <p className="text-muted-foreground mt-2">Sign in with your official government email</p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Official Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@gombestate.gov.ng"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">Only @gov.ng and official agency emails are allowed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="mt-8 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium text-foreground mb-2">Demo Credentials</p>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Email: admin@gombegis.org</p>
              <p>Password: demo123</p>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link href="/#contact" className="text-secondary hover:underline">
              Request access
            </Link>
          </p>

          <p className="text-center text-xs text-muted-foreground mt-4">
            <Link href="/" className="hover:underline">
              Return to homepage
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
