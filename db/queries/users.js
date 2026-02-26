import db from "#db/client";
import bcrypt from "bcrypt";

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

export async function getUserByEmailAndPass(username, password) {
  try {
    const sql = `SELECT * FROM users WHERE username = $1`;
    //! Retrieving the user info based on username provided in request.
    const selectedUser = (await db.query(sql, [username])).rows;

    //! Using "bcyrpt.compare()" to see if the password from request and hashed
    //! password saved in the retrieved user match
    const isValid = await bcrypt.compare(password, selectedUser[0].password);

    if (!isValid) return null;

    return selectedUser[0];
  } catch (e) {
    console.error(e);
  }
}
