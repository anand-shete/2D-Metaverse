import "dotenv/config";
import cors from "@fastify/cors";
import * as Routes from "@routes/index";
import fastifyCookie from "@fastify/cookie";
import Formbody from "@fastify/formbody";
import { Server } from "socket.io";
import { initSockets } from "@sockets/init";
import { env, connectDB } from "@config/index";

import Fastify, { FastifyReply, FastifyRequest } from "fastify";
const fastify = Fastify({ logger: false });
const PORT = Number(env.PORT) || 3000;

const start = async () => {
  await connectDB();

  const io = new Server(fastify.server, {
    cors: {
      origin: [env.FRONTEND_URL1, env.FRONTEND_URL2],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true,
    },
  });

  // Add to Fastify decorate so you can use 'fastify.io'
  fastify.decorate("io", io);

  await fastify.register(cors, {
    origin: [env.FRONTEND_URL1, env.FRONTEND_URL2],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  });

  await fastify.register(Formbody);
  await fastify.register(fastifyCookie);

  await fastify.register(Routes.baseRoutes, { prefix: "/api/v1" });
  await fastify.register(Routes.userRoutes, { prefix: "/api/v1/user" });

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
