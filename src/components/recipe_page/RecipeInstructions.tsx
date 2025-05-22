import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import type { InferSelectModel } from "drizzle-orm"
import { instruction } from "@/db/schema"

type Instruction = InferSelectModel<typeof instruction>

interface RecipeInstructionsProps {
  instructions: Instruction[];
}

export function RecipeInstructions({ instructions }: RecipeInstructionsProps) {
  return (
    <Card className='shadow-xl'>
      <CardHeader className="pb-3">
        <CardTitle>Upute</CardTitle>
        <CardDescription>Korak po korak vodič</CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="space-y-6">
          {instructions.map((instruction) => (
            <li key={instruction.id} className="flex gap-4">
              <div className="flex-none">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground">
                  {instruction.stepNumber}
                </div>
              </div>
              <div className="flex-1">
                <p>{instruction.content}</p>
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
