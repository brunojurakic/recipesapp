import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";
import { ChefHat } from "lucide-react";
import type { InferSelectModel } from "drizzle-orm"
import { user } from "@/db/schema"

type User = Pick<InferSelectModel<typeof user>, 'name' | 'image'>

interface RecipeAuthorProps {
  user: User;
}

export function RecipeAuthor({ user }: RecipeAuthorProps) {
  return (
    <Card className='shadow-xl'>
      <CardHeader className="pb-3">
        <CardTitle>O autoru</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
          {user.image ? (
            <Image 
              src={user.image} 
              alt={user.name || ''}
              width={56}
              height={56}
              className="rounded-full" 
            />
          ) : (
            <ChefHat className="h-8 w-8 text-muted-foreground" />
          )}
        </div>
        <div>
          <h4 className="font-medium">{user.name}</h4>
          <p className="text-sm text-muted-foreground">Kuhar</p>
        </div>
      </CardContent>
    </Card>
  );
}
