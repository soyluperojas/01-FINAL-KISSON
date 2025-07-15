
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border-2 border-white bg-black text-white px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-white/60 focus-visible:outline-none focus-visible:bg-gray-800 focus-visible:shadow-[0_0_15px_rgba(255,255,255,0.6)] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-all duration-300 hover:bg-gray-800 hover:shadow-[0_0_10px_rgba(255,255,255,0.4)]",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
