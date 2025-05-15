"use client"

import { useForm, useFieldArray } from 'react-hook-form'
import { CreateRecipeFormData } from '@/lib/validations/recipe-zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { recipeZodSchema } from '@/lib/validations/recipe-zod'
import RecipeForm from '@/components/forms/RecipeForm'
import InstructionsForm from '@/components/forms/InstructionsForm'

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

  const onValid = (data: CreateRecipeFormData) => {
    console.log("✅ Valid data:", data)
  }

  const onInvalid = (errors) => {
    console.log("❌ Validation errors:", errors)
  }

  return (
    <div className='max-w-4xl mx-auto p-6 pt-25'>
      <h1 className='text-2xl font-bold mb-6'>Create New Recipe</h1>
      <form onSubmit={handleSubmit(onValid, onInvalid)} className='space-y-6'>
        <RecipeForm register={register} errors={errors} />
        <InstructionsForm
          register={register}
          errors={errors}
          instructionFields={instructionFields}
          appendInstruction={appendInstruction}
          removeInstruction={removeInstruction}
        />

        <button type='submit'>Create</button>
      </form>
    </div>
  )
}

export default NewRecipePage