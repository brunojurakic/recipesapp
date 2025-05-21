import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { CircleAlert } from "lucide-react";
import type { InferSelectModel } from "drizzle-orm"
import { allergy } from "@/db/schema"

interface RecipeAllergyInfo {
  allergy: InferSelectModel<typeof allergy>
}

interface RecipeAllergiesProps {
  allergies: RecipeAllergyInfo[];
}

export function RecipeAllergies({ allergies }: RecipeAllergiesProps) {
  if (allergies.length === 0) return null;
  
  return (
    <Card className='shadow-md'>
      <CardHeader>
        <div className='flex items-center gap-1'>
          <CardTitle>Informacije o alergenima</CardTitle>
          <CircleAlert className='h-4 w-4 text-red-600'/>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {allergies.map(({ allergy }) => (
            <Badge key={allergy.id} variant="outline">
              {allergy.name}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
