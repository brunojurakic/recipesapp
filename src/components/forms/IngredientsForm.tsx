import { UseFormRegister, FieldErrors, Control, Controller } from 'react-hook-form'
import { CreateRecipeFormData } from '@/lib/validations/recipe-zod'
import { FieldArrayWithId } from 'react-hook-form'
import { Plus } from 'lucide-react'
import Select from 'react-select'
import { useEffect, useState } from 'react'

interface Option {
  value: string
  label: string
}

interface IngredientsFormProps {
  register: UseFormRegister<CreateRecipeFormData>
  control: Control<CreateRecipeFormData>
  errors: FieldErrors<CreateRecipeFormData>
  ingredientFields: FieldArrayWithId<CreateRecipeFormData, 'ingredients', 'id'>[]
  appendIngredient: (value: { ingredientId: string; quantity: string; unitId: string }) => void
  removeIngredient: (index: number) => void
}

interface IngredientData {
  id: string
  name: string
}

interface UnitData {
  id: string
  name: string
}

const IngredientsForm = ({
  register,
  control,
  errors,
  ingredientFields,
  appendIngredient,
  removeIngredient
}: IngredientsFormProps) => {
  const [ingredients, setIngredients] = useState<Option[]>([])
  const [units, setUnits] = useState<Option[]>([])
  
  useEffect(() => {
    // Fetch ingredients
    fetch('/api/ingredients')
      .then(res => res.json())
      .then((data: IngredientData[]) => {
        setIngredients(data.map(item => ({
          value: item.id,
          label: item.name
        })))
      })
    
    // Fetch units
    fetch('/api/units')
      .then(res => res.json())
      .then((data: UnitData[]) => {
        setUnits(data.map(item => ({
          value: item.id,
          label: item.name
        })))
      })
  }, [])

  return (
    <div className="space-y-4 mb-10">
      <div className='flex justify-between'>
        <h2 className="text-xl font-semibold">Ingredients</h2>
        <button 
          type="button"
          onClick={() => appendIngredient({ ingredientId: '', quantity: '', unitId: '' })}
          className="bg-zinc-200 text-black p-1 rounded-md hover:bg-zinc-300 hover:cursor-pointer"
        >
          <Plus />
        </button>
      </div>

      {ingredientFields.map((field, index) => (
        <div key={field.id} className="flex gap-4 items-start">
          <div className="flex-1">
            <Controller
              control={control}
              name={`ingredients.${index}.ingredientId`}
              render={({ field }) => (
                <Select
                  {...field}
                  options={ingredients}
                  placeholder="Select ingredient"
                  className="react-select"
                  classNamePrefix="react-select"
                  value={ingredients.find(option => option.value === field.value)}
                  onChange={option => field.onChange(option?.value)}
                />
              )}
            />
            {errors.ingredients?.[index]?.ingredientId && (
              <p className="text-red-500">{errors.ingredients[index].ingredientId?.message}</p>
            )}
          </div>
          
          <div className="w-24">
            <input
              {...register(`ingredients.${index}.quantity`)}
              placeholder="Amount"
              className="border rounded-md p-2 w-full focus:outline-1"
              type="text"
            />
            {errors.ingredients?.[index]?.quantity && (
              <p className="text-red-500">{errors.ingredients[index].quantity?.message}</p>
            )}
          </div>

          <div className="w-36">
            <Controller
              control={control}
              name={`ingredients.${index}.unitId`}
              render={({ field }) => (
                <Select
                  {...field}
                  options={units}
                  placeholder="Select unit"
                  className="react-select"
                  classNamePrefix="react-select"
                  value={units.find(option => option.value === field.value)}
                  onChange={option => field.onChange(option?.value)}
                />
              )}
            />
            {errors.ingredients?.[index]?.unitId && (
              <p className="text-red-500">{errors.ingredients[index].unitId?.message}</p>
            )}
          </div>

          <button
            type="button"
            onClick={() => removeIngredient(index)}
            className="text-red-500 text-center pt-2 hover:cursor-pointer p-2 rounded-md"
          >
            Remove
          </button>
        </div>
      ))}

      {errors.ingredients && <p className='text-red-500'>{errors.ingredients.message}</p>}
    </div>
  )
}

export default IngredientsForm