"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MultiSelect, SelectableItem } from "@/components/ui/multi-select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Allergy extends SelectableItem {
  id: string;
  name: string;
}

interface UserAllergiesManagerProps {
  className?: string;
}

export function UserAllergiesManager({ className }: UserAllergiesManagerProps) {
  const [allAllergies, setAllAllergies] = useState<Allergy[]>([]);
  const [userAllergies, setUserAllergies] = useState<Allergy[]>([]);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchAllergies();
  }, []);

  const fetchAllergies = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/user-allergies");
      
      if (!response.ok) {
        throw new Error("Failed to fetch allergies");
      }

      const data = await response.json();
      setAllAllergies(data.allAllergies);
      setUserAllergies(data.userAllergies);
      setSelectedAllergies(data.userAllergies.map((allergy: Allergy) => allergy.id));
    } catch (error) {
      console.error("Error fetching allergies:", error);
      toast.error("Došlo je do greške pri dohvaćanju alergija.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAllergyChange = (allergyIds: string[]) => {
    setSelectedAllergies(allergyIds);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const response = await fetch("/api/user-allergies", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ allergyIds: selectedAllergies }),
      });

      if (!response.ok) {
        throw new Error("Failed to update allergies");
      }

      toast.success("Alergije su uspješno ažurirane!");
      await fetchAllergies();
    } catch (error) {
      console.error("Error updating allergies:", error);
      toast.error("Došlo je do greške pri ažuriranju alergija.");
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = () => {
    const currentUserAllergyIds = userAllergies.map(allergy => allergy.id).sort();
    const selectedAllergyIds = [...selectedAllergies].sort();
    return JSON.stringify(currentUserAllergyIds) !== JSON.stringify(selectedAllergyIds);
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

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Moje alergije</CardTitle>
        <CardDescription>
          Odaberite alergije koje imate kako biste filtrirali recepte koji ih sadrže.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <MultiSelect
          items={allAllergies}
          selectedIds={selectedAllergies}
          onChange={handleAllergyChange}
          isLoading={false}
          label="Alergija"
          placeholder="Odaberite alergije koje imate"
          searchPlaceholder="Pretraži alergije..."
          emptyMessage="Nema pronađenih alergija."
          badgeVariant="secondary"
        />
        
        {hasChanges() && (
          <div className="pt-4 border-t">
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="w-full"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Spremanje...
                </>
              ) : (
                "Spremi promjene"
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
