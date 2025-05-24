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
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'
import CategoriesAllergiesForm from '@/components/forms/CategoriesAllergiesForm'
import { useRouter } from 'next/navigation'
import { toast } from "sonner"
import { FormProgressTracker } from '@/components/forms/FormProgressTracker'

const NewRecipePage = () => {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const totalSteps = 4
  const [image, setImage] = useState<File | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)

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
    if (!image) {
      setImageError('Slika je obavezna.');
      setCurrentStep(1);
      return;
    }
    setImageError(null);
    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'image') {
        formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
      }
    });
    if (image) {
      formData.append('image', image);
    }
      try {
      const response = await fetch('/api/recipes', { 
        method: 'POST', 
        body: formData 
      });
      
      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || 'Stvaranje recepta nije uspjelo');
        return;
      }
      
      toast.success('Recept je uspješno stvoren!');
      router.push('/recipes');
    } catch (error) {
      console.error(error)
      toast.error('Došlo je do neočekivane pogreške');
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleNext = async () => {
    if (currentStep === 1 && !image) {
      setImageError('Slika je obavezna');
      return;
    }
    setImageError(null);
    const currentStepConfig = FORM_STEPS[currentStep - 1]
    const isStepValid = await trigger(currentStepConfig.fields)

    if (isStepValid) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps))
    }
  }

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }
  const stepTitles = FORM_STEPS.map(step => step.title)

  return (
    <div className='max-w-4xl mx-auto p-6 pt-25'>
      <h1 className='text-2xl font-bold mb-6'>Stvori novi recept</h1>
      
      <FormProgressTracker 
        currentStep={currentStep} 
        totalSteps={totalSteps} 
        steps={stepTitles}
      />
      
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        {currentStep === 1 && (
          <RecipeForm
            register={register}
            errors={errors}
            image={image}
            setImage={file => {
              setImage(file);
              if (file) setImageError(null);
            }}
            imageError={imageError}
          />
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
              <ArrowLeft />Natrag
            </Button>
          )}

          {currentStep < totalSteps ? (
            <Button onClick={handleNext} className='ml-auto'>
              Dalje<ArrowRight />
            </Button>) : (
            <Button type='submit' variant={'outline'} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Stvaranje...
                </>
              ) : (
                'Stvori recept'
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}

export default NewRecipePage