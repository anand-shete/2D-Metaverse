import "dotenv/config";
import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import * as Routes from "./routes/index";
import fastifyCookie from "@fastify/cookie";
import Formbody from "@fastify/formbody";
import connectDB from "./config/db.config";
import cors from "@fastify/cors";
import { Server } from "socket.io";
import { initSockets } from "./sockets/init";
import { env } from "./config/env.config";

const fastify = Fastify({ logger: false });
const PORT = Number(env.PORT) || 3000;

const start = async () => {
  await connectDB();
  await fastify.register(cors, {
    methods: ["GET", "POST", "PUT", "DELETE"],
    origin: env.FRONTEND_URL,
    credentials: true,
  });

  await fastify.register(Formbody);
  await fastify.register(fastifyCookie);

  const io = new Server(fastify.server, {
    cors: {
      origin: env.FRONTEND_URL,
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: "*",
      credentials: true,
    },
  });

  // 2. Add to Fastify decorate so you can use 'this.io' in routes
  fastify.decorate("io", io);

  fastify.get("/", async (req: FastifyRequest, res: FastifyReply) => {
    res.status(200).send({ message: "Fastify Backend Health check passed 🚀" });
    return;
  });

  await fastify.register(Routes.baseRoutes, { prefix: "/api/v1" });
  await fastify.register(Routes.userRoutes, { prefix: "/api/v1/user" });
  await fastify.register(Routes.adminRoutes, { prefix: "/api/v1/admin" });
  await fastify.register(Routes.spaceRoutes, { prefix: "/api/v1/space" });

  // initalize web sockets
  await initSockets(fastify, io);

  try {
    await fastify.listen({ port: PORT, host: "0.0.0.0" });
    console.log(`Server started on http://localhost:${PORT}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
