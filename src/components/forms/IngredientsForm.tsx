"use client"

import { UseFormRegister, FieldErrors, Control, useWatch } from 'react-hook-form'
import { CreateRecipeFormData } from '@/lib/validations/recipe-zod'
import { FieldArrayWithId } from 'react-hook-form'
import { Plus, X } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { useEffect, useState } from 'react'
import { Label } from '../ui/label'

type Unit = {
  id: string;
  name: string;
  abbreviation: string;
  type: string;
}

interface IngredientsFormProps {
  register: UseFormRegister<CreateRecipeFormData>
  control: Control<CreateRecipeFormData>
  errors: FieldErrors<CreateRecipeFormData>
  ingredientFields: FieldArrayWithId<CreateRecipeFormData, 'ingredients', 'id'>[]
  appendIngredient: (value: { name: string; quantity: string; unitId: string }) => void
  removeIngredient: (index: number) => void
}

const IngredientsForm = ({
  register,
  errors,
  ingredientFields,
  appendIngredient,
  removeIngredient
}: IngredientsFormProps) => {
  const [units, setUnits] = useState<Unit[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/units')
        if (!response.ok) {
          throw new Error('Failed to fetch measurement units')
        }
        const data = await response.json()
        setUnits(data)
      } catch (err) {
        console.error('Error fetching units:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUnits()
  }, [])


  return (
    <div className="space-y-6 mb-10">
      <div className='flex justify-between items-center'>
        <h2 className="text-xl font-semibold">Ingredients</h2>
        <Button variant="outline" 
          onClick={() => appendIngredient({ name: '', quantity: '', unitId: '' })}
          disabled={isLoading}>
          <Plus className="mr-2 h-4 w-4" /> Add Ingredient
        </Button>
      </div>


      {ingredientFields.length === 0 && !isLoading && (
        <div className="text-center p-4 border border-dashed rounded-md border-gray-300">
          <p className="text-gray-500">No ingredients added yet. Click Add Ingredient to start.</p>
        </div>
      )}



      {ingredientFields.map((field, index) => (
        <div key={field.id} className="p-4 border rounded-md bg-gray-50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">Ingredient {index + 1}</h3>
            <Button variant="ghost" onClick={() => removeIngredient(index)} size={'icon'}>
              <X className="text-red-500" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`ingredients.${index}.name`}>Name</Label>
              <Input id={`ingredients.${index}.name`} {...register(`ingredients.${index}.name`)}
                placeholder="e.g. Flour"
              />
              {errors.ingredients?.[index]?.name && (
                <p className="text-red-500 text-sm">{errors.ingredients[index].name?.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`ingredients.${index}.quantity`}>Quantity</Label>
              <Input id={`ingredients.${index}.quantity`} {...register(`ingredients.${index}.quantity`)}
                placeholder="e.g. 200"
              />
              {errors.ingredients?.[index]?.quantity && (
                <p className="text-red-500 text-sm">{errors.ingredients[index].quantity?.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`ingredients.${index}.unitId`}>Unit</Label>
              <Select
                onValueChange={(value) => {
                  const event = {
                    target: {
                      name: `ingredients.${index}.unitId`,
                      value: value
                    }
                  } as React.ChangeEvent<HTMLSelectElement>;
                  register(`ingredients.${index}.unitId`).onChange(event);
                }}
                defaultValue={field.unitId}
                disabled={isLoading}
              >
                <SelectTrigger id={`ingredients.${index}.unitId`}>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.name} ({unit.abbreviation})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.ingredients?.[index]?.unitId && (
                <p className="text-red-500 text-sm">{errors.ingredients[index].unitId?.message}</p>
              )}
            </div>
          </div>
        </div>
      ))}

      {errors.ingredients && !Array.isArray(errors.ingredients) && (
        <p className="text-red-500">{errors.ingredients.message}</p>
      )}
    </div>
  )
}

export default IngredientsForm