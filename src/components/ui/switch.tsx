
import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> & {
    size?: "default" | "sm" | "lg";
    variant?: "blue" | "red";
  }
>(({ className, size = "default", variant = "blue", ...props }, ref) => {
  const sizeClasses = {
    default: "h-5 w-10",
    sm: "h-4 w-7",
    lg: "h-6 w-12"
  }

  const thumbSizeClasses = {
    default: "h-4 w-4 data-[state=checked]:translate-x-5",
    sm: "h-3 w-3 data-[state=checked]:translate-x-3.5",
    lg: "h-5 w-5 data-[state=checked]:translate-x-6"
  }
  
  const variantClasses = {
    blue: "data-[state=checked]:bg-blue-600",
    red: "data-[state=checked]:bg-red-500"
  }

  return (
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=unchecked]:bg-input",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=unchecked]:translate-x-0",
          thumbSizeClasses[size]
        )}
      />
    </SwitchPrimitives.Root>
  )
})
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
