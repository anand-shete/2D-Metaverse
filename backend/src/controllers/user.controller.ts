import { FastifyRequest, FastifyReply } from "fastify";
import { UserModel as User } from "@models/user.model";
import { LoginSchema, SignupSchema } from "@schema/user.schema";
import { generateToken, setCookie, verifyToken } from "../utils/jwt";

export const signupUser = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const parsedData = SignupSchema.safeParse(req.body);
    if (!parsedData.success) return res.status(400).send({ message: "Parsing failed" });
    const { username, email, password } = parsedData.data;

    const check = await User.countDocuments({ email }).lean();
    if (check) {
      return res.status(409).send({ message: "Account aldready exists" });
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

    const user = await User.findOne({
      email: parsedData.data.email,
    }).lean();
    if (!user) return res.status(404).send({ message: "User doesn't exists" });

    const isValid = await User.comparePassword(parsedData.data.password, user.password);
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
export const user = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const token = req.cookies["token"];
    if (!token) return res.status(404).send({ message: "Token not found" });

    const { username } = (await verifyToken(token)) as {
      _id: string;
      username: string;
      role: string;
      spaces: string[];
      iat: number;
    };

    return res.status(200).send({ message: "User found", username: username });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Eroror getting user data" });
  }
};
