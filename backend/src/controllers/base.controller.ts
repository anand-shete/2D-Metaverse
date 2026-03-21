import { FastifyReply, FastifyRequest } from "fastify";

export const healthCheck = async (req: FastifyRequest, res: FastifyReply) => {
  return res.status(200).send({ message: "2D Metaverse API Healthcheck passed ♥️" });
};
