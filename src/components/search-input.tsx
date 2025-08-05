
"use client";

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchInputProps {
  onSearch: (query: string) => void;
}

export function SearchInput({ onSearch }: SearchInputProps) {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full items-center space-x-2">
      <Input
        type="text"
        placeholder="e.g., Monstera Deliciosa..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" size="icon" aria-label="Search">
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
}
