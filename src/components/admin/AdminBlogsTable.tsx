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

interface Blog {
  id: string
  name: string
  description: string
  viewCount: number
  likeCount: number
  createdAt: string
  user: {
    name: string | null
    id: string
  }
}

export function AdminBlogsTable() {
  const [data, setData] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null)
  const [deleting, setDeleting] = useState(false)

  const columns: ColumnDef<Blog>[] = [
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
        const name = row.getValue("name") as string
        return (
          <div className="max-w-[200px] truncate" title={name}>
            {name}
          </div>
        )
      },
    },
    {
      accessorKey: "description",
      header: "Opis",
      cell: ({ row }) => {
        const description = row.getValue("description") as string
        return (
          <div className="max-w-[300px] truncate" title={description}>
            {description}
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
          id: string
        }
        return <div className="font-medium">{user?.name || "N/A"}</div>
      },
    },
    {
      accessorKey: "viewCount",
      header: "Pregledi",
      cell: ({ row }) => {
        const viewCount = row.getValue("viewCount") as number
        return <Badge variant="outline">{viewCount}</Badge>
      },
    },
    {
      accessorKey: "likeCount",
      header: "Lajkovi",
      cell: ({ row }) => {
        const likeCount = row.getValue("likeCount") as number
        return <Badge variant="outline">{likeCount}</Badge>
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
        const blog = row.original

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
                <Link href={`/blog/${blog.id}`} className="cursor-pointer">
                  <Eye className="mr-2 h-4 w-4" />
                  Pregledaj blog
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setBlogToDelete(blog)
                  setDeleteDialogOpen(true)
                }}
                className="text-red-600 cursor-pointer"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Obriši blog
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

  const loadBlogs = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/blogs")
      if (!response.ok) throw new Error("Failed to fetch blogs")
      const { blogs } = await response.json()
      setData(blogs)
    } catch (error) {
      console.error("Error loading blogs:", error)
      toast.error("Greška pri učitavanju blogova")
    } finally {
      setLoading(false)
    }
  }

  const deleteBlogAction = async () => {
    if (!blogToDelete) return

    try {
      setDeleting(true)
      const response = await fetch(
        `/api/admin/blogs?blogId=${blogToDelete.id}`,
        {
          method: "DELETE",
        },
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete blog")
      }

      toast.success("Blog je uspješno obrisan")
      setDeleteDialogOpen(false)
      setBlogToDelete(null)
      loadBlogs()
    } catch (error) {
      console.error("Error deleting blog:", error)
      toast.error(
        error instanceof Error ? error.message : "Greška pri brisanju bloga",
      )
    } finally {
      setDeleting(false)
    }
  }

  useEffect(() => {
    loadBlogs()
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
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="pl-10"
          />
        </div>
        <Button onClick={loadBlogs} variant="outline">
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
                  Nema blogova.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-1 text-sm text-muted-foreground">
          Prikazano {table.getRowModel().rows.length} od{" "}
          {table.getCoreRowModel().rows.length} ukupno blogova.
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
            <AlertDialogTitle>Obrisati blog?</AlertDialogTitle>
            <AlertDialogDescription>
              Jeste li sigurni da želite obrisati blog &quot;
              {blogToDelete?.name}&quot;? Ova akcija će trajno obrisati blog i
              sve povezane podatke.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Odustani</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteBlogAction}
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
