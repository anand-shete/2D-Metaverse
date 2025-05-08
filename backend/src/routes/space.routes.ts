import { FastifyInstance } from "fastify";
import {
  createSpace,
  deleteSpaceById,
  getAllSpaces,
  addElement,
  deleteElement,
  getSpace,
} from "../controllers/space.controller";
import { userMiddleware } from "../middlewares/user";

export default async function spaceRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", userMiddleware);

  fastify.post("/", createSpace); // create a space
  fastify.delete("/:spaceId", deleteSpaceById);
  fastify.get("/all", getAllSpaces); // get all spaces created by a user

  fastify.get("/:spaceId", getSpace); // get a space
  fastify.post("/element", addElement); // adding element to the space
  fastify.delete("/element", deleteElement); // delete an element from a space
}
