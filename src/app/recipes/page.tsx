import Link from 'next/link'
import { db } from '@/db/drizzle'
import { recipe, user, category } from '@/db/schema'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { desc, InferSelectModel } from 'drizzle-orm'
import Image from 'next/image'

type Recipe = InferSelectModel<typeof recipe> & {
  user: InferSelectModel<typeof user>;
  categories: {
    category: InferSelectModel<typeof category>;
  }[];
};

export default async function RecipesPage() {
  const recipes: Recipe[] = await db.query.recipe.findMany({
    with: {
      user: true,
      categories: {
        with: {
          category: true
        }
      }
    },
    orderBy: [desc(recipe.createdAt)]
  });

  return (
    <div className='max-w-6xl mx-auto p-6 pt-25'>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Recipes</h1>
        <Link 
          href="/recipes/new" 
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md transition-colors"
        >
          Create Recipe
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <Link 
            href={`/recipes/${recipe.id}`} 
            key={recipe.id}
            className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
          >
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 h-full hover:scale-[1.02]">
              <div className="relative h-48 w-full bg-muted">
                <Image
                  src={recipe.image_path}
                  alt={recipe.title}
                  fill
                  className="object-cover transition-opacity duration-200"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-recipe.jpg';
                  }}
                />
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-2">{recipe.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {recipe.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {recipe.categories.slice(0, 3).map(({ category }) => (
                    <span 
                      key={category.id}
                      className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full"
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between text-sm text-muted-foreground mt-auto">
                <div className="flex items-center gap-2">
                  {recipe.user.image && (
                    <Image
                      src={recipe.user.image}
                      alt={recipe.user.name || ""}
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                  )}
                  <span>By {recipe.user.name}</span>
                </div>
                <time dateTime={recipe.createdAt.toISOString()}>
                  {new Date(recipe.createdAt).toLocaleDateString()}
                </time>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}