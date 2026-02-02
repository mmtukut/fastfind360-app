import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
  backdrop?: boolean
}

export function LoadingSpinner({ size = "md", className, backdrop = false }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  }

  const spinner = (
    <Loader2
      className={cn(
        "animate-spin text-primary",
        sizeClasses[size],
        className
      )}
    />
  )

  if (backdrop) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center gap-3 bg-card/90 px-8 py-6 rounded-2xl shadow-ios-lg">
          {spinner}
          <p className="text-sm text-foreground font-medium">Loading satellite imagery...</p>
        </div>
      </div>
    )
  }

  return spinner
}
