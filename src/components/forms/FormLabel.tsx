"use client"

import { Label } from "../ui/label"
import { cn } from "@/lib/utils"

interface FormLabelProps {
  htmlFor: string
  children: React.ReactNode
  required?: boolean
  className?: string
}

// Custom form label component that adds a required indicator in Croatian
export function FormLabel({ htmlFor, children, required, className }: FormLabelProps) {
  return (
    <div className="flex items-center justify-between">
      <Label htmlFor={htmlFor} className={cn(className)}>
        {children}
        {required && (
          <span className="ml-1 text-red-500 text-sm" aria-hidden="true">
            *
          </span>
        )}
      </Label>
      {required && (
        <span className="text-red-500 text-sm">Obavezno</span>
      )}
    </div>
  )
}
