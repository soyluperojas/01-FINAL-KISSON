
import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-white/30 border-2 border-white",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-black transition-all duration-700 ease-out relative rounded-full"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    >
      {/* Enhanced glowing effect that pulses with white */}
      <div className="absolute inset-0 bg-black/90 animate-pulse rounded-full"></div>
      <div className="absolute top-0 right-0 h-full w-8 bg-gradient-to-r from-transparent to-black/60 animate-pulse rounded-full"></div>
      {/* White glow overlay */}
      <div className="absolute inset-0 shadow-[0_0_10px_2px] shadow-white/50 animate-pulse rounded-full"></div>
    </ProgressPrimitive.Indicator>
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
