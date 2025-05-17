"use client"

import { UseFormRegister, FieldErrors } from 'react-hook-form'
import { CreateRecipeFormData } from '@/lib/validations/recipe-zod'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'

interface RecipeFormProps {
  register: UseFormRegister<CreateRecipeFormData>
  errors: FieldErrors<CreateRecipeFormData>
  image: File | null;
  setImage: (file: File | null) => void;
}

const RecipeForm = ({ register, errors, image, setImage }: RecipeFormProps) => {
  return (
    <div className="space-y-6 mb-10">
      <h2 className="text-xl font-semibold">Recipe Details</h2>
      
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...register('title')} type="text" placeholder='Recipe title' />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register('description')} placeholder='Recipe description' 
          className="min-h-[120px]"
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className="space-y-2">
          <Label htmlFor="servings">Servings (people)</Label>
          <Input id="servings" {...register('servings', { valueAsNumber: true })} type="number" 
            defaultValue={1} 
          />
          {errors.servings && <p className="text-red-500 text-sm">{errors.servings.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="preparationTime">Preparation time (minutes)</Label>
          <Input id="preparationTime" {...register('preparationTime', { valueAsNumber: true })} type="number" 
            defaultValue={1} 
          />
          {errors.preparationTime && <p className="text-red-500 text-sm">{errors.preparationTime.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input id="image" type="file" 
          accept="image/jpeg,image/jpg,image/png,image/webp" className="cursor-pointer"
          onChange={e => {
            const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
            setImage(file);
          }}
        />
        {image && <p className="text-green-600 text-sm">Selected: {image.name}</p>}
        {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
      </div>
    </div>
  )
}

export default RecipeForm