"use client";

import {
  Download,
  MoreHorizontal,
  Music,
  Pause,
  Play,
  Volume2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePlayerStore } from "~/stores/use-player-store";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Slider } from "./ui/slider";

export default function SoundBar() {
  const { track } = usePlayerStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([100]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  // The audio element is ALWAYS mounted — never conditionally rendered —
  // so navigating between pages never destroys/recreates it.
  const audioRef = useRef<HTMLAudioElement>(null);

  // Register audio event listeners ONCE and never tear them down during navigation.
  // Using stable state-setter references means no stale closure issues with [].
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      if (!isNaN(audio.duration)) setDuration(audio.duration);
    };
    const handleTrackEnd = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("durationchange", updateDuration);
    audio.addEventListener("ended", handleTrackEnd);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("durationchange", updateDuration);
      audio.removeEventListener("ended", handleTrackEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ← runs once; state setters are stable

  // Only respond to a genuine new track URL — NOT to object-reference changes.
  // This means navigating between pages (which doesn't change track?.url)
  // will NOT restart playback.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !track?.url) return;

    setCurrentTime(0);
    setDuration(0);

    // Imperatively set src — do NOT pass src as a React prop on <audio>.
    // React reconciler touching src prop would reset the media element.
    audio.src = track.url;
    audio.load();

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.error("Playback failed:", err);
          setIsPlaying(false);
        });
    }
  }, [track?.url]); // ← only the URL matters, not the whole object reference

  // Sync volume imperatively whenever slider changes.
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = (volume[0] ?? 100) / 100;
    }
  }, [volume]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!track?.url || !audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      await audio.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (audio && value[0] !== undefined) {
      audio.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <>
      {/*
       * The <audio> element lives OUTSIDE the conditional UI block.
       * It is always mounted so the browser never stops the media stream
       * during client-side navigation. src is set imperatively in the effect above.
       */}
      <audio ref={audioRef} preload="metadata" className="hidden" />

      {/* Show the player UI only when a track is active */}
      {track && (
        <div className="px-4 pb-3">
          <Card className="relative w-full shrink-0 border border-border/60 bg-card/90 py-0 shadow-lg shadow-black/30 backdrop-blur-xl">
            <div className="space-y-2 p-3">
              <div className="flex items-center justify-between">
                {/* Track info */}
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/20 ring-1 ring-primary/30">
                    {track.artwork ? (
                      <img
                        className="h-full w-full rounded-md object-cover"
                        src={track.artwork}
                        alt={track.title ?? "artwork"}
                      />
                    ) : (
                      <Music className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="max-w-24 min-w-0 flex-1 md:max-w-full">
                    <p className="truncate text-sm font-medium">{track.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {track.createdByUserName}
                    </p>
                  </div>
                </div>

                {/* Centered play/pause */}
                <div className="absolute left-1/2 -translate-x-1/2">
                  <Button variant="ghost" size="icon" onClick={togglePlay}>
                    {isPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {/* Volume + more menu */}
                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4" />
                    <Slider
                      value={volume}
                      onValueChange={setVolume}
                      step={1}
                      max={100}
                      min={0}
                      className="w-16"
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem
                        onClick={() => {
                          if (track.url) window.open(track.url, "_blank");
                        }}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Progress bar */}
              <div className="flex items-center gap-1">
                <span className="w-8 text-right text-[10px] text-muted-foreground">
                  {formatTime(currentTime)}
                </span>
                <Slider
                  className="flex-1"
                  value={[currentTime]}
                  max={duration || 100}
                  step={1}
                  onValueChange={handleSeek}
                />
                <span className="w-8 text-right text-[10px] text-muted-foreground">
                  {formatTime(duration)}
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
