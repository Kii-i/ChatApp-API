import dotenv from "dotenv";
dotenv.config();

import cookieParser from "cookie-parser";
import express from "express";
import AuthRouter from "./routes/auth.routes";
import UserRouter from "./routes/user.routes";
import ServerRouter from "./routes/server.route";
import FriendRouter from "./routes/friend.route";
import CategoryRouter from "./routes/category.route";
import ChannelRouter from "./routes/channel.route";
import ChannelAccessRouter from "./routes/channelAccess.route";
import ServerRoleRouter from "./routes/serverRole.routes";
const app = express();

import { PrismaClient } from "@prisma/client";
import CustomErrorHandler from "./middlewares/CustomErrorHandler.middleware";
import Authentication from "./middlewares/Authentication.middleware";
export const prisma = new PrismaClient();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", AuthRouter);
app.use("/api/users", Authentication, UserRouter);
app.use("/api/servers", Authentication, ServerRouter);
app.use("/api/users/friends", Authentication, FriendRouter);
app.use("/api/servers/:serverId", Authentication, CategoryRouter);
// app.use(
//   "/api/servers/:serverId/categories/:categoryId/channelAccess",
//   Authentication,
//   CategoryRouter
// );
app.use("/api/servers/:serverId", Authentication, ServerRoleRouter);
app.use("/api/servers/:serverId", Authentication, ChannelRouter);
app.use(CustomErrorHandler);
const PORT = Number(process.env.PORT) || 3000;
//so by default the ip address is 127.0.0.1 => local machine so it will only listen
//on local machine by changing it to 0000 it can listen to all ip on local machine or on mobile or docker container
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server is listening on PORT: ${PORT}`)
);
