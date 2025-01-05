import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12"
}

export function LoadingSpinner({ size = "md", className, ...props }: SpinnerProps) {
  return (
    <div {...props}>
      <Loader2 
        className={cn(
          "animate-spin text-muted-foreground",
          sizeClasses[size],
          className
        )}
      />
      <span className="sr-only">Loading...</span>
    </div>
  )
}
