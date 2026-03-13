"use server";

import { getCachedPublishedSongs } from "~/server/queries";
import { SearchablePublishedSongs } from "./searchable-published-songs";

export default async function PublishedSongsFetcherWithSearch() {
  const songs = await getCachedPublishedSongs(100);
  return <SearchablePublishedSongs songs={songs} />;
}
