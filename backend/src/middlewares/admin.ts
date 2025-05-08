import { FastifyReply, FastifyRequest } from "fastify";
import { verfiyToken } from "../helper/jwt";
import { Roles } from "../helper/enum";

export const adminMiddleware = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  try {
    const header = req.headers["authorization"];
    const token = header?.split(" ")[1];
    if (!token)
      return res.status(401).send({ message: "AdminToken not found" });

    const admin = (await verfiyToken(token)) as {
      _id: string;
      username: string;
      avatarId: string;
      role: string;
      spaces: string;
    };
    if (admin.role !== Roles.Admin)
      return res.status(401).send({ message: "Role must be Admin" });

    req.userId = admin._id; // update the global fastify request object which should have a userId
  } catch (error) {
    console.log(error);
    return res.status(401).send({ message: "Authentication Failed" });
    throw new Error("Authentication failed");
  }
};
