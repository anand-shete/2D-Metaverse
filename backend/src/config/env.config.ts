import "dotenv/config";
import { z } from "zod/v4";

const envSchema = z.object({
  PORT: z.coerce.number(),
  NODE_ENV: z.enum(["development", "production"]),
  MONGO_URL: z.string(),
  FRONTEND_URL: z.string(),
  JWT_SECRET: z.string(),
});

const validate = envSchema.safeParse(process.env);

if (!validate.success) {
  console.log("Error parsing env variables", JSON.parse(validate.error.message));
  process.exit(1);
}

export const env = validate.data;
