import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoute from "./routes/user.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./socketIo/server.js";

dotenv.config();

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
      origin:
        "https://chattify-2-git-main-anuj-kushwahas-projects-db7b729e.vercel.app",
      credentials: true,
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
      allowedHeaders: ["content-Type", "Authorization"],
    })
  );

const PORT = process.env.PORT || 3001;
const URI = process.env.MONGODB_URI;

try {
    mongoose.connect(URI);
    console.log("Connected to MongoDB");
} catch (error) {
    console.log(error);
}

//routes
app.use("/api/user", userRoute);
app.use("/api/message", messageRoute);

server.listen(PORT, () => {
    console.log(`Server is Running on port ${PORT}`);
});