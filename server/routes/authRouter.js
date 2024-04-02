// const hash = await bcrypt.hash(password, 10)
import express from "express";
const router = express.Router();
import { Argon2id } from "oslo/password";
import prisma from "../lib/db.js";
import { generateId } from "../lib/utils.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

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

    req.session.userId = userId;
    res.cookie("sessionId", req.sessionID);

    res.status(200).json({ status: "ok", userId: userId });
  } catch (error) {
    console.log(error);
    res.status(401).json({msg: "error signup"});
  }
};

router.post("/signup", signUpFunction);
router.post("/test", isAuthenticated, (req, res) => {
    
  res.json("test route");
});

export default router;
