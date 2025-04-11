import { FastifyInstance } from "fastify";
import { metadata, getUserMetadata } from "../controllers/user.controller";
import { adminMiddleware } from "../middlewares/admin";

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.post("/metadata", { preHandler: adminMiddleware }, metadata); // update avatarId of a user 
  fastify.get("/metadata/bulk", getUserMetadata); // Get other users metadata (name and avatarUrl)
}
