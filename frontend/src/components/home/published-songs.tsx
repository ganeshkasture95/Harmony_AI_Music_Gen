"use client";

import { Headphones, Play } from "lucide-react";
import Image from "next/image";
import { getPlayUrl } from "~/actions/generation";
import { usePlayerStore } from "~/stores/use-player-store";

export interface PublishedSong {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  createdByUserName: string | null;
  prompt: string | null;
  listenCount: number;
}

export function PublishedSongs({ songs }: { songs: PublishedSong[] }) {
  const setTrack = usePlayerStore((state) => state.setTrack);

  const handlePlay = async (song: PublishedSong) => {
    const playUrl = await getPlayUrl(song.id);
    setTrack({
      id: song.id,
      title: song.title,
      url: playUrl,
      artwork: song.thumbnailUrl,
      prompt: song.prompt,
      createdByUserName: song.createdByUserName,
    });
  };

  if (songs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-border/60 bg-card/40 py-20">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Play className="h-6 w-6 text-primary" />
        </div>
        <p className="text-sm font-medium text-foreground">No published songs yet</p>
        <p className="mt-1 text-xs text-muted-foreground">Be the first to publish!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {songs.map((song) => (
        <button
          key={song.id}
          type="button"
          className="group relative flex w-full min-w-0 flex-col overflow-hidden rounded-xl border border-border/60 bg-card text-left transition-all duration-200 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
          onClick={() => handlePlay(song)}
        >
          {/* Artwork */}
          <div className="relative aspect-square w-full overflow-hidden bg-muted">
            {song.thumbnailUrl ? (
              <Image
                src={song.thumbnailUrl}
                alt={song.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/30 to-primary/10">
                <Play className="h-10 w-10 text-primary opacity-50" />
              </div>
            )}

            {/* Play overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/30">
                <Play className="h-6 w-6 fill-primary-foreground text-primary-foreground translate-x-0.5" />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex min-w-0 flex-1 flex-col p-4">
            <p className="truncate text-sm font-semibold leading-snug text-foreground">
              {song.title}
            </p>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {song.createdByUserName ?? "Anonymous"}
            </p>

            <div className="mt-3 flex min-w-0 items-center justify-between border-t border-border/40 pt-3">
              {song.prompt && (
                <p className="mr-2 min-w-0 flex-1 truncate text-[11px] text-muted-foreground/60">
                  {song.prompt}
                </p>
              )}
              <div className="flex flex-shrink-0 items-center gap-1 text-[11px] text-muted-foreground">
                <Headphones className="h-3 w-3" />
                {song.listenCount.toLocaleString()}
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
