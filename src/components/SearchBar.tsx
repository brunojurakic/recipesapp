"use client"

import { Search } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface SearchBarProps {
  defaultValue?: string
  onSearch?: (term: string) => void
  placeholder?: string
}

const SearchBar = ({
  defaultValue = "",
  onSearch,
  placeholder = "Pretraži recepte...",
}: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState(defaultValue)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchTerm)
    } else {
      // Navigate to recipes page with search term
      const searchParams = new URLSearchParams()
      if (searchTerm.trim()) {
        searchParams.set("search", searchTerm.trim())
      }
      const url = searchParams.toString()
        ? `/recipes?${searchParams.toString()}`
        : "/recipes"
      router.push(url)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-lg">
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 z-10" />
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="text-zinc-700 w-full rounded-full bg-white/90 backdrop-blur-sm px-10 py-3 text-sm shadow-md outline-none ring-1 ring-white/50 transition-all placeholder:text-zinc-500 focus:bg-white focus:ring-2 focus:ring-zinc-300"
      />
    </form>
  )
}

export default SearchBar
