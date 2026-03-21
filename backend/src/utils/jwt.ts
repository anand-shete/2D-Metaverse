import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { env } from "../config/env.config";
import { CustomJwtPayload } from "../types/interface";
import { FastifyReply } from "fastify";

export const generateToken = async (user: User): Promise<string> => {
  const payload: CustomJwtPayload = {
    _id: user._id,
    username: user.username,
    avatar: user.avatar,
  };

  return jwt.sign(payload, env.JWT_SECRET);
};

export const verifyToken = async (token: string) => {
  return jwt.verify(token, env.JWT_SECRET);
};

export const setCookie = async (res: FastifyReply, token: string) => {
  res.setCookie("accessToken", token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 60 * 60 * 24,
  });
};
