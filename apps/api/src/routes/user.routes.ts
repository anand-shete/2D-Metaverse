import { FastifyInstance } from "fastify";
import {
  generatePutObjectSignedUrl,
  getAllArchives,
  loginUser,
  logoutUser,
  signupUser,
  updateUserAvatar,
} from "@controllers/user.controller";
import { userHook } from "@middlewares/user.middleware";

export async function userRoutes(fastify: FastifyInstance) {
  fastify.post("/signup", signupUser);
  fastify.post("/login", loginUser);
  fastify.get("/logout", logoutUser);
  fastify.patch("/update-avatar", updateUserAvatar);
  fastify.get("/archives", { preHandler: userHook }, getAllArchives);
  fastify.post("/upload-url", { preHandler: userHook }, generatePutObjectSignedUrl);
}
