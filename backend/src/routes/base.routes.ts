import { FastifyInstance } from "fastify";
import {
  login,
  signup,
  avatar,
  elements,
} from "../controllers/base.controller";

export default async function baseRoutes(fastify: FastifyInstance) {
  fastify.post("/signup", signup);
  fastify.post("/login", login);
  fastify.get("/avatars", avatar); // Get all avatars for users in current space
  fastify.get("/elements", elements); // Get all elements in current space
}
