import { UseFormRegister, FieldErrors } from 'react-hook-form'
import { CreateRecipeFormData } from '@/lib/validations/recipe-zod'

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
          <input {...register('title')} type="text" placeholder='Recipe title'
            className='w-full p-2 border rounded-md focus:outline-1' />
          {errors.title && <p className='text-red-500'>{errors.title.message}</p>}
        </div>
      </div>

      <div className='space-y-4'>
        <div>
          <label className='block mb-1'>Description</label>
          <textarea {...register('description')} placeholder='Recipe description'
            className='w-full p-2 border rounded-md focus:outline-1' />
          {errors.description && <p className='text-red-500'>{errors.description.message}</p>}
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label className='block mb-1'>Servings (people)</label>
          <input {...register('servings', { valueAsNumber: true })} type="number" defaultValue={1}
            className='border rounded-md p-2 w-full focus:outline-1' />
          {errors.servings && <p className='text-red-500'>{errors.servings.message}</p>}
        </div>

        <div>
          <label className='block mb-1'>Preparation time (minutes)</label>
          <input {...register('preparationTime', { valueAsNumber: true })} type="number" defaultValue={1}
            className='border rounded-md p-2 w-full focus:outline-1' />
          {errors.preparationTime && <p className='text-red-500'>{errors.preparationTime.message}</p>}
        </div>
      </div>

      <div>
        <label className='block mb-1'>Image</label>
        <input {...register('image')} type="file" accept="image/jpeg,image/jpg,image/png,image/webp"
          className='border rounded-md p-2 w-full focus:outline-1' />
        {errors.image && <p className='text-red-500'>{errors.image.message}</p>}
      </div>
    </>
  )
}

export default RecipeForm