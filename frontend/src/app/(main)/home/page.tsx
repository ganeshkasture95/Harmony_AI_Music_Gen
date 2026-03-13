import { Music, TrendingUp, Wand2 } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import PublishedSongsFetcherWithSearch from "~/components/home/published-songs-fetcher-with-search";
import { Button } from "~/components/ui/button";
import { auth } from "~/lib/auth";
import { getCachedHomeStats } from "~/server/queries";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  // Fetch quick stats (cached)
  const { totalPublished, totalUserSongs } = await getCachedHomeStats(session.user.id);

  const firstName = session.user.name?.split(" ")[0] ?? "there";

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      {/* ── Page header ──────────────────────────────────────── */}
      <div className="border-b border-border/60 bg-background/80 px-6 py-6 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl">
          <p className="mb-1 text-sm text-muted-foreground">Welcome back,</p>
          <h1 className="text-2xl font-bold tracking-tight">{firstName} 👋</h1>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        {/* ── Stat cards ───────────────────────────────────────── */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border/60 bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Community Songs
                </p>
                <p className="mt-1 text-3xl font-bold text-foreground">
                  {totalPublished.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">published tracks</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                <Globe className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border/60 bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Your Songs
                </p>
                <p className="mt-1 text-3xl font-bold text-foreground">
                  {totalUserSongs.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">tracks created</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                <Music className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-primary/70">
                  Quick Create
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  Generate a new track
                </p>
                <p className="mt-1 text-xs text-muted-foreground">AI-powered studio</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/20">
                <Wand2 className="h-5 w-5 text-primary" />
              </div>
            </div>
            <Button asChild size="sm" className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/create">Start Creating</Link>
            </Button>
          </div>
        </div>

        {/* ── Section header ───────────────────────────────────── */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold leading-tight">Discover Community Music</h2>
              <p className="text-xs text-muted-foreground">
                Browse and play the latest AI‑generated tracks
              </p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm" className="hidden sm:flex">
            <Link href="/create">Create yours →</Link>
          </Button>
        </div>

        {/* ── Song grid ────────────────────────────────────────── */}
        <Suspense
          fallback={
            <div className="flex h-64 items-center justify-center rounded-xl border border-border/60 bg-card/40">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading songs…</p>
              </div>
            </div>
          }
        >
          <PublishedSongsFetcherWithSearch />
        </Suspense>
      </div>
    </div>
  );
}

// Need to import Globe here
function Globe({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}
