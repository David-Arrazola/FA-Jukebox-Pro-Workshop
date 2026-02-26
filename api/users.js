import express from "express";
import bcrypt from "bcrypt";
import { createUser, getUserByEmailAndPass } from "#db/queries/users";
import { createToken } from "#utils/jwt";

const userRouter = express.Router();
export default userRouter;

const NUM_SALT = 5;

userRouter.post("/register", async (req, res) => {
  try {
    if (!req.body) return res.status(400).send("Requestbody is missing");

    const { username, password } = req.body;

    //* Checking if req.body contains all fields/field not null
    if (!username || !password)
      return res.status(400).send("Username or password is missing");

    //! Bcrypt password salt's the hash 5 times
    const hashPassword = await bcrypt.hash(password, NUM_SALT);
    //* Creating a new user with the username and hashed password
    const newUser = await createUser(username, hashPassword);
    //! Sending ID of newly created user as the PAYLOAD for JWT creation
    const token = await createToken({ id: newUser.id });

    res.status(201).send(token);
  } catch (e) {
    console.error(e);
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    if (!req.body) return res.status(400).send("Request body is missing");
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).send("Body is missing fields");

    const selectedUser = await getUserByEmailAndPass(username, password);
    const token = await createToken({ id: selectedUser.id });

    res.status(200).send(token);
  } catch (e) {
    console.error(e);
  }
});
