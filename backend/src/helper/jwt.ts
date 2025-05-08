import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

export const generateAdminToken = async (user: User): Promise<string> => {
  const payload = {
    _id: user._id,
    username: user.username,
    avatarId: user.avatarId,
    role: user.role,
    spaces: user.spaces,
  };
  return jwt.sign(payload, String(process.env.JWT_SECRET));
};

export const verfiyToken = async (token: string) => {
  return jwt.verify(token, String(process.env.JWT_SECRET));
};
