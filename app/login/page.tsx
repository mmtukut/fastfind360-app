import type { Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Login | FastFind360",
  description: "Government portal login for FastFind360 Property Intelligence Platform",
}

export default function LoginPage() {
  return <LoginForm />
}
