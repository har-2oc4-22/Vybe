// server.js (or index.js)
import dotenv from "dotenv";
dotenv.config(); // <- MUST be first, before modules that read process.env

import express from "express";
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import loopRouter from "./routes/loop.routes.js";
import storyRouter from "./routes/story.routes.js";
import messageRouter from "./routes/message.routes.js";
// import socket AFTER dotenv, and it's okay to import app/server here
import { app, server } from "./socket.js";

const port = process.env.PORT || 5000;

// CORS: no template string needed, and ensure env has NO trailing slash
app.use(cors({
  origin: process.env.FRONTEND_URL, // e.g. https://vybe-pi-weld.vercel.app
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/loop", loopRouter);
app.use("/api/story", storyRouter);
app.use("/api/message", messageRouter);

// connect DB then start server
connectDb()
  .then(() => {
    server.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB:", err);
    process.exit(1); // stop process if DB not connected
  });

// optional: handle unhandled rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  // optionally close server gracefully then exit
  process.exit(1);
});