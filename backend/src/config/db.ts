import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connect(String(process.env.MONGO_URL), {
      maxPoolSize: 10,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.log("MongoDB connection error", error);
    process.exit(1);
  }
};

export default connectDB;
