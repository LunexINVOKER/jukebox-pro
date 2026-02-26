import express from "express";
const router = express.Router();
export default router;

import bcrypt from "bcrypt";
import { createUser, getUserByUsername } from "#db/queries/users";
import { createToken } from "#utils/jwt";
import requireBody from "#middleware/requireBody";

router.post("/register", requireBody(["username", "password"]), async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await createUser(username, hashed);
    const token = createToken({ id: user.id });
    res.status(201).send(token);
  } catch (err) {
    next(err);
  }
});

router.post("/login", requireBody(["username", "password"]), async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await getUserByUsername(username);
    if (!user) return res.status(401).send("Invalid credentials.");
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).send("Invalid credentials.");
    const token = createToken({ id: user.id });
    res.send(token);
  } catch (err) {
    next(err);
  }
});