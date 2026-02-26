import db from "#db/client";

import { createPlaylist } from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { createTrack } from "#db/queries/tracks";
import { createUser } from "./queries/users.js";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  const NUM_USERS = 4;
  const NUM_PLAYLISTS = 20;
  const NUM_TRACKS = 40;
  //* MAKES 4 users
  for (let i = 0; i < NUM_USERS; i++) {
    await createUser("USER" + i, "SuperSecretPassword" + i);
  }

  //* MAKES 20 playlist. Every playlist has an owning user
  for (let i = 1; i <= NUM_PLAYLISTS; i++) {
    //! Gets a random num from 1-4 (gets a random user)
    const randomNum = Math.floor(Math.random() * NUM_USERS) + 1;

    await createPlaylist(
      "Playlist" + i,
      "lorem ipsum playlist description",
      randomNum,
    ); //! Assigns the playlist to a random user. One of the 4 there are
  }

  //*MAKES 40 tracks
  for (let i = 0; i < NUM_TRACKS; i++) {
    await createTrack("Track" + i, i * 50000);
  }

  //*Goes through every playlist and adds 5 tracks to them
  for (let i = 1; i <= NUM_PLAYLISTS; i++) {
    const playlistTracks = [];

    while (playlistTracks.length < 5) {
      const randomTrack = Math.floor(Math.random() * NUM_TRACKS) + 1;
      //!This avoides duplicate tracks being put in the same playlist,
      //! by checking if curr track is in curr playlist
      if (!playlistTracks.includes(randomTrack)) {
        await createPlaylistTrack(i, randomTrack);
        playlistTracks.push(randomTrack);
      }
    }
  }
}
