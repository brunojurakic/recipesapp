"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Loader2, Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface DeleteBlogButtonProps {
  blogId: string
}

export function DeleteBlogButton({ blogId }: DeleteBlogButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const response = await fetch(`/api/blog/${blogId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Nemate dozvolu za brisanje ovog članka.")
          return
        }
        throw new Error("Failed to delete blog")
      }

      toast.success("Članak je uspješno obrisan")
      router.push("/blog")
    } catch (error) {
      console.error("Error deleting blog:", error)
      toast.error("Došlo je do greške pri brisanju članka.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full" disabled={isDeleting}>
          {isDeleting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Brisanje...
            </>
          ) : (
            <>
              <Trash2 className="mr-2 h-4 w-4" />
              Obriši članak
            </>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Jeste li sigurni?</AlertDialogTitle>
          <AlertDialogDescription>
            Ova radnja se ne može poništiti. Članak će biti trajno obrisan iz
            baze podataka.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Odustani</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            Obriši članak
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
