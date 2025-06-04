"use client"

import { useState, useEffect } from "react"
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
  ChevronDown,
  ChevronUp,
  Trash2,
  ArrowUpDown,
  Search,
  Loader2,
  Eye,
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface Recipe {
  id: string
  title: string
  description: string
  servings: number
  preparationTime: number
  createdAt: string
  user: {
    name: string | null
    email: string | null
  }
}

export function AdminRecipesTable() {
  const [data, setData] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null)
  const [deleting, setDeleting] = useState(false)

  const columns: ColumnDef<Recipe>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => {
        const sortState = column.getIsSorted()
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0"
          >
            Naslov
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
        const title = row.getValue("title") as string
        return (
          <div className="max-w-[200px] truncate" title={title}>
            {title}
          </div>
        )
      },
    },
    {
      accessorKey: "user",
      header: "Autor",
      cell: ({ row }) => {
        const user = row.getValue("user") as {
          name: string | null
          email: string | null
        }
        return (
          <div>
            <div className="font-medium">{user?.name || "N/A"}</div>
            <div className="text-sm text-muted-foreground">
              {user?.email || "N/A"}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "servings",
      header: "Porcije",
      cell: ({ row }) => {
        const servings = row.getValue("servings") as number
        return <Badge variant="outline">{servings}</Badge>
      },
    },
    {
      accessorKey: "preparationTime",
      header: "Vrijeme",
      cell: ({ row }) => {
        const time = row.getValue("preparationTime") as number
        return <Badge variant="outline">{time} min</Badge>
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        const sortState = column.getIsSorted()
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0"
          >
            Objavljeno
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
        const date = new Date(row.getValue("createdAt"))
        return date.toLocaleDateString("hr-HR")
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const recipe = row.original

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
              <DropdownMenuItem asChild>
                <Link href={`/recipes/${recipe.id}`} className="cursor-pointer">
                  <Eye className="mr-2 h-4 w-4" />
                  Pregledaj recept
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setRecipeToDelete(recipe)
                  setDeleteDialogOpen(true)
                }}
                className="text-red-600 cursor-pointer"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Obriši recept
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

  const loadRecipes = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/recipes")
      if (!response.ok) throw new Error("Failed to fetch recipes")
      const { recipes } = await response.json()
      setData(recipes)
    } catch (error) {
      console.error("Error loading recipes:", error)
      toast.error("Greška pri učitavanju recepata")
    } finally {
      setLoading(false)
    }
  }

  const deleteRecipe = async () => {
    if (!recipeToDelete) return

    try {
      setDeleting(true)
      const response = await fetch(
        `/api/admin/recipes?recipeId=${recipeToDelete.id}`,
        {
          method: "DELETE",
        },
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete recipe")
      }

      toast.success("Recept je uspješno obrisan")
      setDeleteDialogOpen(false)
      setRecipeToDelete(null)
      loadRecipes()
    } catch (error) {
      console.error("Error deleting recipe:", error)
      toast.error(
        error instanceof Error ? error.message : "Greška pri brisanju recepta",
      )
    } finally {
      setDeleting(false)
    }
  }

  useEffect(() => {
    loadRecipes()
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
            placeholder="Pretraži po naslovu..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("title")?.setFilterValue(event.target.value)
            }
            className="pl-10"
          />
        </div>
        <Button onClick={loadRecipes} variant="outline">
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
                  Nema recepata.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-1 text-sm text-muted-foreground">
          Prikazano {table.getRowModel().rows.length} od{" "}
          {table.getCoreRowModel().rows.length} ukupno recepata.
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
            <AlertDialogTitle>Obrisati recept?</AlertDialogTitle>
            <AlertDialogDescription>
              Jeste li sigurni da želite obrisati recept &quot;
              {recipeToDelete?.title}&quot;? Ova akcija će trajno obrisati
              recept i sve povezane podatke.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Odustani</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteRecipe}
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
    </div>
  )
}
