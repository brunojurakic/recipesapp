"use client";

import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, ChefHat, MessageSquare, Shield } from "lucide-react";
import { AdminRecipesTable } from "@/components/admin/AdminRecipesTable";
import { AdminReviewsTable } from "@/components/admin/AdminReviewsTable";

interface User {
  id: string;
  name: string;
  email: string;
  role: {
    id: string;
    name: string;
  };
}

export default function ModeratorPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const response = await fetch("/api/moderator/check");
        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            redirect("/");
          }
          throw new Error(data.error || "Failed to check access");
        }

        setUser(data.user);
      } catch (err) {
        console.error("Access check error:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="text-lg font-medium text-gray-600">Provjera dozvola...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Pristup odbijen</h1>
          <p className="text-gray-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-25">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-8 w-8 text-black" />
          <h1 className="text-3xl font-bold">Moderatorski Panel</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Dobrodošli, {user?.name}
              <Badge variant="default">{user?.role?.name}</Badge>
            </CardTitle>
            <CardDescription>
              Upravljajte receptima i recenzijama kako biste održali kvalitetu sadržaja na platformi.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="recipes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recipes" className="flex items-center gap-2 hover:cursor-pointer">
            <ChefHat className="h-4 w-4" />
            Recepti
          </TabsTrigger>
          <TabsTrigger value="reviews" className="flex items-center gap-2 hover:cursor-pointer">
            <MessageSquare className="h-4 w-4" />
            Recenzije
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recipes">
          <Card>
            <CardHeader>
              <CardTitle>Upravljanje Receptima</CardTitle>
              <CardDescription>
                Pregledajte i moderirajte prijave recepata kako biste osigurali kvalitetan sadržaj.
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
              <CardTitle>Upravljanje Recenzijama</CardTitle>
              <CardDescription>
                Nadzrite i moderirajte korisničke recenzije kako biste održali standarde zajednice.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdminReviewsTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
