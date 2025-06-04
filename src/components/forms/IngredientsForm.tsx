"use client"

import {
  UseFormRegister,
  FieldErrors,
  Control,
  useWatch,
} from "react-hook-form"
import { CreateRecipeFormData } from "@/lib/validations/recipe-zod"
import { FieldArrayWithId } from "react-hook-form"
import { Plus, X, Loader2 } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { useEffect, useState } from "react"
import { Label } from "../ui/label"

type Unit = {
  id: string
  name: string
  abbreviation: string
  type: string
}

interface IngredientsFormProps {
  register: UseFormRegister<CreateRecipeFormData>
  control: Control<CreateRecipeFormData>
  errors: FieldErrors<CreateRecipeFormData>
  ingredientFields: FieldArrayWithId<
    CreateRecipeFormData,
    "ingredients",
    "id"
  >[]
  appendIngredient: (value: {
    name: string
    quantity: number
    unitId: string
  }) => void
  removeIngredient: (index: number) => void
}

const IngredientsForm = ({
  register,
  control,
  errors,
  ingredientFields,
  appendIngredient,
  removeIngredient,
}: IngredientsFormProps) => {
  const [units, setUnits] = useState<Unit[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const ingredientValues = useWatch({
    control,
    name: "ingredients",
  })

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/units")
        if (!response.ok) {
          throw new Error("Dohvaćanje mjernih jedinica nije uspjelo")
        }
        const data = await response.json()
        setUnits(data)
      } catch (err) {
        console.error("Greška pri dohvaćanju mjernih jedinica:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUnits()
  }, [])

  const getUnitDisplayName = (unitId: string) => {
    const unit = units.find((u) => u.id === unitId)
    return unit ? `${unit.name} (${unit.abbreviation})` : "Odaberite jedinicu"
  }

  return (
    <div className="space-y-6 mb-10">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Sastojci</h2>
        <Button
          variant="outline"
          onClick={() =>
            appendIngredient({ name: "", quantity: 0, unitId: "" })
          }
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          Dodaj sastojak
        </Button>
      </div>

      {ingredientFields.length === 0 && !isLoading && (
        <div className="text-center p-4 border border-dashed rounded-md border-gray-300">
          <p className="text-gray-500">
            Još nema dodanih sastojaka. Kliknite Dodaj sastojak za početak.
          </p>
        </div>
      )}

      {ingredientFields.map((field, index) => {
        const currentUnitId =
          ingredientValues?.[index]?.unitId || field.unitId || ""

        return (
          <div key={field.id} className="p-4 border rounded-md bg-gray-50">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Sastojak {index + 1}</h3>
              <Button
                variant="ghost"
                onClick={() => removeIngredient(index)}
                size={"icon"}
              >
                <X className="text-red-500" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`ingredients.${index}.name`}>Naziv</Label>
                <Input
                  id={`ingredients.${index}.name`}
                  {...register(`ingredients.${index}.name`)}
                  placeholder="npr. Brašno"
                />
                {errors.ingredients?.[index]?.name && (
                  <p className="text-red-500 text-sm">
                    {errors.ingredients[index].name?.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor={`ingredients.${index}.quantity`}>
                  Količina
                </Label>
                <Input
                  id={`ingredients.${index}.quantity`}
                  {...register(`ingredients.${index}.quantity`, {
                    valueAsNumber: true,
                  })}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="npr. 200"
                />
                {errors.ingredients?.[index]?.quantity && (
                  <p className="text-red-500 text-sm">
                    {errors.ingredients[index].quantity?.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`ingredients.${index}.unitId`}>
                  Mjerna jedinica
                </Label>
                <Select
                  value={currentUnitId}
                  onValueChange={(value) => {
                    const event = {
                      target: {
                        name: `ingredients.${index}.unitId`,
                        value: value,
                      },
                    } as React.ChangeEvent<HTMLSelectElement>
                    register(`ingredients.${index}.unitId`).onChange(event)
                  }}
                  disabled={isLoading}
                >
                  <SelectTrigger id={`ingredients.${index}.unitId`}>
                    <SelectValue placeholder="Odaberite jedinicu">
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Učitavanje...</span>
                        </div>
                      ) : currentUnitId ? (
                        getUnitDisplayName(currentUnitId)
                      ) : (
                        "Odaberite jedinicu"
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id}>
                        {unit.name} ({unit.abbreviation})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.ingredients?.[index]?.unitId && (
                  <p className="text-red-500 text-sm">
                    {errors.ingredients[index].unitId?.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        )
      })}

      {errors.ingredients && !Array.isArray(errors.ingredients) && (
        <p className="text-red-500">{errors.ingredients.message}</p>
      )}
    </div>
  )
}

export default IngredientsForm
