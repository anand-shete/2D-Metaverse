import mongoose from "mongoose";
import { env } from "./env.config";

export const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URL, {
      maxPoolSize: 15,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.log("MongoDB connection error", error);
    process.exit(1);
  }
};
