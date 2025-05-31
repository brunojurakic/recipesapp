"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect, SelectableItem } from "@/components/ui/multi-select";
import { Button } from "@/components/ui/button";
import { Search, XCircle, Loader2, Filter, ChevronDown, ChevronUp } from "lucide-react";

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
  ingredientSearch: string;
  onIngredientSearchChange: (search: string) => void;
  maxPrepTime: string;
  onMaxPrepTimeChange: (time: string) => void;
  minServings: string;
  onMinServingsChange: (servings: string) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  isFiltering?: boolean;
  initiallyExpanded?: boolean;
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
  ingredientSearch,
  onIngredientSearchChange,
  maxPrepTime,
  onMaxPrepTimeChange,
  minServings,
  onMinServingsChange,
  hasActiveFilters,
  onClearFilters,
  isFiltering = false,
  initiallyExpanded = false,
}: RecipeFiltersProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(initiallyExpanded);
  const hasActiveAdvancedFilters = Boolean(
    selectedCategoryIds.length > 0 ||
    selectedAllergyIds.length > 0 ||
    ingredientSearch ||
    maxPrepTime ||
    minServings
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 relative">
          {isFiltering ? (
            <Loader2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground animate-spin" />
          ) : (
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          )}
          <Input
            type="text"
            placeholder="Pretraži recepte po nazivu..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="pl-10 h-11"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="h-11 px-4 relative"
        >
          <Filter className="mr-2 h-4 w-4" />
          <span>Filteri</span>
          {hasActiveAdvancedFilters && (
            <span className="ml-1 inline-flex h-2 w-2 rounded-full bg-purple-500"></span>
          )}
          {showAdvancedFilters ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : (
            <ChevronDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      </div>
      {!showAdvancedFilters && hasActiveAdvancedFilters && (
        <div className="mb-4 p-3 bg-muted/50 rounded-md border">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>Aktivni filteri:</span>
            {selectedCategoryIds.length > 0 && (
              <span className="bg-background px-2 py-1 rounded border">
                {selectedCategoryIds.length} kategorij{selectedCategoryIds.length === 1 ? 'a' : 'e'}
              </span>
            )}
            {selectedAllergyIds.length > 0 && (
              <span className="bg-background px-2 py-1 rounded border">
                {selectedAllergyIds.length} alergen{selectedAllergyIds.length === 1 ? '' : 'a'}
              </span>
            )}
            {ingredientSearch && (
              <span className="bg-background px-2 py-1 rounded border">
                Sastojak: {ingredientSearch}
              </span>
            )}
            {maxPrepTime && (
              <span className="bg-background px-2 py-1 rounded border">
                Max. {maxPrepTime} min
              </span>
            )}
            {minServings && (
              <span className="bg-background px-2 py-1 rounded border">
                Min. {minServings} porcij{parseInt(minServings) === 1 ? 'a' : 'e'}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="h-6 px-2 text-xs"
            >
              <XCircle className="mr-1 h-3 w-3" />
              Očisti
            </Button>
          </div>
        </div>
      )}

      {showAdvancedFilters && (
        <div className="p-4 md:p-6 border rounded-lg shadow-sm bg-card mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            <div className="space-y-2">
              <Label htmlFor="ingredientSearch">Pretraži sastojke</Label>
              <Input
                id="ingredientSearch"
                type="text"
                placeholder="Npr. mlijeko, brašno..."
                value={ingredientSearch}
                onChange={(e) => onIngredientSearchChange(e.target.value)}
              />
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
                label="Alergena"
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
            </div>            <div className="sm:col-span-2 lg:col-span-2 xl:col-span-3 flex items-end justify-center">
              {hasActiveFilters && (
                <Button onClick={onClearFilters} className="w-full max-w-md">
                  <XCircle className="mr-2 h-4 w-4" />
                  Očisti filtere
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}