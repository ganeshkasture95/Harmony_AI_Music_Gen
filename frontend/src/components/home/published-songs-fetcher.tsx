"use server";

import { getPresignedUrl } from "~/actions/generation";
import { db } from "~/server/db";
import { PublishedSongs } from "./published-songs";

export default async function PublishedSongsFetcher() {
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
      listenCount: "desc",
    },
    take: 8, // Show top 8 most listened songs
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

  return <PublishedSongs songs={songsWithThumbnails} />;
}
