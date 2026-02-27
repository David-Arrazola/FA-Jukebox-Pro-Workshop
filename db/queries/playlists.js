import db from "#db/client";

export async function createPlaylist(name, description, ownerId) {
  const sql = `
  INSERT INTO playlists
    (name, description, owner_id)
  VALUES
    ($1, $2, $3)
  RETURNING *
  `;
  const {
    rows: [playlist],
  } = await db.query(sql, [name, description, ownerId]);
  return playlist;
}

export async function getPlaylists(userId) {
  const sql = `
  SELECT *
  FROM playlists WHERE owner_id = $1
  `;
  const { rows: playlists } = await db.query(sql, [userId]);
  return playlists;
}

export async function getPlaylistById(id) {
  const sql = `
  SELECT *
  FROM playlists
  WHERE id = $1
  `;
  const {
    rows: [playlist],
  } = await db.query(sql, [id]);
  return playlist;
}

export async function getPlaylistsByTrackId(ownerId, trackId) {
  try {
    const sql = `
        SELECT playlists.* FROM playlists
        JOIN playlists_tracks ON playlists.id = playlists_tracks.playlist_id
        WHERE playlists.owner_id = $1 AND playlists_tracks.track_id = $2; 
        `;

    const playlistsWithTrackId = (await db.query(sql, [ownerId, trackId])).rows;
    console.log(playlistsWithTrackId); //fix DELETE

    return playlistsWithTrackId;
  } catch (e) {
    console.error(e);
  }
}
