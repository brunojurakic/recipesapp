"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect, SelectableItem } from "@/components/ui/multi-select";
import { Button } from "@/components/ui/button";
import { Search, XCircle } from "lucide-react";

interface RecipeFiltersProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  allCategories: SelectableItem[];
  selectedCategoryIds: string[];
  onSelectedCategoryIdsChange: (ids: string[]) => void;
  isLoadingCategories: boolean;
  allAllergies: SelectableItem[];
  selectedAllergyIds: string[];
  onSelectedAllergyIdsChange: (ids: string[]) => void;
  isLoadingAllergies: boolean;
  maxPrepTime: string;
  onMaxPrepTimeChange: (time: string) => void;
  minServings: string;
  onMinServingsChange: (servings: string) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export function RecipeFilters({
  searchTerm,
  onSearchTermChange,
  allCategories,
  selectedCategoryIds,
  onSelectedCategoryIdsChange,
  isLoadingCategories,
  allAllergies,
  selectedAllergyIds,
  onSelectedAllergyIdsChange,
  isLoadingAllergies,
  maxPrepTime,
  onMaxPrepTimeChange,
  minServings,
  onMinServingsChange,
  hasActiveFilters,
  onClearFilters,
}: RecipeFiltersProps) {
  return (
    <div className="mb-10 p-4 md:p-6 border rounded-lg shadow-sm bg-card">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="space-y-2">
          <Label htmlFor="searchName">Pretraži po nazivu</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="searchName"
              type="text"
              placeholder="Npr. Palačinke..."
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="categories">Kategorije</Label>
          <MultiSelect
            items={allCategories}
            selectedIds={selectedCategoryIds}
            onChange={onSelectedCategoryIdsChange}
            isLoading={isLoadingCategories}
            label="Kategorija"
            placeholder="Odaberite kategorije"
            searchPlaceholder="Pretraži kategorije..."
            emptyMessage="Nema kategorija."
            badgeVariant="outline"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="allergies">Izbjegavaj alergene</Label>
          <MultiSelect
            items={allAllergies}
            selectedIds={selectedAllergyIds}
            onChange={onSelectedAllergyIdsChange}
            isLoading={isLoadingAllergies}
            label="Alergen"
            placeholder="Odaberite alergene za izbjegavanje"
            searchPlaceholder="Pretraži alergene..."
            emptyMessage="Nema alergena."
            badgeVariant="outline"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxPrepTime">Max. vrijeme pripreme (min)</Label>
          <Input
            id="maxPrepTime"
            type="number"
            placeholder="Npr. 30"
            value={maxPrepTime}
            onChange={(e) => onMaxPrepTimeChange(e.target.value)}
            min="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="minServings">Min. broj porcija</Label>
          <Input
            id="minServings"
            type="number"
            placeholder="Npr. 4"
            value={minServings}
            onChange={(e) => onMinServingsChange(e.target.value)}
            min="1"
          />
        </div>

        <div className="sm:col-start-2 lg:col-start-3 flex items-end">
          {hasActiveFilters && (
            <Button onClick={onClearFilters} className="w-full">
              <XCircle className="mr-2 h-4 w-4" />
              Očisti filtere
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}