import type { Metadata } from 'next';
import CategoryCard from '@/components/CategoryCard';
import { getAllCategories } from '@/db/queries/category-queries';

export const metadata: Metadata = {
  title: 'ReceptiNet - Kulinarske Kategorije',
  description: 'Istražite sve kategorije jela na našoj platformi. Pronađite recepte prema kategorijama kao što su predjela, glavna jela, deserti i mnogo više.',
  keywords: ['kategorije jela', 'recepti po kategorijama', 'kulinarske kategorije', 'vrste jela', 'kuharstvo']
};

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div className="container mx-auto px-4 py-8 pt-25">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Kategorije jela
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Istražite našu kolekciju kategorija jela. Od tradicionalnih jela do deserta,
          pronađite recept koji odgovara vašem ukusu.
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            Trenutno nema dostupnih kategorija.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={{
                id: category.id,
                name: category.name,
                image_path: category.image_path,
                recipe_count: 0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
