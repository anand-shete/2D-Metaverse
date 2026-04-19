import { Avatar } from "../utils/enum";
import { z } from "zod";

export const SignupSchema = z.strictObject({
  username: z.string(),
  email: z.string(),
  password: z.string(),
});

export const LoginSchema = z.strictObject({
  email: z.string(),
  password: z.string(),
});

export const UpdateAvatarSchema = z.strictObject({
  userId: z.string(),
  avatar: z.nativeEnum(Avatar),
});
