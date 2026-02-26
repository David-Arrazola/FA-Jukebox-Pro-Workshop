import db from "#db/client";

export async function createUser(username, password) {
  try {
    const sql = `
            INSERT INTO users(username, password)
            VALUES ($1, $2)
            RETURNING *;
        `;
    const newUser = (await db.query(sql, [username, password])).rows;

    return newUser[0];
  } catch (e) {
    console.error(e);
  }
}
