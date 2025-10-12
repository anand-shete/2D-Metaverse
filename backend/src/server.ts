import "dotenv/config";
import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import baseRoutes from "./routes/base.routes";
import userRoutes from "./routes/user.routes";
import adminRoutes from "./routes/admin.routes";
import spaceRoutes from "./routes/space.routes";
import fastifyCookie from "@fastify/cookie";
import Formbody from "@fastify/formbody";
import connectDB from "./config/db";
import cors from "@fastify/cors";
import fastifySocketIO from "fastify-socket.io";
import initSockets from "./sockets";

const fastify = Fastify({ logger: false });
const PORT = Number(process.env.PORT) || 3000;

const start = async () => {
  await connectDB();
  await fastify.register(cors, {
    methods: ["GET", "POST", "PUT", "DELETE"],
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });

  await fastify.register(Formbody);
  await fastify.register(fastifyCookie);
  await fastify.register(fastifySocketIO, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"],
      allowedHeaders: "*",
      credentials: true,
    },
  });

  fastify.get("/", async (req: FastifyRequest, res: FastifyReply) => {
    res.status(200).send({ message: "Fastify Backend Health check passed 🚀" });
    return;
  });

  await fastify.register(baseRoutes, { prefix: "/api/v1" });
  await fastify.register(userRoutes, { prefix: "/api/v1/user" });
  await fastify.register(adminRoutes, { prefix: "/api/v1/admin" });
  await fastify.register(spaceRoutes, { prefix: "/api/v1/space" });

  // initalize web sockets
  await initSockets(fastify);

  try {
    await fastify.listen({ port: PORT, host: "0.0.0.0" });
    console.log(`Server started on http://localhost:${PORT}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
