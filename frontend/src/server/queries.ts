/**
 * Cached database queries using Next.js unstable_cache.
 *
 * Prisma does not use the native fetch API, so it bypasses Next.js's
 * built-in fetch cache. We wrap each query in unstable_cache so results
 * are stored in the Next.js Data Cache and invalidated by tag.
 *
 * Cache tags used:
 *   "published-songs"  – public song list (home + landing)
 *   "user-songs"       – per-user song list (create page)
 *   "home-stats"       – dashboard stat counts
 */

import { unstable_cache } from "next/cache";
import { getPresignedUrl } from "~/actions/generation";
import { db } from "./db";

// ── Published songs ───────────────────────────────────────────────────────────
// Cached for 60 s; busted whenever a song is published / unpublished.
export const getCachedPublishedSongs = unstable_cache(
  async (limit: number) => {
    const songs = await db.song.findMany({
      where: {
        published: true,
        status: "processed",
        s3Key: { not: null },
      },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return Promise.all(
      songs.map(async (song) => ({
        id: song.id,
        title: song.title ?? "",
        thumbnailUrl: song.thumbnailS3Key
          ? await getPresignedUrl(song.thumbnailS3Key)
          : null,
        createdByUserName: song.user?.name ?? null,
        prompt: song.prompt,
        listenCount: song.listenCount,
      })),
    );
  },
  ["published-songs"],
  { revalidate: 60, tags: ["published-songs"] },
);

// ── User songs ────────────────────────────────────────────────────────────────
// Cached for 30 s per user; busted on generate / rename / publish.
export const getCachedUserSongs = unstable_cache(
  async (userId: string) => {
    const songs = await db.song.findMany({
      where: { userId },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });

    return Promise.all(
      songs.map(async (song) => ({
        id: song.id,
        title: song.title,
        // Serialise Date → ISO string so it survives JSON cache serialisation.
        createdAt: song.createdAt.toISOString(),
        instrumental: song.instrumental ?? false,
        prompt: song.prompt,
        lyrics: song.lyrics,
        describedLyrics: song.describedLyrics,
        fullDescribedSong: song.fullDescribedSong,
        thumbnailUrl: song.thumbnailS3Key
          ? await getPresignedUrl(song.thumbnailS3Key)
          : null,
        playUrl: null as string | null,
        status: song.status,
        createdByUserName: song.user?.name ?? null,
        published: song.published,
      })),
    );
  },
  ["user-songs"],
  { revalidate: 30, tags: ["user-songs"] },
);

// ── Dashboard stats ───────────────────────────────────────────────────────────
// Cached for 60 s; busted when a song is created or published.
export const getCachedHomeStats = unstable_cache(
  async (userId: string) => {
    const [totalPublished, totalUserSongs] = await Promise.all([
      db.song.count({ where: { published: true, status: "processed" } }),
      db.song.count({ where: { userId } }),
    ]);
    return { totalPublished, totalUserSongs };
  },
  ["home-stats"],
  { revalidate: 60, tags: ["home-stats"] },
);
