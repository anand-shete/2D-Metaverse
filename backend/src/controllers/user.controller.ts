import { FastifyRequest, FastifyReply } from "fastify";
import { UserModel as User } from "@models/user.model";
import { LoginSchema, SignupSchema, UpdateAvatarSchema } from "@schema/user.schema";
import { generateToken, setCookie, verifyToken } from "@utils/jwt";
import { Types } from "mongoose";

export const signupUser = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const parsedData = SignupSchema.safeParse(req.body);
    if (!parsedData.success) return res.status(400).send({ message: "Parsing failed" });
    const { username, email, password } = parsedData.data;

    const check = await User.countDocuments({ email });
    if (check) {
      return res.status(409).send({ message: "Account aldready exists" });
    }

    const checkUsername = await User.countDocuments({ username });
    if (checkUsername) {
      return res.status(409).send({ message: "Username already taken" });
    }

    const user = await User.create({
      email: email,
      username: username,
      password: password,
    });

    return res.status(201).send({ message: "Account created successfully", userId: user._id });
  } catch (error: any) {
    console.log(error);
    return res.status(500).send({ message: "Failed to Create Account" });
  }
};

export const loginUser = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const parsedData = LoginSchema.safeParse(req.body);
    if (!parsedData.success) return res.status(400).send({ message: "Parsing failed" });
    const { email, password } = parsedData.data;

    const user = await User.findOne({ email }).lean();
    if (!user) return res.status(404).send({ message: "User doesn't exists" });

    const isValid = await User.comparePassword(password, user.password);
    if (!isValid) return res.status(401).send({ message: "Incorrect Password Entered" });

    const token = await generateToken(user);
    if (!token) return res.status(500).send({ message: "Error generating token" });

    await setCookie(res, token);

    return res.status(200).send({ token: token, message: "User Login success" });
  } catch (error: any) {
    console.log(error);
    return res.status(500).send({ message: "Failed to Sign In User" });
  }
};

export const logoutUser = (req: FastifyRequest, res: FastifyReply) => {
  res.clearCookie("accessToken").send({ message: "Logout successful", user: null });
};

export const updateUserAvatar = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const parsedData = UpdateAvatarSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).send({ message: "Zod parsing failed" });
    }
    const { avatar, userId } = parsedData.data;
    const id = new Types.ObjectId(userId);

    const user = await User.countDocuments({ _id: id });
    if (!user) return res.status(404).send({ message: "User not found" });

    await User.updateOne({ _id: id }, { avatar });

    return res.status(200).send({ message: "Account created successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Error updating avatar" });
  }
};
