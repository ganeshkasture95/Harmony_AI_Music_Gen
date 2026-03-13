"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "~/lib/auth";
import { getCachedUserSongs } from "~/server/queries";
import { TrackList } from "./track-list";

export default async function TrackListFetcher() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  const tracks = await getCachedUserSongs(session.user.id);
  return <TrackList tracks={tracks} />;
}
