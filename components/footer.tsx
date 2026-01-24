import Link from "next/link"
import { Satellite } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-primary py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                <Satellite className="w-5 h-5 text-secondary-foreground" />
              </div>
              <span className="font-bold text-xl text-primary-foreground">FastFind360</span>
            </Link>
            <p className="text-primary-foreground/70 text-sm max-w-sm">
              Making the invisible, visible. Transform how African governments discover, classify, and manage their
              building assets.
            </p>
            <div className="mt-4 text-sm text-primary-foreground/50">
              <div>Zippatek Digital Ltd</div>
              <div>RC: 8527315 | Abuja, Nigeria</div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-primary-foreground mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#how-it-works" className="text-primary-foreground/70 hover:text-primary-foreground">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#features" className="text-primary-foreground/70 hover:text-primary-foreground">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#case-study" className="text-primary-foreground/70 hover:text-primary-foreground">
                  Case Study
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-primary-foreground/70 hover:text-primary-foreground">
                  Government Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-primary-foreground mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-primary-foreground/70 hover:text-primary-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-primary-foreground/70 hover:text-primary-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="text-primary-foreground/70 hover:text-primary-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-primary-foreground/70 hover:text-primary-foreground">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10 text-center text-sm text-primary-foreground/50">
          <p>Powered by AI, Satellite Imagery & Nigerian Innovation</p>
          <p className="mt-2">&copy; {new Date().getFullYear()} FastFind360. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
