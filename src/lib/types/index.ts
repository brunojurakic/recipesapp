export * from "./database"

export type { ComponentProps } from "react"

export type FormState = {
  isLoading: boolean
  error?: string
  success?: string
}

export type SelectOption = {
  value: string
  label: string
}

export type ClassNameProps = {
  className?: string
}

export type ChildrenProps = {
  children: React.ReactNode
}

export type NavItem = {
  title: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  description?: string
}

export type AuthState = {
  isAuthenticated: boolean
  user: import("./database").User | null
  isLoading: boolean
}

export interface RecipeEditData {
  id: string
  title: string
  description: string
  servings: number
  preparationTime: number
  image_path: string
  difficultyId?: string
  isVegan: boolean
  isVegetarian: boolean
  categories: { category: { id: string; name: string } }[]
  allergies: { allergy: { id: string; name: string } }[]
  instructions: { stepNumber: number; content: string }[]
  ingredients: { name: string; quantity: number; unitId: string }[]
}
