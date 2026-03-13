import { Music, TrendingUp } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import PublishedSongsFetcherWithSearch from "~/components/home/published-songs-fetcher-with-search";
import { Loader2 } from "lucide-react";
import { auth } from "~/lib/auth";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
            <Music className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Discover Music</h1>
            <p className="text-muted-foreground">
              Explore and play songs created by the HarmonyAI community
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Songs</p>
              <p className="text-2xl font-bold">Community</p>
            </div>
            <Music className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Trending</p>
              <p className="text-2xl font-bold">Now</p>
            </div>
            <TrendingUp className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Your Songs</p>
              <p className="text-2xl font-bold">Create</p>
            </div>
            <Music className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Songs Section with Search */}
      <div className="flex-1">
        <Suspense
          fallback={
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          }
        >
          <PublishedSongsFetcherWithSearch />
        </Suspense>
      </div>
    </div>
  );
}
