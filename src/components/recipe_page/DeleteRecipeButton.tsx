"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface DeleteRecipeButtonProps {
  recipeId: string;
}

export function DeleteRecipeButton({ recipeId }: DeleteRecipeButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete recipe");
      }

      toast.success("Recept je uspješno obrisan!");
      setIsOpen(false);

      router.push("/recipes");
    } catch (error) {
      console.error("Error deleting recipe:", error);
      toast.error(error instanceof Error ? error.message : "Greška pri brisanju recepta");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          <Trash2 className="mr-2 h-4 w-4" />
          Obriši recept
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Jeste li sigurni?</DialogTitle>
          <DialogDescription>
            Ova akcija se ne može poništiti. Recept će biti trajno obrisan zajedno sa svim komentarima i ocjenama.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isDeleting}
          >
            Odustani
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Brisanje...
              </>
            ) : (
              "Obriši"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
