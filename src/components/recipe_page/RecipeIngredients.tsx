import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"
import type { IngredientWithUnit } from "@/lib/types/database"

interface RecipeIngredientsProps {
  ingredients: IngredientWithUnit[]
  servings: number
}

export function RecipeIngredients({
  ingredients,
  servings,
}: RecipeIngredientsProps) {
  return (
    <Card className="shadow-xl">
      <CardHeader className="pb-3">
        <CardTitle>Sastojci</CardTitle>
        <CardDescription>Za {servings} porcija</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {ingredients.map((ingredient) => (
            <li
              key={ingredient.id}
              className="flex items-center justify-between"
            >
              <span className="text-foreground">{ingredient.name}</span>
              <span className="text-muted-foreground">
                {ingredient.quantity} {ingredient.unit.name} (
                {ingredient.unit.abbreviation})
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
