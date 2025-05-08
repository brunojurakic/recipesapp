import { Search } from 'lucide-react'

export default function SearchBar() {
  return (
    <div className="relative w-full max-w-lg">
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
      <input
        type="text"
        placeholder="Search for recipes..."
        className="w-full rounded-full bg-white px-10 py-2 text-sm shadow-sm outline-none ring-1 ring-zinc-200 transition-all focus:ring-2 focus:ring-zinc-300 dark:bg-zinc-900 dark:ring-zinc-800 dark:focus:ring-zinc-700"
      />
    </div>
  )
}
