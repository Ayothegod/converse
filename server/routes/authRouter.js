// const hash = await bcrypt.hash(password, 10)
import express from "express";
const router = express.Router();
import { Argon2id, Scrypt } from "oslo/password";
import prisma from "../lib/db.js";
import { lucia } from "../lib/auth.js";
import bcrypt from "bcrypt";
import { generateId } from "../lib/utils.js";

const signUpFunction = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (
      typeof username !== "string" ||
      username.length < 3 ||
      username.length > 31
    ) {
      return console.log("invalid username");
    }

    if (
      typeof password !== "string" ||
      password.length < 6 ||
      password.length > 255
    ) {
      return console.log("invalid password");
    }

    const hashedPassword = await new Argon2id().hash(password);
    const userId = await generateId(15);

    const userExist = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (userExist) return res.status(400).json({ msg: "user already exist" });

    const user = await prisma.user.create({
      data: {
        id: userId,
        username: username,
        hashedPassword: hashedPassword,
      },
    });

    const session = await lucia.createSession(userId, {});
    // const sessionCookie = await lucia.createSessionCookie(session.id);
    console.log(session);

    // res.cookie(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

    res.status(200).json({});
    // return redirect("/");
  } catch (error) {
    console.log(error);
    res.status(401).json({});
  }
};

router.post("/signup", signUpFunction);
router.post("/testRes", (req, res) => {
  // res.cookie(name, val, options)
  res.json({});
});

export default router;
