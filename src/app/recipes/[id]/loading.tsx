import { Skeleton } from "@/components/ui/skeleton"
import { Clock, Users, UserPen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="container max-w-7xl mx-auto py-10 px-4 sm:px-6 pt-20">
      <div className="inline-flex items-center text-sm mb-6 text-muted-foreground">
        <Skeleton className="h-4 w-4 mr-1" />
        <Skeleton className="h-4 w-32" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="relative h-[400px] w-full overflow-hidden rounded-xl mb-6">
              <Skeleton className="h-full w-full" />
            </div>
            
            <div className="space-y-4">
              <Skeleton className="h-9 w-3/4" />
              
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-6 w-16" />
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex items-center gap-2">
                  <UserPen className="h-4 w-4" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>

              <Skeleton className="h-4 w-full mt-6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
          
          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <CardTitle>Allergies</CardTitle>
              <CardDescription>Potential allergens in this recipe</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-8 w-20" />
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <CardTitle>Instructions</CardTitle>
              <CardDescription>Step by step guide</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-6">
                {[1, 2, 3, 4].map((i) => (
                  <li key={i} className="flex gap-4">
                    <div className="flex-none">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground">
                        {i}
                      </div>
                    </div>
                    <div className="flex-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-4/5 mt-2" />
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
          
          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <CardTitle>Reviews</CardTitle>
              <CardDescription>User feedback on this recipe</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[1, 2].map((i) => (
                  <div key={i} className="pb-6 border-b last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4 mt-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-8">
          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <CardTitle>Ingredients</CardTitle>
              <CardDescription>
                <Skeleton className="h-4 w-24" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <li key={i} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <CardTitle>Author</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-5 w-32" />
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-4">
            <Button disabled className="w-full" variant="default">
            </Button>
            <Button disabled className="w-full" variant="outline">
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
