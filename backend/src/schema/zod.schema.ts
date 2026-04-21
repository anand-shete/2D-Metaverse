import { Avatar, DocType } from "../utils/enum";
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

export const UploadFileSchema = z.strictObject({
  contentType: z.enum(DocType),
  fileName: z.string(),
  fileSize: z.number(),
});
