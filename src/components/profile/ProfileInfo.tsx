"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Camera } from "lucide-react";
import { profileFormSchema } from "@/lib/validations/profile-schema";
import type { User, ClassNameProps } from "@/lib/types";

export function ProfileInfo({ className }: ClassNameProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const fetchUserProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/profile");
      
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const userData = await response.json();
      setUser(userData);
      form.setValue("name", userData.name);
      setImagePreview(userData.image);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Došlo je do greške pri dohvaćanju profila.");
    } finally {
      setIsLoading(false);
    }
  }, [form]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    try {
      setIsSaving(true);
      
      const formData = new FormData();
      formData.append("name", values.name);
      
      if (image) {
        formData.append("image", image);
      }

      const response = await fetch("/api/profile", {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setImage(null);
      toast.success("Profil je uspješno ažuriran!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Došlo je do greške pri ažuriranju profila.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center p-6">
          <p className="text-muted-foreground">Greška pri učitavanju profila.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Informacije o profilu</CardTitle>
        <CardDescription>
          Uredite svoje ime i profilnu sliku.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <Avatar className="h-20 w-20 mx-auto sm:mx-0">
            <AvatarImage src={imagePreview || ""} alt={user.name} />
            <AvatarFallback className="text-lg">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="space-y-2 flex-1">
            <Label htmlFor="image">Profilna slika</Label>
            <div className="flex items-center gap-2">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="cursor-pointer flex-1 sm:w-auto"
              />
              <Camera className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </div>
            <p className="text-sm text-muted-foreground">
              PNG, JPG ili GIF (maks. 5MB)
            </p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ime</FormLabel>
                  <FormControl>
                    <Input placeholder="Vaše ime" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSaving} className="w-full">
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Spremanje...
                </>
              ) : (
                "Spremi promjene"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
