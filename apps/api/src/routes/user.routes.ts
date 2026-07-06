import { FastifyInstance } from "fastify";
import {
  generatePutObjectSignedUrl,
  getAllArchives,
  loginUser,
  logoutUser,
  signupUser,
  updateUserAvatar,
} from "@controllers/user.controller";

export async function userRoutes(fastify: FastifyInstance) {
  fastify.post("/signup", signupUser);
  fastify.post("/login", loginUser);
  fastify.get("/logout", logoutUser);
  fastify.patch("/update-avatar", updateUserAvatar);
  fastify.get("/archives", getAllArchives);
  fastify.post("/upload-url", generatePutObjectSignedUrl);
}
