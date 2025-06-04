"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface FormProgressTrackerProps {
  currentStep: number
  totalSteps: number
  steps: string[]
}

export function FormProgressTracker({
  currentStep,
  totalSteps,
  steps,
}: FormProgressTrackerProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep - 1
          const isCurrent = index === currentStep - 1
          const isLast = index === totalSteps - 1

          return (
            <div
              key={index}
              className="flex flex-col items-center flex-1 relative"
            >
              {!isLast && (
                <div
                  className={cn(
                    "absolute w-full h-[2px] top-[15px] left-1/2 -z-10",
                    isCompleted ? "bg-primary" : "bg-muted",
                  )}
                />
              )}

              <div
                className={cn(
                  "w-8 h-8 rounded-full border-2 flex items-center justify-center mb-2 transition-all duration-300",
                  isCompleted &&
                    "bg-primary border-primary text-primary-foreground",
                  isCurrent &&
                    "border-primary bg-background text-primary ring-2 ring-primary/20 ring-offset-1",
                  !isCompleted &&
                    !isCurrent &&
                    "border-muted bg-background text-muted-foreground",
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>

              <span
                className={cn(
                  "text-xs font-medium text-center hidden sm:block",
                  isCurrent && "text-primary font-semibold",
                  isCompleted && "text-primary",
                  !isCompleted && !isCurrent && "text-muted-foreground",
                )}
              >
                {step}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
