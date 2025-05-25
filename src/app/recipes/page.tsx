"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { RecipeFilters } from "@/components/recipes/RecipeFilters";
import { RecipeListDisplay } from "@/components/recipes/RecipeListDisplay";
import type { SelectableItem } from "@/components/ui/multi-select";

import type { recipe as DbRecipeType, category as DbCategoryType, allergy as DbAllergyType } from "@/db/schema";
import type { InferSelectModel } from "drizzle-orm";


type FullDbRecipe = InferSelectModel<typeof DbRecipeType>;
type FullDbCategory = InferSelectModel<typeof DbCategoryType>;
type FullDbAllergy = InferSelectModel<typeof DbAllergyType>;


export interface RecipeClient extends FullDbRecipe {
  user: { name: string | null };
  categories: Array<{ category: FullDbCategory }>;
  allergies: Array<{ allergy: FullDbAllergy }>;
}

export default function RecipesPage() {
  const { data: sessionData, isPending: isSessionLoading } = useSession();
  const session = sessionData?.session;

  const [allRecipes, setAllRecipes] = useState<RecipeClient[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<RecipeClient[]>([]);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedAllergyIds, setSelectedAllergyIds] = useState<string[]>([]);
  const [maxPrepTime, setMaxPrepTime] = useState<string>("");
  const [minServings, setMinServings] = useState<string>("");

  const [allCategories, setAllCategories] = useState<SelectableItem[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [allAllergies, setAllAllergies] = useState<SelectableItem[]>([]);
  const [isLoadingAllergies, setIsLoadingAllergies] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setIsLoadingRecipes(true);
        const res = await fetch("/api/recipes");
        if (!res.ok) throw new Error("Failed to fetch recipes");
        const data: RecipeClient[] = await res.json();
        setAllRecipes(data);
        setFilteredRecipes(data);
      } catch (error) {
        console.error(error);
        toast.error("Greška pri dohvaćanju recepata.");
      } finally {
        setIsLoadingRecipes(false);
      }
    };

    const fetchFilterOptions = async () => {
      try {
        setIsLoadingCategories(true);
        const catRes = await fetch("/api/categories");
        if (!catRes.ok) throw new Error("Failed to fetch categories");
        const categoriesData = await catRes.json();
        setAllCategories(categoriesData.map((c: FullDbCategory) => ({ id: c.id, name: c.name })));
      } catch (error) {
        console.error(error);
        toast.error("Greška pri dohvaćanju kategorija.");
      } finally {
        setIsLoadingCategories(false);
      }

      try {
        setIsLoadingAllergies(true);
        const algRes = await fetch("/api/allergies");
        if (!algRes.ok) throw new Error("Failed to fetch allergies");
        const allergiesData = await algRes.json();
        setAllAllergies(allergiesData.map((a: FullDbAllergy) => ({ id: a.id, name: a.name })));
      } catch (error) {
        console.error(error);
        toast.error("Greška pri dohvaćanju alergena.");
      } finally {
        setIsLoadingAllergies(false);
      }
    };

    fetchRecipes();
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    let tempRecipes = [...allRecipes];

    if (searchTerm) {
      tempRecipes = tempRecipes.filter(recipe =>
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategoryIds.length > 0) {
      tempRecipes = tempRecipes.filter(recipe =>
        selectedCategoryIds.some(catId =>
          recipe.categories.some(rc => rc.category.id === catId)
        )
      );
    }

    if (selectedAllergyIds.length > 0) {
      tempRecipes = tempRecipes.filter(recipe =>
        !selectedAllergyIds.some(allergyId =>
          recipe.allergies.some(ra => ra.allergy.id === allergyId)
        )
      );
    }

    if (maxPrepTime) {
      const prepTimeNum = parseInt(maxPrepTime, 10);
      if (!isNaN(prepTimeNum) && prepTimeNum > 0) {
        tempRecipes = tempRecipes.filter(
          recipe => recipe.preparationTime <= prepTimeNum
        );
      }
    }

    if (minServings) {
      const servingsNum = parseInt(minServings, 10);
      if (!isNaN(servingsNum) && servingsNum > 0) {
        tempRecipes = tempRecipes.filter(recipe => recipe.servings >= servingsNum);
      }
    }

    setFilteredRecipes(tempRecipes);
  }, [searchTerm, selectedCategoryIds, selectedAllergyIds, maxPrepTime, minServings, allRecipes]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategoryIds([]);
    setSelectedAllergyIds([]);
    setMaxPrepTime("");
    setMinServings("");
  };

  const hasActiveFilters = useMemo(() => {
    return Boolean(searchTerm || selectedCategoryIds.length > 0 || selectedAllergyIds.length > 0 || maxPrepTime || minServings);
  }, [searchTerm, selectedCategoryIds, selectedAllergyIds, maxPrepTime, minServings]);

  return (
    <div className="max-w-7xl mx-auto p-6 pt-25">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Recepti</h1>
          <p className="text-muted-foreground">Otkrijte i podijelite nevjerojatne recepte</p>
        </div>
        {isSessionLoading ? (
          <Skeleton className="h-10 w-36" />
        ) : session && (
          <Link href="/recipes/new" className={buttonVariants({ variant: "default" })}>
            <Plus className="mr-2 h-4 w-4" /> Stvori recept
          </Link>
        )}
      </div>

      <RecipeFilters
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        allCategories={allCategories}
        selectedCategoryIds={selectedCategoryIds}
        onSelectedCategoryIdsChange={setSelectedCategoryIds}
        isLoadingCategories={isLoadingCategories}
        allAllergies={allAllergies}
        selectedAllergyIds={selectedAllergyIds}
        onSelectedAllergyIdsChange={setSelectedAllergyIds}
        isLoadingAllergies={isLoadingAllergies}
        maxPrepTime={maxPrepTime}
        onMaxPrepTimeChange={setMaxPrepTime}
        minServings={minServings}
        onMinServingsChange={setMinServings}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
      />

      <RecipeListDisplay
        isLoadingRecipes={isLoadingRecipes}
        filteredRecipes={filteredRecipes}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
      />
    </div>
  );
}