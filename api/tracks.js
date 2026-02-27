import express from "express";
const router = express.Router();
export default router;

import { getTracks, getTrackById } from "#db/queries/tracks";
import { getPlaylistsByTrackId } from "#db/queries/playlists";
import requireUser from "#middleware/requireUser";

//! "requireUser" checks if req has a user inside "req.user". This is true
//! if a token was receieved and validated in "app.js".
router.use(requireUser);

router.get("/", async (req, res) => {
  const tracks = await getTracks();
  res.send(tracks);
});

router.get("/:id/playlists", async (req, res) => {
  const playlistsWithTrackId = await getPlaylistsByTrackId(
    req.user.id,
    req.params.id,
  );

  if (playlistsWithTrackId.length === 0)
    return res.status(404).send("None of your playlists contain track");
  res.status(200).send(playlistsWithTrackId);
});

router.get("/:id", async (req, res) => {
  const track = await getTrackById(req.params.id);
  if (!track) return res.status(404).send("Track not found.");
  res.send(track);
});
