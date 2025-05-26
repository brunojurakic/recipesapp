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
import type { Category, Allergy, RecipeClient } from "@/lib/types/database";
import { useDebouncedCallback } from "use-debounce";

export default function RecipesPage() {
  const { data: sessionData, isPending: isSessionLoading } = useSession();
  const session = sessionData?.session;
  const [filteredRecipes, setFilteredRecipes] = useState<RecipeClient[]>([]);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedAllergyIds, setSelectedAllergyIds] = useState<string[]>([]);
  const [maxPrepTime, setMaxPrepTime] = useState<string>("");
  const [minServings, setMinServings] = useState<string>("");

  const [allCategories, setAllCategories] = useState<SelectableItem[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [allAllergies, setAllAllergies] = useState<SelectableItem[]>([]);
  const [isLoadingAllergies, setIsLoadingAllergies] = useState(true);
  const debouncedFetchRecipes = useDebouncedCallback(async (
    search: string,
    categoryIds: string[],
    allergyIds: string[],
    maxPrepTime: string,
    minServings: string
  ) => {
    try {
      if (isInitialLoad) {
        setIsLoadingRecipes(true);
      } else {
        setIsFiltering(true);
      }

      const params = new URLSearchParams();

      if (search.trim()) {
        params.append('search', search.trim());
      }
      if (categoryIds.length > 0) {
        params.append('categoryIds', categoryIds.join(','));
      }
      if (allergyIds.length > 0) {
        params.append('allergyIds', allergyIds.join(','));
      }
      if (maxPrepTime && parseInt(maxPrepTime, 10) > 0) {
        params.append('maxPrepTime', maxPrepTime);
      }
      if (minServings && parseInt(minServings, 10) > 0) {
        params.append('minServings', minServings);
      }

      const url = `/api/recipes${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to fetch recipes");
      }
      const data: RecipeClient[] = await res.json();
      setFilteredRecipes(data);

      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Greška pri dohvaćanju recepata.");
    } finally {
      setIsLoadingRecipes(false);
      setIsFiltering(false);
    }
  }, 500);

  useEffect(() => {
    debouncedFetchRecipes("", [], [], "", "");
  }, [debouncedFetchRecipes]);

  useEffect(() => {
    debouncedFetchRecipes(searchTerm, selectedCategoryIds, selectedAllergyIds, maxPrepTime, minServings);
  }, [searchTerm, selectedCategoryIds, selectedAllergyIds, maxPrepTime, minServings, debouncedFetchRecipes]);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setIsLoadingCategories(true);
        const catRes = await fetch("/api/categories");
        if (!catRes.ok) {
          throw new Error("Failed to fetch categories");
        }
        const categoriesData = await catRes.json();
        setAllCategories(categoriesData.map((c: Category) => ({ id: c.id, name: c.name })));
      } catch (error) {
        console.error(error);
        toast.error("Greška pri dohvaćanju kategorija.");
      } finally {
        setIsLoadingCategories(false);
      }

      try {
        setIsLoadingAllergies(true);
        const algRes = await fetch("/api/allergies");
        if (!algRes.ok) {
          throw new Error("Failed to fetch allergies");
        }
        const allergiesData = await algRes.json();
        setAllAllergies(allergiesData.map((a: Allergy) => ({ id: a.id, name: a.name })));
      } catch (error) {
        console.error(error);
        toast.error("Greška pri dohvaćanju alergena.");
      } finally {
        setIsLoadingAllergies(false);
      }

      if (session) {
        try {
          const userAllergiesRes = await fetch("/api/user-allergies");
          if (userAllergiesRes.ok) {
            const userAllergiesData = await userAllergiesRes.json();
            const userAllergyIds = userAllergiesData.userAllergies.map((a: Allergy) => a.id);
            setSelectedAllergyIds(userAllergyIds);
          }
        } catch (error) {
          console.error("Error fetching user allergies:", error);
        }
      }
    };

    fetchFilterOptions();
  }, [session]);

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
        isFiltering={isFiltering}
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