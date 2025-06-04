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
  Star,
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface Review {
  id: string
  content: string
  rating: number
  createdAt: string
  user: {
    name: string | null
    email: string | null
  }
  recipe: {
    id: string
    title: string
  }
}

export function AdminReviewsTable() {
  const [data, setData] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null)
  const [deleting, setDeleting] = useState(false)

  const columns: ColumnDef<Review>[] = [
    {
      accessorKey: "user",
      header: "Korisnik",
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
      accessorKey: "recipe",
      header: "Recept",
      cell: ({ row }) => {
        const recipe = row.getValue("recipe") as { id: string; title: string }
        return (
          <div className="max-w-[200px] truncate" title={recipe?.title}>
            {recipe?.title || "N/A"}
          </div>
        )
      },
    },
    {
      accessorKey: "rating",
      header: ({ column }) => {
        const sortState = column.getIsSorted()
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0"
          >
            Ocjena
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
        const rating = row.getValue("rating") as number
        return (
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{rating}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "content",
      header: "Sadržaj",
      cell: ({ row }) => {
        const content = row.getValue("content") as string
        return (
          <div className="max-w-[300px] truncate" title={content}>
            {content}
          </div>
        )
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
        const review = row.original

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
                <Link
                  href={`/recipes/${review.recipe.id}`}
                  className="cursor-pointer"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Pregledaj recept
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setReviewToDelete(review)
                  setDeleteDialogOpen(true)
                }}
                className="text-red-600 cursor-pointer"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Obriši recenziju
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

  const loadReviews = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/reviews")
      if (!response.ok) throw new Error("Failed to fetch reviews")
      const { reviews } = await response.json()
      setData(reviews)
    } catch (error) {
      console.error("Error loading reviews:", error)
      toast.error("Greška pri učitavanju recenzija")
    } finally {
      setLoading(false)
    }
  }

  const deleteReview = async () => {
    if (!reviewToDelete) return

    try {
      setDeleting(true)
      const response = await fetch(
        `/api/admin/reviews?reviewId=${reviewToDelete.id}`,
        {
          method: "DELETE",
        },
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete review")
      }

      toast.success("Recenzija je uspješno obrisana")
      setDeleteDialogOpen(false)
      setReviewToDelete(null)
      loadReviews()
    } catch (error) {
      console.error("Error deleting review:", error)
      toast.error(
        error instanceof Error
          ? error.message
          : "Greška pri brisanju recenzije",
      )
    } finally {
      setDeleting(false)
    }
  }

  useEffect(() => {
    loadReviews()
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
            placeholder="Pretraži po sadržaju..."
            value={
              (table.getColumn("content")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("content")?.setFilterValue(event.target.value)
            }
            className="pl-10"
          />
        </div>
        <Button onClick={loadReviews} variant="outline">
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
                  Nema recenzija.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-1 text-sm text-muted-foreground">
          Prikazano {table.getRowModel().rows.length} od{" "}
          {table.getCoreRowModel().rows.length} ukupno recenzija.
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
            <AlertDialogTitle>Obrisati recenziju?</AlertDialogTitle>
            <AlertDialogDescription>
              Jeste li sigurni da želite obrisati ovu recenziju? Ova akcija će
              trajno obrisati recenziju.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Odustani</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteReview}
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
