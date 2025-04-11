import { FastifyInstance } from "fastify";
import {
  createAvatar,
  createElement,
  updateElementById,
  createMap,
} from "../controllers/admin.controller";
import { adminMiddleware } from "../middlewares/admin";

export default async function adminRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", adminMiddleware);

  fastify.post("/element", createElement); // create an Element (table,chair, sofa..)
  fastify.put("/element/:elementId", updateElementById); // update given elements image
  fastify.post("/avatar", createAvatar); // create avatar for an admin
  fastify.post("/map", createMap);
}