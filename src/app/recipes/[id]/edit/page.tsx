"use client"

import { useForm, useFieldArray } from "react-hook-form"
import { CreateRecipeFormData } from "@/lib/validations/recipe-zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { editRecipeZodSchema } from "@/lib/validations/recipe-zod"
import EditRecipeForm from "@/components/forms/EditRecipeForm"
import InstructionsForm from "@/components/forms/InstructionsForm"
import IngredientsForm from "@/components/forms/IngredientsForm"
import { useState, useEffect } from "react"
import { FORM_STEPS } from "@/lib/utils/constants"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import CategoriesAllergiesForm from "@/components/forms/CategoriesAllergiesForm"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { FormProgressTracker } from "@/components/forms/FormProgressTracker"
import { RecipeEditData } from "@/lib/types"

interface EditRecipePageProps {
  params: Promise<{ id: string }>
}

const EditRecipePage = ({ params }: EditRecipePageProps) => {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [recipe, setRecipe] = useState<RecipeEditData | null>(null)
  const totalSteps = 4
  const [image, setImage] = useState<File | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)
  const [recipeId, setRecipeId] = useState<string>("")

  const {
    control,
    register,
    trigger,
    reset,
    getValues,
    formState: { errors },
  } = useForm<CreateRecipeFormData>({
    resolver: zodResolver(editRecipeZodSchema),
    mode: "onBlur",
  })

  const {
    fields: instructionFields,
    append: appendInstruction,
    remove: removeInstruction,
    replace: replaceInstructions,
  } = useFieldArray({
    control,
    name: "instructions",
  })

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
    replace: replaceIngredients,
  } = useFieldArray({
    control,
    name: "ingredients",
  })

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        const { id } = await params
        setRecipeId(id)

        const response = await fetch(`/api/recipes/${id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch recipe")
        }

        const recipeData = await response.json()
        setRecipe(recipeData)
        const formData = {
          title: recipeData.title,
          description: recipeData.description,
          servings: recipeData.servings,
          preparationTime: recipeData.preparationTime,
          categories: recipeData.categories.map(
            (cat: { category: { id: string } }) => cat.category.id,
          ),
          allergies: recipeData.allergies.map(
            (allergy: { allergy: { id: string } }) => allergy.allergy.id,
          ),
          difficultyId: recipeData.difficultyId || undefined,
          isVegan: recipeData.isVegan || false,
          isVegetarian: recipeData.isVegetarian || false,
          instructions: recipeData.instructions.map(
            (inst: { stepNumber: number; content: string }) => ({
              stepNumber: inst.stepNumber,
              content: inst.content,
            }),
          ),
          ingredients: recipeData.ingredients.map(
            (ing: { name: string; quantity: number; unitId: string }) => ({
              name: ing.name,
              quantity: ing.quantity,
              unitId: ing.unitId,
            }),
          ),
          image: undefined,
        }

        reset(formData)
        replaceInstructions(formData.instructions)
        replaceIngredients(formData.ingredients)

        setIsLoading(false)
      } catch (error) {
        console.error("Error loading recipe:", error)
        toast.error("Greška pri učitavanju recepta")
        router.push("/recipes")
      }
    }

    loadRecipe()
  }, [params, reset, replaceInstructions, replaceIngredients, router])

  const onSubmit = async (data: CreateRecipeFormData) => {
    setIsSubmitting(true)
    setImageError(null)

    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "image") {
          formData.append(
            key,
            typeof value === "object" ? JSON.stringify(value) : String(value),
          )
        }
      })

      if (image) {
        formData.append("image", image)
      }

      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: "PUT",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update recipe")
      }

      toast.success("Recept je uspješno ažuriran!")
      router.push(`/recipes/${recipeId}`)
    } catch (error) {
      console.error("Error updating recipe:", error)
      toast.error(
        error instanceof Error
          ? error.message
          : "Greška pri ažuriranju recepta",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateRecipe = async () => {
    const formData = getValues()

    const isValid = await trigger()

    if (isValid) {
      await onSubmit(formData)
    } else {
      toast.error("Molimo ispravite greške u formi prije ažuriranja")
    }
  }

  const handleNext = async () => {
    setImageError(null)

    const currentStepConfig = FORM_STEPS[currentStep - 1]

    let fieldsToValidate: string[]
    if (currentStep === 1) {
      fieldsToValidate = ["title", "description", "servings", "preparationTime"]
    } else {
      fieldsToValidate = [...currentStepConfig.fields]
    }

    const isStepValid = await trigger(
      fieldsToValidate as (keyof CreateRecipeFormData)[],
    )

    if (isStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
    }
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const stepTitles = FORM_STEPS.map((step) => step.title)

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 pt-25">
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Učitavanje recepta...
        </div>
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="max-w-4xl mx-auto p-6 pt-25">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Recept nije pronađen</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 pt-25">
      <h1 className="text-2xl font-bold mb-6">Uredi recept</h1>

      <FormProgressTracker
        currentStep={currentStep}
        totalSteps={totalSteps}
        steps={stepTitles}
      />

      <form className="space-y-6">
        {currentStep === 1 && (
          <EditRecipeForm
            register={register}
            errors={errors}
            image={image}
            setImage={(file: File | null) => {
              setImage(file)
              if (file) setImageError(null)
            }}
            imageError={imageError}
            existingImageUrl={recipe.image_path}
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
          <CategoriesAllergiesForm control={control} errors={errors} />
        )}

        <div className="flex justify-between mt-8">
          {currentStep > 1 && (
            <Button type="button" onClick={handleBack}>
              <ArrowLeft />
              Natrag
            </Button>
          )}

          {currentStep < totalSteps ? (
            <Button type="button" onClick={handleNext} className="ml-auto">
              Dalje
              <ArrowRight />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleUpdateRecipe}
              variant={"outline"}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ažuriranje...
                </>
              ) : (
                "Ažuriraj recept"
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}

export default EditRecipePage
