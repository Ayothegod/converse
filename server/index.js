import express from "express";
import prisma from "./lib/db.js";
import authRouter from "./routes/authRouter.js";
const app = express()

app.use(express.json())
app.use("/", authRouter)

app.get("/", (req, res) => {
  res.json({});
});

app.listen(3001, () => console.log("server running"));
