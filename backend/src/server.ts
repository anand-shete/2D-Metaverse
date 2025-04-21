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

const fastify = Fastify({ logger: false });
const PORT = Number(process.env.PORT) || 3000;

(async () => {
  await connectDB();
  await fastify.register(cors, {
    methods: ["GET", "POST", "PUT", "DELETE"],
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });
  
  await fastify.register(Formbody);
  await fastify.register(fastifyCookie);

  fastify.get("/health", async (req: FastifyRequest, res: FastifyReply) => {
    return res.status(200).send({ message: "Health check passed 🚀" });
  });

  await fastify.register(baseRoutes, { prefix: "/api/v1" });
  await fastify.register(userRoutes, { prefix: "/api/v1/user" });
  await fastify.register(adminRoutes, { prefix: "/api/v1/admin" });
  await fastify.register(spaceRoutes, { prefix: "/api/v1/space" });

  try {
    await fastify.listen({ port: PORT });
    console.log(`Server started on PORT:${PORT}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();
