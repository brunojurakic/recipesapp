"use client"

import { useForm, useFieldArray, FieldErrors } from 'react-hook-form'
import { CreateRecipeFormData } from '@/lib/validations/recipe-zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { recipeZodSchema } from '@/lib/validations/recipe-zod'
import RecipeForm from '@/components/forms/RecipeForm'
import InstructionsForm from '@/components/forms/InstructionsForm'
import IngredientsForm from '@/components/forms/IngredientsForm'
import { useState } from 'react'
import { FORM_STEPS } from '@/lib/utils/constants'

const NewRecipePage = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3

  const {
    control,
    register,
    handleSubmit,
    trigger,
    formState: { errors }
  } = useForm<CreateRecipeFormData>({
    resolver: zodResolver(recipeZodSchema),
    mode: 'onChange'
  })

  const {
    fields: instructionFields,
    append: appendInstruction,
    remove: removeInstruction
  } = useFieldArray({
    control,
    name: 'instructions'
  })

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient
  } = useFieldArray({
    control,
    name: 'ingredients'
  })

  const onValid = (data: CreateRecipeFormData) => {
    console.log("✅ Valid data:", data)
  }

  const onInvalid = (errors: FieldErrors<CreateRecipeFormData>) => {
    console.log("❌ Validation errors:", errors)
  }

  const handleNext = async () => {
    const currentStepConfig = FORM_STEPS[currentStep - 1]
    const isStepValid = await trigger(currentStepConfig.fields)
    
    if (isStepValid) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps))
    }
  }

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  return (
    <div className='max-w-4xl mx-auto p-6 pt-25'>
      <h1 className='text-2xl font-bold mb-6'>Create New Recipe</h1>
      <form onSubmit={handleSubmit(onValid, onInvalid)} className='space-y-6'>
        {currentStep === 1 && (
          <RecipeForm register={register} errors={errors} />
        )}

        {currentStep === 2 && (
          <InstructionsForm
            register={register}
            errors={errors}
            instructionFields={instructionFields}
            appendInstruction={appendInstruction}
            removeInstruction={removeInstruction}
          />
        )}

        {currentStep === 3 && (
          <IngredientsForm
            register={register}
            control={control}
            errors={errors}
            ingredientFields={ingredientFields}
            appendIngredient={appendIngredient}
            removeIngredient={removeIngredient}
          />
        )} 

        <div className='flex justify-between mt-8'>
          {currentStep > 1 && (
            <button onClick={handleBack} className='bg-zinc-200 text-black px-4 py-2 rounded-md hover:bg-zinc-300 hover:cursor-pointer'
            >
              Back
            </button>
          )}

          {currentStep < totalSteps ? (
            <button onClick={handleNext} className='bg-zinc-200 text-black px-4 py-2 rounded-md hover:bg-zinc-300 hover:cursor-pointer ml-auto'>
              Next
            </button>
          ) : (
            <button type='submit'
              className='px-4 py-2 bg-green-500 text-white rounded ml-auto'>
              Create Recipe
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default NewRecipePage