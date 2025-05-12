"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BasicRecipeInfo } from "@/components/ui/recipe/BasicRecipeInfo";
import { ImageUpload } from "@/components/ui/recipe/ImageUpload";
import { IngredientsList } from "@/components/ui/recipe/IngredientsList";
import { InstructionsList } from "@/components/ui/recipe/InstructionsList";

export default function NewRecipePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [recipe, setRecipe] = useState({
    title: "",
    description: "",
    servings: 1,
    preparationTime: 30,
    ingredients: [{ name: "", quantity: "" }],
    instructions: [{ content: "" }],
    categories: [] as string[]
  });

  // Redirect to login if not authenticated
  if (!isPending && !session) {
    router.push("/login");
    return null;
  }

  if (isPending) {
    return (
      <div className="min-h-screen bg-zinc-50 pt-16 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-zinc-200 border-t-zinc-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate required fields
    if (!recipe.title.trim()) {
      setError("Recipe title is required");
      return;
    }

    if (!recipe.description.trim()) {
      setError("Recipe description is required");
      return;
    }

    if (!imageFile) {
      setError("Please upload a recipe image");
      return;
    }

    // Validate image file type and size
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(imageFile.type)) {
      setError("Invalid file type. Please upload a JPG, PNG, WebP, or GIF image.");
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (imageFile.size > maxSize) {
      setError("Image is too large. Maximum size is 10MB.");
      return;
    }

    // Check if there's at least one non-empty ingredient
    const hasValidIngredient = recipe.ingredients.some(
      ing => ing.name.trim() && ing.quantity.trim()
    );
    if (!hasValidIngredient) {
      setError("Please add at least one ingredient with name and quantity");
      return;
    }

    // Check if there's at least one non-empty instruction
    const hasValidInstruction = recipe.instructions.some(
      inst => inst.content.trim()
    );
    if (!hasValidInstruction) {
      setError("Please add at least one instruction step");
      return;
    }

    setIsSubmitting(true);

    try {
      // First upload the image
      const formData = new FormData();
      formData.append("file", imageFile);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image");
      }

      const { path: imagePath } = await uploadResponse.json();

      // Then create the recipe with the image path
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...recipe,
          imagePath,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create recipe");
      }

      router.push("/recipes"); // Redirect to recipes page after success
    } catch (error) {
      console.error("Error creating recipe:", error);
      // Try to extract error message from the response if available
      if (error instanceof Error) {
        if (error.message === "Failed to upload image") {
          setError("Failed to upload image. Please make sure it's a JPG, PNG, WebP, or GIF file under 10MB.");
        } else if (error.message === "Failed to create recipe") {
          setError("Failed to save the recipe. Please try again.");
        } else {
          setError(error.message || "An unexpected error occurred. Please try again.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-2xl font-bold text-zinc-900 mb-8">Create New Recipe</h1>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <BasicRecipeInfo
              title={recipe.title}
              description={recipe.description}
              servings={recipe.servings}
              preparationTime={recipe.preparationTime}
              onUpdate={(field, value) => setRecipe(prev => ({ ...prev, [field]: value }))}
            />

            {/* Image Upload */}
            <ImageUpload
              imageUrl={imagePreview}
              onImageChange={(file) => {
                setImageFile(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                  setImagePreview(reader.result as string);
                };
                reader.readAsDataURL(file);
              }}
            />

            {/* Ingredients */}
            <IngredientsList
              ingredients={recipe.ingredients}
              onIngredientChange={(index, field, value) => {
                setRecipe(prev => ({
                  ...prev,
                  ingredients: prev.ingredients.map((ingredient, i) => 
                    i === index ? { ...ingredient, [field]: value } : ingredient
                  )
                }));
              }}
              onAddIngredient={() => {
                setRecipe(prev => ({
                  ...prev,
                  ingredients: [...prev.ingredients, { name: "", quantity: "" }]
                }));
              }}
            />

            {/* Instructions */}
            <InstructionsList
              instructions={recipe.instructions}
              onInstructionChange={(index, content) => {
                setRecipe(prev => ({
                  ...prev,
                  instructions: prev.instructions.map((instruction, i) => 
                    i === index ? { content } : instruction
                  )
                }));
              }}
              onAddInstruction={() => {
                setRecipe(prev => ({
                  ...prev,
                  instructions: [...prev.instructions, { content: "" }]
                }));
              }}
            />

            {/* Error Message */}
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {error}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Creating..." : "Create Recipe"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
