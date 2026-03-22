import { FastifyInstance } from "fastify";
import { authCheck, healthCheck } from "../controllers/base.controller";

export async function baseRoutes(fastify: FastifyInstance) {
  fastify.get("/health", healthCheck);
  fastify.get("/auth", authCheck);
}
