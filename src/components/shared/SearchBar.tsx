import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
}

export default function SearchBar({
  onSearch,
  placeholder = "Search...",
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      onSearch(searchQuery)
    }, 300)
    return () => window.clearTimeout(timeoutId)
  }, [searchQuery, onSearch])

  return (
    <div className="relative flex-1 min-w-0">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        className="pl-9 bg-background"
        placeholder={placeholder}
        aria-label={placeholder}
      />
    </div>
  )
}
