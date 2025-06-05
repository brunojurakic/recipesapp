"use client"

import { Search } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useDebounce } from "use-debounce"
import Link from "next/link"
import Image from "next/image"

interface SearchResult {
  id: string
  title: string
  imagePath: string
}

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
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const searchRecipes = async () => {
      if (!debouncedSearchTerm.trim()) {
        setSearchResults([])
        setShowDropdown(false)
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(
          `/api/recipes/search?q=${encodeURIComponent(debouncedSearchTerm)}`
        )
        if (response.ok) {
          const results = await response.json()
          setSearchResults(results)
          setShowDropdown(true)
        }
      } catch (error) {
        console.error("Search error:", error)
        setSearchResults([])
      } finally {
        setIsLoading(false)
      }
    }

    searchRecipes()
  }, [debouncedSearchTerm])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowDropdown(false)

    if (onSearch) {
      onSearch(searchTerm)
    } else {
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

  const handleResultClick = () => {
    setShowDropdown(false)
    setSearchTerm("")
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-lg">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 z-10" />
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => {
            if (searchResults.length > 0) {
              setShowDropdown(true)
            }
          }}
          className="text-zinc-700 w-full rounded-full bg-white/90 backdrop-blur-sm px-10 py-3 text-sm shadow-md outline-none ring-1 ring-white/50 transition-all placeholder:text-zinc-500 focus:bg-white focus:ring-2 focus:ring-zinc-300"
        />
      </form>

      {showDropdown && (searchResults.length > 0 || isLoading) && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-black rounded-lg shadow-xl border border-gray-200 dark:border-zinc-500 z-[999999] max-h-60 overflow-hidden">
          <div className="max-h-96 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                Pretražujem...
              </div>
            ) : (
              <>
                {searchResults.map((result) => (
                  <Link
                    key={result.id}
                    href={`/recipes/${result.id}`}
                    onClick={handleResultClick}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                  >
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700">
                      {result.imagePath ? (
                        <Image
                          src={result.imagePath}
                          alt={result.title}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                          <Search className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {result.title}
                      </p>
                    </div>
                  </Link>
                ))}
                {searchResults.length === 8 && (
                  <div className="p-3 text-center border-t border-gray-100 dark:border-gray-700">
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        handleSubmit(e)
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                      Prikaži sve rezultate →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchBar
