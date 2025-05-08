import Image from 'next/image'
import Link from 'next/link'

interface RecipeCardProps {
  title: string
  description: string
  image: string
  cookTime: string
  category: string
  slug: string
}

export default function RecipeCard({ title, description, image, cookTime, category, slug }: RecipeCardProps) {
  return (
    <Link href={`/recipes/${slug}`} className="group">
      <div className="overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:shadow-lg dark:bg-zinc-900">
        <div className="relative h-48 w-full">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-500">{cookTime}</span>
            <span className="text-zinc-300">•</span>
            <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              {category}
            </span>
          </div>
          <h3 className="mt-2 font-semibold text-zinc-800 dark:text-zinc-100">{title}</h3>
          <p className="mt-1 text-sm text-zinc-600 line-clamp-2 dark:text-zinc-400">{description}</p>
        </div>
      </div>
    </Link>
  )
}
