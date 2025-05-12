import Image from 'next/image'
import Link from 'next/link'

interface RecipeCardProps {
  title: string
  description: string
  image: string | null
  cookTime: number
  category?: string
  href: string
}

export default function RecipeCard({ title, description, image, cookTime, category, href }: RecipeCardProps) {
  return (
    <Link href={href} className="group">
      <div className="overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:shadow-lg">
        <div className="relative h-48 w-full">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-zinc-100 flex items-center justify-center">
              <span className="text-zinc-400">No image</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-500">{cookTime} min</span>
            {category && (
              <>
                <span className="text-zinc-300">•</span>
                <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-600">
                  {category}
                </span>
              </>
            )}
          </div>
          <h3 className="mt-2 font-semibold text-zinc-800">{title}</h3>
          <p className="mt-1 text-sm text-zinc-600 line-clamp-2">{description}</p>
        </div>
      </div>
    </Link>
  )
}
