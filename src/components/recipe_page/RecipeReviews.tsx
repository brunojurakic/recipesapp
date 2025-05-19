import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";
import { User2 } from "lucide-react";
import type { InferSelectModel } from "drizzle-orm"
import { review, user } from "@/db/schema"

type Review = InferSelectModel<typeof review> & {
  user: Pick<InferSelectModel<typeof user>, 'name' | 'image'>
}

interface RecipeReviewsProps {
  reviews: Review[];
}

export function RecipeReviews({ reviews }: RecipeReviewsProps) {
  if (reviews.length === 0) return null;
  
  return (
    <Card className='shadow-md'>
      <CardHeader className="pb-3">
        <CardTitle>Reviews</CardTitle>
        <CardDescription>{reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-4 last:border-0 last:pb-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-muted-foreground">
                    {review.user.image ? (
                      <Image 
                        src={review.user.image} 
                        alt={review.user.name || ''}
                        width={32}
                        height={32}
                        className="rounded-full" 
                      />
                    ) : (
                      <User2 className="h-4 w-4" />
                    )}
                  </div>
                  <span className="font-medium">{review.user.name}</span>
                </div>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < review.rating ? 'text-yellow-500' : 'text-muted'}>★</span>
                  ))}
                </div>
              </div>
              {review.content && <p className="text-sm">{review.content}</p>}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
