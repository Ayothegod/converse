import express from "express";
import authRouter from "./routes/authRouter.js";
import session from "express-session";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import prisma from "./lib/db.js";
import { PrismaSessionStore } from '@quixo3/prisma-session-store'
const app = express();
dotenv.config();

app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    cookie: {
      maxAge: 24 * 60 * 60 * 1000 // ms
     },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(
      prisma,
      {
        checkPeriod: 2 * 60 * 1000,  //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    )
  })
);

app.use("/", authRouter);

app.get("/", (req, res) => {
  res.json({});
});


app.listen(3001, () => console.log("server running"));
