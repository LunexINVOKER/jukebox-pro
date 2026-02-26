
import db from "#db/client";
import bcrypt from "bcrypt";

import { createPlaylist } from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { createTrack } from "#db/queries/tracks";
import { createUser } from "#db/queries/users";

await db.connect();
await seed();
await db.end();
console.log("Database seeded.");

async function seed() {
  for (let i = 1; i <= 20; i++) {
    await createTrack("Track " + i, i * 50000);
  }

  const hash1 = await bcrypt.hash("password1", 10);
  const hash2 = await bcrypt.hash("password2", 10);
  const user1 = await createUser("user1", hash1);
  const user2 = await createUser("user2", hash2);

  const p1 = await createPlaylist("User1 Playlist 1", "First playlist", user1.id);
  const p2 = await createPlaylist("User1 Playlist 2", "Second playlist", user1.id);
  const p3 = await createPlaylist("User2 Playlist 1", "First playlist", user2.id);
  const p4 = await createPlaylist("User2 Playlist 2", "Second playlist", user2.id);

  for (let i = 1; i <= 5; i++) {
    await createPlaylistTrack(p1.id, i);
    await createPlaylistTrack(p2.id, i + 5);
    await createPlaylistTrack(p3.id, i + 10);
    await createPlaylistTrack(p4.id, i + 15);
  }
}