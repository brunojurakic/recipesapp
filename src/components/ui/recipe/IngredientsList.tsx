interface Ingredient {
  name: string;
  quantity: string;
}

interface IngredientsListProps {
  ingredients: Ingredient[];
  onIngredientChange: (index: number, field: "name" | "quantity", value: string) => void;
  onAddIngredient: () => void;
}

export function IngredientsList({ ingredients, onIngredientChange, onAddIngredient }: IngredientsListProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <label className="block text-sm font-medium text-zinc-700">Ingredients</label>
        <button
          type="button"
          onClick={onAddIngredient}
          className="text-sm text-zinc-600 hover:text-zinc-900"
        >
          + Add Ingredient
        </button>
      </div>
      {ingredients.map((ingredient, index) => (
        <div key={index} className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Ingredient"
            className="flex-1 rounded-md border border-zinc-300 px-3 py-2 focus:border-zinc-500 focus:outline-none focus:ring-zinc-500 sm:text-sm text-zinc-900 placeholder:text-zinc-500"
            value={ingredient.name}
            onChange={(e) => onIngredientChange(index, "name", e.target.value)}
          />
          <input
            type="text"
            placeholder="Quantity"
            className="w-32 rounded-md border border-zinc-300 px-3 py-2 focus:border-zinc-500 focus:outline-none focus:ring-zinc-500 sm:text-sm text-zinc-900 placeholder:text-zinc-500"
            value={ingredient.quantity}
            onChange={(e) => onIngredientChange(index, "quantity", e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}
