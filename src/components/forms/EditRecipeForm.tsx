"use client"

import { UseFormRegister, FieldErrors } from "react-hook-form"
import { CreateRecipeFormData } from "@/lib/validations/recipe-zod"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Label } from "../ui/label"
import { useEffect, useState } from "react"
import Image from "next/image"

interface EditRecipeFormProps {
  register: UseFormRegister<CreateRecipeFormData>
  errors: FieldErrors<CreateRecipeFormData>
  image: File | null
  setImage: (file: File | null) => void
  imageError?: string | null
  existingImageUrl?: string
}

const EditRecipeForm = ({
  register,
  errors,
  image,
  setImage,
  imageError,
  existingImageUrl,
}: EditRecipeFormProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    existingImageUrl || null,
  )

  useEffect(() => {
    if (!image) {
      setPreviewUrl(existingImageUrl || null)
      return
    }
    const objectUrl = URL.createObjectURL(image)
    setPreviewUrl(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [image, existingImageUrl])

  return (
    <div className="space-y-6 mb-10">
      <h2 className="text-xl font-semibold">Detalji recepta</h2>

      <div className="space-y-2">
        <Label htmlFor="title">Naslov</Label>
        <Input
          id="title"
          {...register("title")}
          type="text"
          placeholder="Naslov recepta"
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Opis</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Opis recepta"
          className="min-h-[120px]"
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="servings">Broj porcija</Label>
          <Input
            id="servings"
            {...register("servings", { valueAsNumber: true })}
            type="number"
            defaultValue={1}
          />
          {errors.servings && (
            <p className="text-red-500 text-sm">{errors.servings.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="preparationTime">Vrijeme pripreme (minute)</Label>
          <Input
            id="preparationTime"
            {...register("preparationTime", { valueAsNumber: true })}
            type="number"
            defaultValue={1}
          />
          {errors.preparationTime && (
            <p className="text-red-500 text-sm">
              {errors.preparationTime.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">
          Slika{" "}
          {existingImageUrl && !image && "(trenutna slika će se zadržati)"}
        </Label>
        <Input
          id="image"
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          className="cursor-pointer"
          onChange={(e) => {
            const file =
              e.target.files && e.target.files[0] ? e.target.files[0] : null
            setImage(file)
          }}
        />
        {previewUrl && (
          <div className="mt-2">
            <div className="relative w-full max-w-[300px] h-[200px] rounded-md overflow-hidden border border-border">
              <Image
                src={previewUrl}
                alt="Recipe preview"
                fill
                sizes="(max-width: 300px) 100vw, 300px"
                className="object-cover"
                priority
              />
            </div>
            {!image && existingImageUrl && (
              <p className="text-sm text-muted-foreground mt-1">
                Trenutna slika recepta
              </p>
            )}
            {image && (
              <p className="text-sm text-muted-foreground mt-1">
                Nova slika - stara će biti zamijenjena
              </p>
            )}
          </div>
        )}
        {imageError && <p className="text-red-500 text-sm">{imageError}</p>}
      </div>
    </div>
  )
}

export default EditRecipeForm
