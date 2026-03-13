"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { PublishedSongs, PublishedSong } from "./published-songs";

export function SearchablePublishedSongs({ songs }: { songs: PublishedSong[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSongs = songs.filter((song) => {
    const query = searchQuery.toLowerCase();
    return (
      song.title?.toLowerCase().includes(query) ||
      song.createdByUserName?.toLowerCase().includes(query) ||
      song.prompt?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search songs by title, artist, or prompt..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12 text-base"
        />
      </div>

      {/* Results Count */}
      {searchQuery && (
        <div className="text-sm text-muted-foreground">
          Found {filteredSongs.length} {filteredSongs.length === 1 ? "song" : "songs"}
          {searchQuery && ` matching "${searchQuery}"`}
        </div>
      )}

      {/* Songs Grid */}
      {filteredSongs.length > 0 ? (
        <PublishedSongs songs={filteredSongs} />
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchQuery
              ? `No songs found matching "${searchQuery}"`
              : "No published songs yet. Be the first to publish!"}
          </p>
        </div>
      )}
    </div>
  );
}
