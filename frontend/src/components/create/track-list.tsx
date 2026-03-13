"use client";

import {
  Download,
  EyeOff,
  Globe,
  Loader2,
  MoreHorizontal,
  Music,
  Pencil,
  Play,
  RefreshCcw,
  Search,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getPlayUrl } from "~/actions/generation";
import { renameSong, setPublishedStatus } from "~/actions/song";
import { usePlayerStore } from "~/stores/use-player-store";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { RenameDialog } from "./rename-dialog";

export interface Track {
  id: string;
  title: string | null;
  createdAt: Date | string;   // string when coming through the cache (JSON-serialised)
  instrumental: boolean;
  prompt: string | null;
  lyrics: string | null;
  describedLyrics: string | null;
  fullDescribedSong: string | null;
  thumbnailUrl: string | null;
  playUrl: string | null;
  status: string | null;
  createdByUserName: string | null;
  published: boolean;
}

export function TrackList({ tracks }: { tracks: Track[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadingTrackId, setLoadingTrackId] = useState<string | null>(null);
  const [trackToRename, setTrackToRename] = useState<Track | null>(null);
  const router = useRouter();
  const setTrack = usePlayerStore((state) => state.setTrack);

  const handleTrackSelect = async (track: Track) => {
    if (track.status !== "processed" || loadingTrackId) return;
    setLoadingTrackId(track.id);
    const playUrl = await getPlayUrl(track.id);
    setLoadingTrackId(null);
    setTrack({
      id: track.id,
      title: track.title,
      url: playUrl,
      artwork: track.thumbnailUrl,
      prompt: track.prompt,
      createdByUserName: track.createdByUserName,
    });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const filteredTracks = tracks.filter(
    (track) =>
      track.title?.toLowerCase().includes(searchQuery.toLowerCase()) ??
      track.prompt?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto">
      <div className="p-5">
        {/* Toolbar */}
        <div className="mb-5 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tracks…"
              className="h-9 rounded-lg border-border/60 bg-card pl-9 text-sm placeholder:text-muted-foreground/60"
            />
          </div>
          <Button
            disabled={isRefreshing}
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="h-9 gap-1.5 border-border/60 text-muted-foreground hover:text-foreground"
          >
            {isRefreshing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCcw className="h-3.5 w-3.5" />
            )}
            Refresh
          </Button>
        </div>

        {/* Track list */}
        <div className="space-y-1">
          {filteredTracks.length > 0 ? (
            filteredTracks.map((track) => {
              /* ── Failed ── */
              if (track.status === "failed") {
                return (
                  <div
                    key={track.id}
                    className="flex cursor-not-allowed items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2.5"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-destructive/10">
                      <XCircle className="h-5 w-5 text-destructive" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-destructive">Generation failed</p>
                      <p className="text-xs text-muted-foreground">Please try again.</p>
                    </div>
                  </div>
                );
              }

              /* ── No credits ── */
              if (track.status === "no credits") {
                return (
                  <div
                    key={track.id}
                    className="flex cursor-not-allowed items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2.5"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-destructive/10">
                      <XCircle className="h-5 w-5 text-destructive" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-destructive">Insufficient credits</p>
                      <p className="text-xs text-muted-foreground">Purchase more credits to generate.</p>
                    </div>
                  </div>
                );
              }

              /* ── Queued / Processing ── */
              if (track.status === "queued" || track.status === "processing") {
                return (
                  <div
                    key={track.id}
                    className="flex cursor-wait items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2.5"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-primary/10">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {track.title ?? "Processing song…"}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {track.status} · refresh to update
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-primary/30 bg-primary/10 text-primary text-[10px]"
                    >
                      {track.status}
                    </Badge>
                  </div>
                );
              }

              /* ── Processed ── */
              return (
                <div
                  key={track.id}
                  className="group flex cursor-pointer items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 transition-colors hover:border-border/60 hover:bg-card"
                  onClick={() => handleTrackSelect(track)}
                >
                  {/* Thumbnail */}
                  <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                    {track.thumbnailUrl ? (
                      <Image
                        src={track.thumbnailUrl}
                        alt={track.title ?? "Track"}
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Music className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 transition-opacity group-hover:opacity-100">
                      {loadingTrackId === track.id ? (
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      ) : (
                        <Play className="h-4 w-4 fill-primary text-primary" />
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-foreground">
                        {track.title ?? "Untitled"}
                      </p>
                      {track.instrumental && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          Instrumental
                        </Badge>
                      )}
                    </div>
                    {track.prompt && (
                      <p className="truncate text-xs text-muted-foreground">
                        {track.prompt}
                      </p>
                    )}
                  </div>

                  {/* Actions — single always-visible menu button */}
                  <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        {/* Publish / Unpublish */}
                        <DropdownMenuItem
                          onClick={async (e) => {
                            e.stopPropagation();
                            await setPublishedStatus(track.id, !track.published);
                          }}
                          className={
                            track.published
                              ? "text-destructive focus:text-destructive"
                              : "text-primary focus:text-primary"
                          }
                        >
                          {track.published ? (
                            <>
                              <EyeOff className="mr-2 h-4 w-4" /> Unpublish
                            </>
                          ) : (
                            <>
                              <Globe className="mr-2 h-4 w-4" /> Publish
                            </>
                          )}
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={async (e) => {
                            e.stopPropagation();
                            const playUrl = await getPlayUrl(track.id);
                            window.open(playUrl, "_blank");
                          }}
                        >
                          <Download className="mr-2 h-4 w-4" /> Download
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setTrackToRename(track);
                          }}
                        >
                          <Pencil className="mr-2 h-4 w-4" /> Rename
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-border/60 bg-card/40 py-20 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Music className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">
                {searchQuery ? "No results found" : "No tracks yet"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {searchQuery
                  ? "Try a different search term."
                  : "Generate your first song to get started."}
              </p>
            </div>
          )}
        </div>
      </div>

      {trackToRename && (
        <RenameDialog
          track={trackToRename}
          onClose={() => setTrackToRename(null)}
          onRename={(trackId, newTitle) => renameSong(trackId, newTitle)}
        />
      )}
    </div>
  );
}
