"use client"

import { useForm, useFieldArray } from 'react-hook-form'
import { CreateRecipeFormData } from '@/lib/validations/recipe-zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { recipeZodSchema } from '@/lib/validations/recipe-zod'

const NewRecipePage = () => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateRecipeFormData>({
    resolver: zodResolver(recipeZodSchema)
  })

  const {
    fields: instructionFields,
    append: appendInstruction,
    remove: removeInstruction
  } = useFieldArray({
    control, name: 'instructions'
  })

  const onSubmit = (data: CreateRecipeFormData) => {
    console.log(data);
  }

  return (
    <div className='max-w-4xl mx-auto p-6 pt-25'>
      <h1 className='text-2xl font-bold mb-6'>Create New Recipe</h1>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>

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
            <textarea {...register('description')} placeholder='Recipe title'
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

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Instructions</h2>

          {instructionFields.map((field, index) => (
            <div key={field.id} className="flex gap-4 items-start">
              <div className="w-16 text-center pt-2">Step {index + 1}</div>
              <div className="flex-1">
                <input
                  {...register(`instructions.${index}.content`)} 
                  placeholder={`Step ${index + 1} instruction`}
                  className="border rounded-md p-2 w-full focus:outline-1"
                />
                {errors.instructions?.[index]?.content && (
                  <p className="text-red-500 text">{errors.instructions[index].content?.message}</p>
                )}
              </div>
              <button onClick={() => removeInstruction(index)}
                className="text-red-500 text-center pt-2 hover:cursor-pointer p-2 rounded-md">
                Remove
              </button>
            </div>
          ))}

          <button onClick={() => appendInstruction({ stepNumber: instructionFields.length + 1, content: '' })}
            className="bg-zinc-200 text-black px-4 py-2 rounded-md hover:bg-zinc-300 hover:cursor-pointer">
            Add Instruction
          </button>
          {errors.instructions && <p className='text-red-500'>{errors.instructions.message}</p>}
        </div>


        


        <button type='submit'>Create</button>
      </form>
    </div>
  )
}

export default NewRecipePage