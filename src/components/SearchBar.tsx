import { useState, useMemo } from "react";
import Fuse from "fuse.js";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { QuestionsDB } from "@/components/dto/question";

interface SearchBarProps {
  items: QuestionsDB[];
  onFilteredItemsChange: (filteredItems: QuestionsDB[]) => void;
}

export function SearchBar({ items, onFilteredItemsChange }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Configure Fuse.js for fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(items, {
      keys: ["title", "description"],
      threshold: 0.3, // Lower = more strict, Higher = more fuzzy
      ignoreLocation: true, // Search in entire string, not just at beginning
    });
  }, [items]);

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      // If search is empty, show all items
      onFilteredItemsChange(items);
    } else {
      // Perform fuzzy search and extract items
      const results = fuse.search(query);
      const filteredItems = results.map((result) => result.item);
      onFilteredItemsChange(filteredItems);
    }
  };

  return (
    <div className="relative w-full max-w-xl mx-auto mb-6">
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={20}
          aria-hidden="true"
        />
        <Input
          type="text"
          placeholder="Search by title or description..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-10"
          aria-label="Search question sets"
        />
      </div>
    </div>
  );
}
