"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";
import { PublishedSong, PublishedSongs } from "./published-songs";

export function SearchablePublishedSongs({ songs }: { songs: PublishedSong[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSongs = songs.filter((song) => {
    const q = searchQuery.toLowerCase();
    return (
      song.title?.toLowerCase().includes(q) ||
      song.createdByUserName?.toLowerCase().includes(q) ||
      song.prompt?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          placeholder="Search by title, artist or prompt…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-10 rounded-lg border-border/60 bg-card pl-10 text-sm placeholder:text-muted-foreground/60 focus-visible:ring-primary/40"
        />
      </div>

      {/* Result count */}
      {searchQuery && (
        <p className="text-xs text-muted-foreground">
          {filteredSongs.length} {filteredSongs.length === 1 ? "result" : "results"} for &ldquo;{searchQuery}&rdquo;
        </p>
      )}

      {/* Grid */}
      <PublishedSongs songs={filteredSongs} />
    </div>
  );
}
