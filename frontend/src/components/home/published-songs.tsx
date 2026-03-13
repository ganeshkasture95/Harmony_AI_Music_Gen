"use client";

import { Play } from "lucide-react";
import Image from "next/image";
import { getPlayUrl } from "~/actions/generation";
import { usePlayerStore } from "~/stores/use-player-store";
import { Card } from "../ui/card";

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
      <div className="text-center py-12">
        <p className="text-muted-foreground">No published songs yet. Be the first to publish!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {songs.map((song) => (
        <Card
          key={song.id}
          className="group cursor-pointer overflow-hidden bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:scale-105"
          onClick={() => handlePlay(song)}
        >
          <div className="relative aspect-square w-full overflow-hidden">
            {song.thumbnailUrl ? (
              <Image
                src={song.thumbnailUrl}
                alt={song.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
                <Play className="h-12 w-12 text-white opacity-50" />
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <div className="rounded-full bg-white/20 p-4 backdrop-blur-sm">
                <Play className="h-8 w-8 fill-white text-white" />
              </div>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold truncate mb-1">{song.title}</h3>
            <p className="text-sm text-muted-foreground truncate mb-2">
              {song.createdByUserName || "Anonymous"}
            </p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="truncate">{song.prompt}</span>
              <span className="ml-2 flex-shrink-0">👂 {song.listenCount}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
