"use client"

import { FieldErrors, Control, Controller } from 'react-hook-form'
import { CreateRecipeFormData } from '@/lib/validations/recipe-zod'
import { useEffect, useState } from 'react'
import { Label } from '../ui/label'
import { Alert, AlertDescription } from '../ui/alert'
import { MultiSelect, SelectableItem } from '../ui/multi-select'
import { FormLabel } from './FormLabel'

interface CategoriesAllergiesFormProps {
  control: Control<CreateRecipeFormData>
  errors: FieldErrors<CreateRecipeFormData>
}

const CategoriesAllergiesForm = ({
  control,
  errors
}: CategoriesAllergiesFormProps) => {

  const [categories, setCategories] = useState<SelectableItem[]>([])
  const [allergies, setAllergies] = useState<SelectableItem[]>([])
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true)
  const [isAllergiesLoading, setIsAllergiesLoading] = useState(true)
  const [categoriesError, setCategoriesError] = useState<string | null>(null)
  const [allergiesError, setAllergiesError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsCategoriesLoading(true)
        const response = await fetch('/api/categories')
        if (!response.ok) {
          throw new Error('Učitavanje kategorija nije uspjelo')
        }
        const data = await response.json()
        setCategories(data)
      } catch (err) {
        console.error('Error fetching categories:', err)
        setCategoriesError(err instanceof Error ? err.message : 'Došlo je do pogreške')
      } finally {
        setIsCategoriesLoading(false)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchAllergies = async () => {
      try {
        setIsAllergiesLoading(true)
        const response = await fetch('/api/allergies')
        if (!response.ok) {
          throw new Error('Učitavanje alergena nije uspjelo')
        }
        const data = await response.json()
        setAllergies(data)
      } catch (err) {
        console.error('Error fetching allergies:', err)
        setAllergiesError(err instanceof Error ? err.message : 'Došlo je do pogreške')
      } finally {
        setIsAllergiesLoading(false)
      }
    }

    fetchAllergies()
  }, [])

  return (
    <div className="space-y-6 mb-10">
      <h2 className="text-xl font-semibold">Kategorije i alergeni</h2>
      
      <div className="space-y-2">
        <FormLabel htmlFor="categories" required>Kategorije</FormLabel>
        {errors.categories && !Array.isArray(errors.categories) && (
          <p className="text-red-500 text-sm">{errors.categories.message}</p>
        )}
        
        <Controller
          name="categories"
          control={control}
          render={({ field }) => (
            <MultiSelect
              items={categories}
              selectedIds={field.value || []}
              onChange={field.onChange}
              isLoading={isCategoriesLoading}
              label="Kategorije"
              placeholder="Odaberite kategorije"
              searchPlaceholder="Pretraži kategorije..."
              emptyMessage="Nema pronađenih kategorija."
              badgeVariant="outline"
            />
          )}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="allergies">Alergeni (neobavezno)</Label>
        {errors.allergies && !Array.isArray(errors.allergies) && (
          <p className="text-red-500 text-sm">{errors.allergies.message}</p>
        )}
        
        <Controller
          name="allergies"
          control={control}
          render={({ field }) => (
            <MultiSelect
              items={allergies}
              selectedIds={field.value || []}
              onChange={field.onChange}
              isLoading={isAllergiesLoading}
              label="Alergeni"
              placeholder="Odaberite alergene"
              searchPlaceholder="Pretraži alergene..."
              emptyMessage="Nema pronađenih alergena."
              badgeVariant="outline"
            />
          )}
        />
      </div>

      {(categoriesError || allergiesError) && (
        <Alert variant="destructive">
          <AlertDescription>
            {categoriesError && <p>{categoriesError}</p>}
            {allergiesError && <p>{allergiesError}</p>}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

export default CategoriesAllergiesForm