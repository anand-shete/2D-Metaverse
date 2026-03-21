import { FastifyInstance } from "fastify";
import { healthCheck } from "../controllers/base.controller";

export async function baseRoutes(fastify: FastifyInstance) {
  fastify.get("/health", healthCheck);
}
