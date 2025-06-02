import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"

interface Category {
  id: string
  name: string
  image_path: string
  recipe_count: number
}

interface CategoryCardProps {
  category: Category
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/recipes?categoryIds=${category.id}`}>
      <Card className="w-full max-w-sm overflow-hidden hover:shadow-lg transition-shadow duration-300 p-0 cursor-pointer">
        <div className="relative h-48 w-full">
          <Image
            src={category.image_path}
            alt={category.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold text-center mb-1">{category.name}</h3>
        </CardContent>
      </Card>
    </Link>
  )
}
