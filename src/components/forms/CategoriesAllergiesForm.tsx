"use client"

import { FieldErrors, Control, Controller } from 'react-hook-form'
import { CreateRecipeFormData } from '@/lib/validations/recipe-zod'
import { useEffect, useState } from 'react'
import { Label } from '../ui/label'
import { Alert, AlertDescription } from '../ui/alert'
import { MultiSelect, SelectableItem } from '../ui/multi-select'

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
          throw new Error('Dohvaćanje kategorija nije uspjelo')
        }
        const data = await response.json()
        setCategories(data)
      } catch (err) {
        console.error('Greška pri dohvaćanju kategorija:', err)
        setCategoriesError(err instanceof Error ? err.message : 'Dogodila se greška')
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
          throw new Error('Dohvaćanje alergena nije uspjelo')
        }
        const data = await response.json()
        setAllergies(data)
      } catch (err) {
        console.error('Greška pri dohvaćanju alergena:', err)
        setAllergiesError(err instanceof Error ? err.message : 'Dogodila se greška')
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
        <div className="flex items-center justify-between">
          <Label htmlFor="categories">Kategorije</Label>
          {errors.categories && (
            <p className="text-red-500 text-sm">
              Potrebna je barem jedna kategorija
            </p>
          )}
        </div>
        
        <Controller
          name="categories"
          control={control}
          render={({ field }) => (
            <MultiSelect
              items={categories}
              selectedIds={field.value || []}
              onChange={field.onChange}
              isLoading={isCategoriesLoading}
              label="Kategorija"
              placeholder="Odaberite kategorije"
              searchPlaceholder="Pretraži kategorije..."
              emptyMessage="Nema pronađenih kategorija."
              badgeVariant="outline"
            />
          )}
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="allergies">Alergeni (neobavezno)</Label>
          {errors.allergies && !Array.isArray(errors.allergies) && (
            <p className="text-red-500 text-sm">{errors.allergies.message}</p>
          )}
        </div>
        
        <Controller
          name="allergies"
          control={control}
          render={({ field }) => (
            <MultiSelect
              items={allergies}
              selectedIds={field.value || []}
              onChange={field.onChange}
              isLoading={isAllergiesLoading}
              label="Alergena"
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