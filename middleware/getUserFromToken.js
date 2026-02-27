import { getUserById } from "#db/queries/users";
import { verifyToken } from "#utils/jwt";

/** Attaches the user to the request if a valid token is provided */
export default async function getUserFromToken(req, res, next) {
  //! Returns something like "Bearer token" if there is a token.
  const authorization = req.get("authorization");
  //*Checking if string includes "Bearer Token". If yes, continue, if not, return
  if (!authorization || !authorization.startsWith("Bearer ")) return next();

  const token = authorization.split(" ")[1];
  try {
    //! "verifyToken" checks if token legit. If so, it returns
    //! the stored payload.
    const { id } = verifyToken(token);
    const user = await getUserById(id);
    //* "req.user" is only filled when the token is provided and validated
    req.user = user;
    next();
  } catch {
    res.status(401).send("Invalid token.");
  }
}
