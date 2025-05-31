"use client";

import { useState, useEffect } from "react";
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
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ChevronDown, ChevronUp, Trash2, ArrowUpDown, Search, Loader2, UserCheck } from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: {
    name: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export function AdminUsersTable() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [promoting, setPromoting] = useState<string | null>(null);

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        const sortState = column.getIsSorted();
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0"
          >
            Ime
            {sortState === "asc" ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : sortState === "desc" ? (
              <ChevronDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        const sortState = column.getIsSorted();
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0"
          >
            Email
            {sortState === "asc" ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : sortState === "desc" ? (
              <ChevronDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
    },
    {
      accessorKey: "role",
      header: ({ column }) => {
        const sortState = column.getIsSorted();
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0"
          >
            Uloga
            {sortState === "asc" ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : sortState === "desc" ? (
              <ChevronDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        const role = row.getValue("role") as { name: string } | null;
        const roleName = role?.name || "Korisnik";
        
        const getBadgeVariant = (role: string) => {
          switch (role) {
            case "Admin":
              return "destructive";
            case "Moderator":
              return "default";
            default:
              return "outline";
          }
        };
        
        return (
          <Badge variant={getBadgeVariant(roleName)}>
            {roleName}
          </Badge>
        );
      },
      sortingFn: (rowA, rowB) => {
        const roleA = (rowA.getValue("role") as { name: string } | null)?.name || "Korisnik";
        const roleB = (rowB.getValue("role") as { name: string } | null)?.name || "Korisnik";
        return roleA.localeCompare(roleB, 'hr-HR');
      },
    },
    {
      accessorKey: "emailVerified",
      header: ({ column }) => {
        const sortState = column.getIsSorted();
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0"
          >
            Verificiran
            {sortState === "asc" ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : sortState === "desc" ? (
              <ChevronDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        const verified = row.getValue("emailVerified") as boolean;
        return (
          <Badge variant={verified ? "default" : "outline"}>
            {verified ? "Da" : "Ne"}
          </Badge>
        );
      },
      sortingFn: (rowA, rowB) => {
        const verifiedA = rowA.getValue("emailVerified") as boolean;
        const verifiedB = rowB.getValue("emailVerified") as boolean;
        return verifiedA === verifiedB ? 0 : verifiedA ? -1 : 1;
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        const sortState = column.getIsSorted();
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0"
          >
            Registriran
            {sortState === "asc" ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : sortState === "desc" ? (
              <ChevronDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return date.toLocaleDateString("hr-HR");
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;
        const isAdmin = user.role?.name === "Admin";
        const isModerator = user.role?.name === "Moderator";
        const isPromoting = promoting === user.id;

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
              {!isAdmin && !isModerator && (
                <DropdownMenuItem
                  onClick={() => promoteToModerator(user.id)}
                  className="cursor-pointer"
                  disabled={isPromoting}
                >
                  {isPromoting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <UserCheck className="mr-2 h-4 w-4" />
                  )}
                  {isPromoting ? "Promoviram..." : "Promoviraj u moderatora"}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => {
                  setUserToDelete(user);
                  setDeleteDialogOpen(true);
                }}
                className={`text-red-600 ${isAdmin ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                disabled={isAdmin}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Obriši korisnika
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

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
  });

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const { users } = await response.json();
      setData(users);
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Greška pri učitavanju korisnika");
    } finally {
      setLoading(false);
    }
  };
  const deleteUser = async () => {
    if (!userToDelete) return;

    try {
      setDeleting(true);
      const response = await fetch(`/api/admin/users?userId=${userToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete user");
      }

      toast.success("Korisnik je uspješno obrisan");
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      loadUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error instanceof Error ? error.message : "Greška pri brisanju korisnika");
    } finally {
      setDeleting(false);
    }
  };

  const promoteToModerator = async (userId: string) => {
    try {
      setPromoting(userId);
      const response = await fetch("/api/admin/users/promote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to promote user");
      }

      toast.success("Korisnik je uspješno promoviran u moderatora");
      loadUsers();
    } catch (error) {
      console.error("Error promoting user:", error);
      toast.error(error instanceof Error ? error.message : "Greška pri promoviranju korisnika");
    } finally {
      setPromoting(null);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Pretraži po emailu..."
            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("email")?.setFilterValue(event.target.value)
            }
            className="pl-10"
          />
        </div>
        <Button onClick={loadUsers} variant="outline">
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
                          header.getContext()
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
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Nema korisnika.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-1 text-sm text-muted-foreground">
          Prikazano {table.getRowModel().rows.length} od{" "}
          {table.getCoreRowModel().rows.length} ukupno korisnika.
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
            <AlertDialogTitle>Obrisati korisnika?</AlertDialogTitle>
            <AlertDialogDescription>
              Jeste li sigurni da želite obrisati korisnika {userToDelete?.name}? 
              Ova akcija će trajno obrisati korisnikov račun i sve povezane podatke.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Odustani</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteUser}
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
  );
}
