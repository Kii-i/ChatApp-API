import dotenv from "dotenv";
dotenv.config();

import cookieParser from "cookie-parser";
import express from "express";
import AuthRouter from "./routes/auth.routes";
import UserRouter from "./routes/user.routes";
import ServerRouter from "./routes/server.route";
import FriendRouter from "./routes/friend.routes";
const app = express();

import { PrismaClient } from "@prisma/client";
import customErrorHandler from "./middlewares/customErrorHandler.middleware";
import authentication from "./middlewares/authentication.middleware";
export const prisma = new PrismaClient();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", AuthRouter);
app.use("/api/user", authentication, UserRouter);
app.use("/api/server", authentication, ServerRouter);
app.use("/api/user", authentication, FriendRouter);
app.use(customErrorHandler);
const PORT = Number(process.env.PORT) || 3000;
//so by default the ip address is 127.0.0.1 => local machine so it will only listen
//on local machine by changing it to 0000 it can listen to all ip on local machine or on mobile or docker container
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server is listening on PORT: ${PORT}`)
);
