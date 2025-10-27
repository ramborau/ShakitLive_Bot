import * as React from "react"
import { Input } from "./input"
import { cn } from "@/lib/utils"

export interface PhoneInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="flex gap-2">
        <div className="flex items-center justify-center bg-muted px-3 rounded-md border border-input text-sm font-medium min-w-[60px]">
          +63
        </div>
        <Input
          type="tel"
          className={cn("flex-1", className)}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
PhoneInput.displayName = "PhoneInput"

export { PhoneInput }
