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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp, Trash2, ArrowUpDown, Search, Loader2, Plus, PencilIcon } from "lucide-react";
import { toast } from "sonner";
import { createAllergySchema, updateAllergySchema } from '@/lib/schemas/admin';

interface Allergy {
  id: string;
  name: string;
  userCount: number;
  recipeCount: number;
}

export function AdminAllergiesTable() {
  const [data, setData] = useState<Allergy[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [allergyToDelete, setAllergyToDelete] = useState<Allergy | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newAllergyName, setNewAllergyName] = useState("");
  const [editingAllergy, setEditingAllergy] = useState<Allergy | null>(null);
  const [adding, setAdding] = useState(false);
  const [updating, setUpdating] = useState(false);

  const columns: ColumnDef<Allergy>[] = [
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
            Naziv
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
      accessorKey: "userCount",
      header: ({ column }) => {
        const sortState = column.getIsSorted();
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0"
          >
            Broj korisnika
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
        const userCount = row.getValue("userCount") as number;
        return <Badge variant="outline">{userCount}</Badge>;
      },
    },
    {
      accessorKey: "recipeCount",
      header: ({ column }) => {
        const sortState = column.getIsSorted();
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
        );
      },
      cell: ({ row }) => {
        const recipeCount = row.getValue("recipeCount") as number;
        return <Badge variant="outline">{recipeCount}</Badge>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const allergy = row.original;
        const canDelete = allergy.userCount === 0 && allergy.recipeCount === 0;

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
                  setEditingAllergy(allergy);
                  setNewAllergyName(allergy.name);
                  setIsEditDialogOpen(true);
                }}
                className="cursor-pointer"
              >
                <PencilIcon className="mr-2 h-4 w-4" />
                Uredi alergiju
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  if (canDelete) {
                    setAllergyToDelete(allergy);
                    setDeleteDialogOpen(true);
                  }
                }}
                className={'text-red-600 cursor-pointer'}
                disabled={!canDelete}
              >
                <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                Obriši alergiju
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

  const loadAllergies = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/allergies");
      if (!response.ok) throw new Error("Failed to fetch allergies");
      const { allergies } = await response.json();
      setData(allergies);
    } catch (error) {
      console.error("Error loading allergies:", error);
      toast.error("Greška pri učitavanju alergija");
    } finally {
      setLoading(false);
    }
  };

  const deleteAllergy = async () => {
    if (!allergyToDelete) return;

    try {
      setDeleting(true);
      const response = await fetch(`/api/admin/allergies?allergyId=${allergyToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete allergy");
      }

      toast.success("Alergija je uspješno obrisana");
      setDeleteDialogOpen(false);
      setAllergyToDelete(null);
      loadAllergies();
    } catch (error) {
      console.error("Error deleting allergy:", error);
      toast.error(error instanceof Error ? error.message : "Greška pri brisanju alergije");
    } finally {
      setDeleting(false);
    }
  };

  const addAllergy = async () => {
    const validationResult = createAllergySchema.safeParse({ name: newAllergyName });
    
    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors[0]?.message || "Neispravni podaci";
      toast.error(errorMessage);
      return;
    }

    try {
      setAdding(true);
      const response = await fetch("/api/admin/allergies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validationResult.data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add allergy");
      }

      toast.success("Alergija je uspješno dodana");
      setIsAddDialogOpen(false);
      setNewAllergyName("");
      loadAllergies();
    } catch (error) {
      console.error("Error adding allergy:", error);
      toast.error(error instanceof Error ? error.message : "Greška pri dodavanju alergije");
    } finally {
      setAdding(false);
    }
  };

  const updateAllergy = async () => {
    if (!editingAllergy) return;

    const validationResult = updateAllergySchema.safeParse({ name: newAllergyName });
    
    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors[0]?.message || "Neispravni podaci";
      toast.error(errorMessage);
      return;
    }

    try {
      setUpdating(true);
      const response = await fetch(`/api/admin/allergies?allergyId=${editingAllergy.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validationResult.data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update allergy");
      }

      toast.success("Alergija je uspješno ažurirana");
      setIsEditDialogOpen(false);
      setEditingAllergy(null);
      setNewAllergyName("");
      loadAllergies();
    } catch (error) {
      console.error("Error updating allergy:", error);
      toast.error(error instanceof Error ? error.message : "Greška pri ažuriranju alergije");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    loadAllergies();
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
          <span className="hidden sm:inline">Nova alergija</span>
        </Button>
        <Button onClick={loadAllergies} variant="outline">
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
                  Nema alergija.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-1 text-sm text-muted-foreground">
          Prikazano {table.getRowModel().rows.length} od{" "}
          {table.getCoreRowModel().rows.length} ukupno alergija.
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
            <AlertDialogTitle>Obrisati alergiju?</AlertDialogTitle>
            <AlertDialogDescription>
              Jeste li sigurni da želite obrisati alergiju &quot;{allergyToDelete?.name}&quot;? 
              Ova akcija će trajno obrisati alergiju.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Odustani</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteAllergy}
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
            <DialogTitle>Nova alergija</DialogTitle>
            <DialogDescription>
              Dodajte novu alergiju. Naziv alergije mora biti jedinstven.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Naziv alergije</Label>
              <Input
                id="name"
                value={newAllergyName}
                onChange={(e) => setNewAllergyName(e.target.value)}
                placeholder="Unesite naziv alergije..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddDialogOpen(false);
              setNewAllergyName("");
            }}>
              Odustani
            </Button>
            <Button onClick={addAllergy} disabled={adding}>
              {adding ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Dodavanje...
                </>
              ) : (
                "Dodaj alergiju"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Uredi alergiju</DialogTitle>
            <DialogDescription>
              Izmijenite naziv alergije. Naziv alergije mora biti jedinstven.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Naziv alergije</Label>
              <Input
                id="edit-name"
                value={newAllergyName}
                onChange={(e) => setNewAllergyName(e.target.value)}
                placeholder="Unesite naziv alergije..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditDialogOpen(false);
              setEditingAllergy(null);
              setNewAllergyName("");
            }}>
              Odustani
            </Button>
            <Button onClick={updateAllergy} disabled={updating}>
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
  );
}
