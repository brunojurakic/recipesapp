"use client"

import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, ChefHat, BookmarkIcon, BarChart3, Shield } from "lucide-react"

import { ProfileInfo } from "./ProfileInfo"
import { UserRecipes } from "./UserRecipes"
import { UserBookmarks } from "./UserBookmarks"
import { UserStats } from "./UserStats"
import { UserAllergiesManager } from "./UserAllergiesManager"

export function ProfilePage() {
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Profil</h1>
        <p className="text-muted-foreground">
          Upravljajte postavkama računa, receptima i preferencijama
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger
            value="profile"
            className="flex items-center gap-2 cursor-pointer"
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profil</span>
          </TabsTrigger>
          <TabsTrigger
            value="recipes"
            className="flex items-center gap-2 cursor-pointer"
          >
            <ChefHat className="h-4 w-4" />
            <span className="hidden sm:inline">Moji recepti</span>
          </TabsTrigger>
          <TabsTrigger
            value="bookmarks"
            className="flex items-center gap-2 cursor-pointer"
          >
            <BookmarkIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Spremljeno</span>
          </TabsTrigger>
          <TabsTrigger
            value="allergies"
            className="flex items-center gap-2 cursor-pointer"
          >
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Alergije</span>
          </TabsTrigger>
          <TabsTrigger
            value="stats"
            className="flex items-center gap-2 cursor-pointer"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Statistike</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <ProfileInfo />
        </TabsContent>

        <TabsContent value="recipes" className="space-y-6">
          <UserRecipes />
        </TabsContent>

        <TabsContent value="bookmarks" className="space-y-6">
          <UserBookmarks />
        </TabsContent>

        <TabsContent value="allergies" className="space-y-6">
          <UserAllergiesManager />
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <UserStats />
        </TabsContent>
      </Tabs>
    </div>
  )
}
