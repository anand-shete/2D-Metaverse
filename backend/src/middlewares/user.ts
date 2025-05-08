import { FastifyReply, FastifyRequest } from "fastify";
import { verfiyToken } from "../helper/jwt";

export const userMiddleware = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  try {
    const header = req.headers["authorization"];
    const token = header?.split(" ")[1];
    if (!token) return res.status(401).send({ message: "UserToken not found" });

    const user = (await verfiyToken(token)) as {
      _id: string;
      username: string;
      avatarId: string;
      role: string;
      spaces: string;
    };

    req.userId = user._id;
  } catch (error) {
    console.log(error);
    return res.status(401).send({ message: "Authentication Failed" });
    throw new Error("Authentication failed");
  }
};
