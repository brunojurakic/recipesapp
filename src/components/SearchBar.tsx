import { Search } from 'lucide-react'

const SearchBar = () => {
  return (
    <div className="relative w-full max-w-lg">
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 z-10" />
      <input
        type="text"
        placeholder="Search for recipes..."
        className=" text-zinc-700 w-full rounded-full bg-white/90 backdrop-blur-sm px-10 py-3 text-sm shadow-md outline-none ring-1 ring-white/50 transition-all placeholder:text-zinc-500 focus:bg-white focus:ring-2 focus:ring-zinc-300"
      />
    </div>
  )
}

export default SearchBar
