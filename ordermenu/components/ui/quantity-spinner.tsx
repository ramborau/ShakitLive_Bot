import * as React from "react"
import { Button } from "./button"
import { Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuantitySpinnerProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  className?: string
}

export function QuantitySpinner({
  value,
  onChange,
  min = 1,
  max = 99,
  className
}: QuantitySpinnerProps) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1)
    }
  }

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1)
    }
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={handleDecrement}
        disabled={value <= min}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <div className="w-12 text-center font-semibold text-lg">
        {value}
      </div>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={handleIncrement}
        disabled={value >= max}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}
