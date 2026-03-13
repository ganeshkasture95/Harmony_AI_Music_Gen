"use server";

import { getPresignedUrl } from "~/actions/generation";
import { db } from "~/server/db";
import { SearchablePublishedSongs } from "./searchable-published-songs";

export interface PublishedSong {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  createdByUserName: string | null;
  prompt: string | null;
  listenCount: number;
}

export default async function PublishedSongsFetcherWithSearch() {
  const songs = await db.song.findMany({
    where: {
      published: true,
      status: "processed",
      s3Key: {
        not: null,
      },
    },
    include: {
      user: {
        select: { name: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    // Get more songs for search (increase limit)
    take: 100,
  });

  const songsWithThumbnails = await Promise.all(
    songs.map(async (song) => {
      const thumbnailUrl = song.thumbnailS3Key
        ? await getPresignedUrl(song.thumbnailS3Key)
        : null;

      return {
        id: song.id,
        title: song.title,
        thumbnailUrl,
        createdByUserName: song.user?.name,
        prompt: song.prompt,
        listenCount: song.listenCount,
      };
    }),
  );

  return <SearchablePublishedSongs songs={songsWithThumbnails} />;
}
