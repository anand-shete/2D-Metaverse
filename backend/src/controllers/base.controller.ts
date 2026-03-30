import { verifyToken } from "@utils/jwt";
import { FastifyReply, FastifyRequest } from "fastify";

export const healthCheck = async (req: FastifyRequest, res: FastifyReply) => {
  return res.status(200).send({ message: "🎉 2D Metaverse API Healthcheck passed 🚀" });
};

export const authCheck = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const token = req.cookies["accessToken"];
    if (!token) return res.status(404).send({ message: "Token not found" });

    const decode = await verifyToken(token);
    if (!decode) return res.status(403).send({ message: "Invalid token" });

    const { username, avatar, id } = decode;
    return res.status(200).send({
      message: "User authentication success",
      payload: { username, avatar, id },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Error getting user data" });
  }
};
