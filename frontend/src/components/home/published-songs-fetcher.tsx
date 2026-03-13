"use server";

import { getCachedPublishedSongs } from "~/server/queries";
import { PublishedSongs } from "./published-songs";

export default async function PublishedSongsFetcher() {
  // Top 8 most-listened, same cache entry key as home page but limit=8
  const songs = await getCachedPublishedSongs(8);
  // Sort by listenCount for the landing page trending section
  const sorted = [...songs].sort((a, b) => b.listenCount - a.listenCount);
  return <PublishedSongs songs={sorted} />;
}
