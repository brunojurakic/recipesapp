"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Users, ChefHat, MessageSquare, Bookmark, Star } from "lucide-react";
import { AdminUsersTable } from "@/components/admin/AdminUsersTable";
import { AdminRecipesTable } from "@/components/admin/AdminRecipesTable";
import { AdminReviewsTable } from "@/components/admin/AdminReviewsTable";

interface DashboardStats {
  totalUsers: number;
  totalRecipes: number;
  totalReviews: number;
  totalBookmarks: number;
  newUsers30Days: number;
  newRecipes30Days: number;
  averageRating: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const response = await fetch("/api/admin/check");
        if (response.status === 401) {
          router.push("/login");
          return;
        }
        if (response.status === 403) {
          setError("Nemate dozvolu za pristup admin panelu.");
          router.push("/");
          setLoading(false);
          return;
        }
        if (!response.ok) {
          throw new Error("Failed to check admin access");
        }

        const statsResponse = await fetch("/api/admin/stats");
        if (!statsResponse.ok) {
          throw new Error("Failed to load dashboard stats");
        }

        const { stats: dashboardStats } = await statsResponse.json();
        setStats(dashboardStats);
        setLoading(false);
      } catch (err) {
        console.error("Error loading admin dashboard:", err);
        setError("Greška pri učitavanju admin panela.");
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="text-lg font-medium">Učitavanje admin panela...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screenflex items-center justify-center p-4">
        <Alert className="max-w-md">
          <AlertDescription className="text-center">{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-8 px-4 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Admin Panel</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Upravljanje korisnicima, receptima i recenzijama
          </p>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ukupno korisnika</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  +{stats.newUsers30Days} u zadnjih 30 dana
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ukupno recepata</CardTitle>
                <ChefHat className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalRecipes}</div>
                <p className="text-xs text-muted-foreground">
                  +{stats.newRecipes30Days} u zadnjih 30 dana
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ukupno recenzija</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalReviews}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  {stats.averageRating} prosječna ocjena
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ukupno oznaka</CardTitle>
                <Bookmark className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalBookmarks}</div>
                <p className="text-xs text-muted-foreground">
                  Omiljeni recepti korisnika
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users" className="flex items-center gap-2 cursor-pointer">
              <Users className="h-4 w-4" />
              Korisnici
            </TabsTrigger>
            <TabsTrigger value="recipes" className="flex items-center gap-2 cursor-pointer">
              <ChefHat className="h-4 w-4" />
              Recepti
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2 cursor-pointer">
              <MessageSquare className="h-4 w-4" />
              Recenzije
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Upravljanje korisnicima</CardTitle>
                <CardDescription>
                  Pregledajte i upravljajte korisničkim računima
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminUsersTable />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recipes">
            <Card>
              <CardHeader>
                <CardTitle>Upravljanje receptima</CardTitle>
                <CardDescription>
                  Pregledajte i upravljajte objavljenim receptima
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminRecipesTable />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Upravljanje recenzijama</CardTitle>
                <CardDescription>
                  Pregledajte i moderirajte korisničke recenzije
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminReviewsTable />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
