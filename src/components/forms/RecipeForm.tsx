import { UseFormRegister, FieldErrors } from 'react-hook-form'
import { CreateRecipeFormData } from '@/lib/validations/recipe-zod'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'

interface RecipeFormProps {
  register: UseFormRegister<CreateRecipeFormData>
  errors: FieldErrors<CreateRecipeFormData>
}

const RecipeForm = ({ register, errors }: RecipeFormProps) => {
  return (
    <>
      <div className='space-y-4'>
        <div>
          <label className='block mb-1'>Title</label>
          <Input {...register('title')} type="text" placeholder='Recipe title' />
          {errors.title && <p className='text-red-500'>{errors.title.message}</p>}
        </div>
      </div>

      <div className='space-y-4'>
        <div>
          <label className='block mb-1'>Description</label>
          <Textarea {...register('description')} placeholder='Recipe description' />
          {errors.description && <p className='text-red-500'>{errors.description.message}</p>}
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label className='block mb-1'>Servings (people)</label>
          <Input {...register('servings', { valueAsNumber: true })} type="number" defaultValue={1} />
          {errors.servings && <p className='text-red-500'>{errors.servings.message}</p>}
        </div>

        <div>
          <label className='block mb-1'>Preparation time (minutes)</label>
          <Input {...register('preparationTime', { valueAsNumber: true })} type="number" defaultValue={1} />
          {errors.preparationTime && <p className='text-red-500'>{errors.preparationTime.message}</p>}
        </div>
      </div>

      <div>
        <label className='block mb-1'>Image</label>
        <Input {...register('image')} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" />
        {errors.image && <p className='text-red-500'>{errors.image.message}</p>}
      </div>
    </>
  )
}

export default RecipeForm