"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  ChevronDown,
  ChevronUp,
  Trash2,
  ArrowUpDown,
  Search,
  Loader2,
  Plus,
  PencilIcon,
} from "lucide-react"
import { toast } from "sonner"
import { updateCategorySchema } from "@/lib/schemas/admin"

interface Category {
  id: string
  name: string
  image_path: string
  recipeCount: number
}

export function AdminCategoriesTable() {
  const [data, setData] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  )
  const [deleting, setDeleting] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryImage, setNewCategoryImage] = useState<File | null>(null)
  const [editCategoryImage, setEditCategoryImage] = useState<File | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [adding, setAdding] = useState(false)
  const [updating, setUpdating] = useState(false)
  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "image_path",
      header: "Slika",
      cell: ({ row }) => {
        const imagePath = row.getValue("image_path") as string
        return (
          <div className="w-16 h-16 relative">
            {imagePath ? (
              <Image
                src={imagePath}
                alt={row.original.name}
                fill
                className="object-cover rounded-md"
              />
            ) : (
              <div className="w-full h-full bg-muted rounded-md flex items-center justify-center">
                <span className="text-xs text-muted-foreground">
                  Nema slike
                </span>
              </div>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        const sortState = column.getIsSorted()
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0"
          >
            Naziv
            {sortState === "asc" ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : sortState === "desc" ? (
              <ChevronDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        )
      },
    },
    {
      accessorKey: "recipeCount",
      header: ({ column }) => {
        const sortState = column.getIsSorted()
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0"
          >
            Broj recepata
            {sortState === "asc" ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : sortState === "desc" ? (
              <ChevronDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        )
      },
      cell: ({ row }) => {
        const recipeCount = row.getValue("recipeCount") as number
        return <Badge variant="outline">{recipeCount}</Badge>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const category = row.original
        const canDelete = category.recipeCount === 0

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 px-3 cursor-pointer text-sm"
              >
                <span className="flex items-center">
                  <span className="sr-only">Otvori izbornik</span>
                  Akcije
                  <ChevronDown className="ml-1 h-3 w-3" />
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setEditingCategory(category)
                  setNewCategoryName(category.name)
                  setIsEditDialogOpen(true)
                }}
                className="cursor-pointer"
              >
                <PencilIcon className="mr-2 h-4 w-4" />
                Uredi kategoriju
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  if (canDelete) {
                    setCategoryToDelete(category)
                    setDeleteDialogOpen(true)
                  }
                }}
                className={"text-red-600 cursor-pointer"}
                disabled={!canDelete}
              >
                <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                Obriši kategoriju
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  const loadCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/categories")
      if (!response.ok) throw new Error("Failed to fetch categories")
      const { categories } = await response.json()
      setData(categories)
    } catch (error) {
      console.error("Error loading categories:", error)
      toast.error("Greška pri učitavanju kategorija")
    } finally {
      setLoading(false)
    }
  }

  const deleteCategory = async () => {
    if (!categoryToDelete) return

    try {
      setDeleting(true)
      const response = await fetch(
        `/api/admin/categories?categoryId=${categoryToDelete.id}`,
        {
          method: "DELETE",
        },
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete category")
      }

      toast.success("Kategorija je uspješno obrisana")
      setDeleteDialogOpen(false)
      setCategoryToDelete(null)
      loadCategories()
    } catch (error) {
      console.error("Error deleting category:", error)
      toast.error(
        error instanceof Error
          ? error.message
          : "Greška pri brisanju kategorije",
      )
    } finally {
      setDeleting(false)
    }
  }
  const addCategory = async () => {
    if (!newCategoryImage) {
      toast.error("Slika je obavezna")
      return
    }

    try {
      setAdding(true)

      const formData = new FormData()
      formData.append("name", newCategoryName)
      formData.append("image", newCategoryImage)

      const response = await fetch("/api/admin/categories", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to add category")
      }

      toast.success("Kategorija je uspješno dodana")
      setIsAddDialogOpen(false)
      setNewCategoryName("")
      setNewCategoryImage(null)
      loadCategories()
    } catch (error) {
      console.error("Error adding category:", error)
      toast.error(
        error instanceof Error
          ? error.message
          : "Greška pri dodavanju kategorije",
      )
    } finally {
      setAdding(false)
    }
  }
  const updateCategory = async () => {
    if (!editingCategory) return

    try {
      setUpdating(true)

      if (editCategoryImage) {
        const formData = new FormData()
        formData.append("name", newCategoryName)
        formData.append("image", editCategoryImage)

        const response = await fetch(
          `/api/admin/categories?categoryId=${editingCategory.id}`,
          {
            method: "PUT",
            body: formData,
          },
        )

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Failed to update category")
        }
      } else {
        const validationResult = updateCategorySchema.safeParse({
          name: newCategoryName,
        })

        if (!validationResult.success) {
          const errorMessage =
            validationResult.error.errors[0]?.message || "Neispravni podaci"
          toast.error(errorMessage)
          return
        }

        const response = await fetch(
          `/api/admin/categories?categoryId=${editingCategory.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(validationResult.data),
          },
        )

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Failed to update category")
        }
      }

      toast.success("Kategorija je uspješno ažurirana")
      setIsEditDialogOpen(false)
      setEditingCategory(null)
      setNewCategoryName("")
      setEditCategoryImage(null)
      loadCategories()
    } catch (error) {
      console.error("Error updating category:", error)
      toast.error(
        error instanceof Error
          ? error.message
          : "Greška pri ažuriranju kategorije",
      )
    } finally {
      setUpdating(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Pretraži po nazivu..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="pl-10"
          />
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} variant="default">
          <Plus className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Nova kategorija</span>
        </Button>
        <Button onClick={loadCategories} variant="outline">
          Osvježi
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nema kategorija.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-1 text-sm text-muted-foreground">
          Prikazano {table.getRowModel().rows.length} od{" "}
          {table.getCoreRowModel().rows.length} ukupno kategorija.
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Prethodno
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Sljedeće
          </Button>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Obrisati kategoriju?</AlertDialogTitle>
            <AlertDialogDescription>
              Jeste li sigurni da želite obrisati kategoriju &quot;
              {categoryToDelete?.name}&quot;? Ova akcija će trajno obrisati
              kategoriju.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Odustani</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteCategory}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Brišem...
                </>
              ) : (
                "Obriši"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova kategorija</DialogTitle>
            <DialogDescription>
              Dodajte novu kategoriju jela. Naziv kategorije mora biti
              jedinstven.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Naziv kategorije</Label>
              <Input
                id="name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Unesite naziv kategorije..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">Slika kategorije *</Label>
              <div className="flex flex-col gap-2">
                <div className="relative">
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setNewCategoryImage(e.target.files?.[0] || null)
                    }
                    className="sr-only"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("image")?.click()}
                    className="w-full justify-start text-left font-normal"
                  >
                    {newCategoryImage ? (
                      <span className="text-green-600">
                        ✓ {newCategoryImage.name}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        Odaberite sliku...
                      </span>
                    )}
                  </Button>
                </div>
                {!newCategoryImage && (
                  <p className="text-xs text-muted-foreground">
                    Molimo odaberite sliku za kategoriju.
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            {" "}
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false)
                setNewCategoryName("")
                setNewCategoryImage(null)
              }}
            >
              Odustani
            </Button>
            <Button onClick={addCategory} disabled={adding}>
              {adding ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Dodavanje...
                </>
              ) : (
                "Dodaj kategoriju"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Uredi kategoriju</DialogTitle>
            <DialogDescription>
              Izmijenite naziv kategorije jela. Naziv kategorije mora biti
              jedinstven.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Naziv kategorije</Label>
              <Input
                id="edit-name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Unesite naziv kategorije..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-image">
                Nova slika kategorije (opcionalno)
              </Label>
              <div className="flex flex-col gap-2">
                <div className="relative">
                  <input
                    id="edit-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setEditCategoryImage(e.target.files?.[0] || null)
                    }
                    className="sr-only"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById("edit-image")?.click()
                    }
                    className="w-full justify-start text-left font-normal"
                  >
                    {editCategoryImage ? (
                      <span className="text-green-600">
                        ✓ {editCategoryImage.name}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        Odaberite novu sliku...
                      </span>
                    )}
                  </Button>
                </div>
                {editingCategory && !editCategoryImage && (
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 relative">
                      <Image
                        src={editingCategory.image_path}
                        alt={editingCategory.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Trenutna slika će ostati ako ne odaberete novu.
                    </p>
                  </div>
                )}
                {editCategoryImage && (
                  <p className="text-xs text-green-600">Nova slika odabrana.</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            {" "}
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false)
                setEditingCategory(null)
                setNewCategoryName("")
                setEditCategoryImage(null)
              }}
            >
              Odustani
            </Button>
            <Button onClick={updateCategory} disabled={updating}>
              {updating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ažuriranje...
                </>
              ) : (
                "Spremi promjene"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
