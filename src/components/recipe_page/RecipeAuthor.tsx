import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
        <Avatar className="h-14 w-14">
          {user.image ? (
            <AvatarImage 
              src={user.image} 
              alt={user.name}
            />
          ) : null}
          <AvatarFallback className="bg-muted">
            <ChefHat className="h-8 w-8 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-medium">{user.name}</h4>
          <p className="text-sm text-muted-foreground">Autor</p>
        </div>
      </CardContent>
    </Card>
  );
}
