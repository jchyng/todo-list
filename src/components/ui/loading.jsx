import * as React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const LoadingSpinner = React.forwardRef(({ className, size = "default", ...props }, ref) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-5 w-5", 
    lg: "h-6 w-6",
    xl: "h-8 w-8"
  }

  return (
    <Loader2
      ref={ref}
      className={cn("animate-spin", sizeClasses[size], className)}
      {...props}
    />
  )
})
LoadingSpinner.displayName = "LoadingSpinner"

const LoadingButton = React.forwardRef(({ 
  children,
  loading = false,
  loadingText,
  className,
  disabled,
  ...props 
}, ref) => {
  return (
    <button
      ref={ref}
      className={className}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" className="mr-2" />}
      {loading ? (loadingText || children) : children}
    </button>
  )
})
LoadingButton.displayName = "LoadingButton"

const LoadingOverlay = ({ loading, children, className, ...props }) => {
  return (
    <div className={cn("relative", className)} {...props}>
      {children}
      {loading && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center rounded-lg">
          <div className="flex items-center gap-2 bg-background/90 px-4 py-2 rounded-lg shadow-lg border">
            <LoadingSpinner size="sm" />
            <span className="text-sm text-muted-foreground">처리 중...</span>
          </div>
        </div>
      )}
    </div>
  )
}

export { LoadingSpinner, LoadingButton, LoadingOverlay }