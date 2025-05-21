import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import type { InferSelectModel } from "drizzle-orm"
import { ingredient, unit } from "@/db/schema"

type Ingredient = InferSelectModel<typeof ingredient> & {
  unit: InferSelectModel<typeof unit>
}

interface RecipeIngredientsProps {
  ingredients: Ingredient[];
  servings: number;
}

export function RecipeIngredients({ ingredients, servings }: RecipeIngredientsProps) {
  return (
    <Card className='shadow-md'>
      <CardHeader className="pb-3">
        <CardTitle>Sastojci</CardTitle>
        <CardDescription>Za {servings} porcija</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {ingredients.map((ingredient) => (
            <li key={ingredient.id} className="flex items-center justify-between">
              <span className="text-foreground">{ingredient.name}</span>
              <span className="text-muted-foreground">
                {ingredient.quantity} {ingredient.unit.name} ({ingredient.unit.abbreviation})
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
