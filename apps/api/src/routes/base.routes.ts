import { FastifyInstance } from "fastify";
import { authCheck, dbHealthCheck, healthCheck } from "../controllers/base.controller";

export async function baseRoutes(fastify: FastifyInstance) {
  fastify.get("/health", healthCheck);
  fastify.get("/health/db", dbHealthCheck);
  fastify.get("/auth", authCheck);
}
