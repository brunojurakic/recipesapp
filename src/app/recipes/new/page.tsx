"use client"

import { useForm, useFieldArray } from 'react-hook-form'
import { CreateRecipeFormData } from '@/lib/validations/recipe-zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { recipeZodSchema } from '@/lib/validations/recipe-zod'
import RecipeForm from '@/components/forms/RecipeForm'
import InstructionsForm from '@/components/forms/InstructionsForm'
import IngredientsForm from '@/components/forms/IngredientsForm'
import { useState } from 'react'
import { FORM_STEPS } from '@/lib/utils/constants'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import CategoriesAllergiesForm from '@/components/forms/CategoriesAllergiesForm'

const NewRecipePage = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4
  const [image, setImage] = useState<File | null>(null)

  const {
    control,
    register,
    handleSubmit,
    trigger,
    formState: { errors }
  } = useForm<CreateRecipeFormData>({
    resolver: zodResolver(recipeZodSchema),
    mode: 'onBlur'
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

  const onSubmit = async (data: CreateRecipeFormData) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'image') {
        formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value))
      }
    })
    if (image) {
      formData.append('image', image)
    }
    console.log(formData)
    await fetch('/api/recipes', { method: 'POST', body: formData })
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
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        {currentStep === 1 && (
          <RecipeForm register={register} errors={errors} image={image} setImage={setImage} />
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

        {currentStep === 4 && (
          <CategoriesAllergiesForm
            control={control}
            errors={errors}
          />
        )}

        <div className='flex justify-between mt-8'>
          {currentStep > 1 && (
            <Button onClick={handleBack}>
              <ArrowLeft />Back
            </Button>
          )}

          {currentStep < totalSteps ? (
            <Button onClick={handleNext} className='ml-auto'>
              Next<ArrowRight />
            </Button>
          ) : (
            <Button type='submit' variant={'outline'}>
              Create Recipe
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}

export default NewRecipePage