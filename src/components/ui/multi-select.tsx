"use client"

import { useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface SelectableItem {
  id: string
  name: string
}

interface MultiSelectProps<T extends SelectableItem> {
  items: T[]
  selectedIds: string[]
  onChange: (value: string[]) => void
  isLoading: boolean
  label: string
  placeholder: string
  searchPlaceholder: string
  emptyMessage: string
  badgeVariant?: "default" | "secondary" | "outline" | "destructive"
}

export function MultiSelect<T extends SelectableItem>({
  items,
  selectedIds = [],
  onChange,
  isLoading,
  label,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  badgeVariant = "secondary"
}: MultiSelectProps<T>) {
  
  const handleSelect = useCallback((itemId: string) => {
    if (selectedIds.includes(itemId)) {
      onChange(selectedIds.filter(id => id !== itemId))
    } else {
      onChange([...selectedIds, itemId])
    }
  }, [selectedIds, onChange])

  const handleRemove = useCallback((itemId: string) => {
    onChange(selectedIds.filter(id => id !== itemId))
  }, [selectedIds, onChange])

  return (
    <div className="space-y-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={isLoading}
            className={cn(
              "w-full justify-between",
              !selectedIds.length && "text-muted-foreground"
            )}
          >
            {isLoading
              ? `Učitavanje ${label.toLowerCase()}...`
              : selectedIds.length
                ? `${selectedIds.length} odabrano`
                : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-sm p-0">
          <Command>
            <CommandInput placeholder={searchPlaceholder}/>
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {items.map((item) => {
                  const isSelected = selectedIds.includes(item.id);
                  return (
                    <CommandItem
                      key={item.id}
                      value={item.name}
                      onSelect={() => handleSelect(item.id)}
                    >
                      <Check className={cn("mr-2 h-4 w-4", isSelected ? "opacity-100" : "opacity-0")}/>
                      {item.name}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selectedIds.map((id) => {
            const item = items.find(i => i.id === id);
            return item ? (
              <Badge key={id} variant={badgeVariant} className="px-3 py-1">
                {item.name}
                <Button variant="ghost" size={"sm"} className="ml-1 h-4 w-4 p-0"
                  onClick={() => handleRemove(id)} 
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ) : null;
          })}
        </div>
      )}
    </div>
  )
}