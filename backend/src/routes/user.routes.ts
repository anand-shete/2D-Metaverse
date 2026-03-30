import { FastifyInstance } from "fastify";
import { loginUser, signupUser, updateUserAvatar } from "@controllers/user.controller";

export async function userRoutes(fastify: FastifyInstance) {
  fastify.post("/signup", signupUser);
  fastify.post("/login", loginUser);
  fastify.patch("/update-avatar", updateUserAvatar);
}
