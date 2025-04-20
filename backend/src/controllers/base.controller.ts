import { FastifyRequest, FastifyReply } from "fastify";
import { LoginSchema, SignupSchema } from "../types/index";
import { AvatarModel, ElementModel, UserModel as User, UserModel } from "../models";
import { generateAdminToken, verfiyToken } from "../helper/jwt";
/*
400 Invalid Request → The request is invalid.
401 Auth Required  → User is unauthorized. Authentication required to access resource.
403 Access Denied → User is authenticated but not authorized to access the resource.
404 Not Found → The requested resource doesn’t exist.
*/
export const signup = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const parsedData = SignupSchema.safeParse(req.body);
    if (!parsedData.success) return res.status(400).send({ message: "Parsing failed" });

    const check = await User.countDocuments({
      email: parsedData.data.email,
    }).lean();
    if (check) return res.status(409).send({ message: "Account aldready exists" });

    const user = await User.create({
      email: parsedData.data.email,
      username: parsedData.data.username,
      password: parsedData.data.password,
    });
    return res.status(201).send({ message: "Account created successfully", userId: user._id });
  } catch (error: any) {
    console.log(error);
    return res.status(500).send({ message: "Failed to Create Account" });
  }
};

export const login = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const parsedData = LoginSchema.safeParse(req.body);
    if (!parsedData.success) return res.status(400).send({ message: "Parsing failed" });

    const user = await User.findOne({
      email: parsedData.data.email,
    }).lean();
    if (!user) return res.status(404).send({ message: "User doesn't exists" });

    const isValid = await User.comparePassword(parsedData.data.password, user.password);
    if (!isValid) return res.status(401).send({ message: "Incorrect Password Entered" });

    const token = await generateAdminToken(user);
    if (!token) return res.status(500).send({ message: "Error generating token" });

    if (process.env.MODE === "DEVELOPMENT") {
      return res
        .setCookie("token", token, {
          path: "/",
          httpOnly: true,
          sameSite: "strict",
          maxAge: 3600,
        })
        .status(200)
        .send({ token: token, message: "User Login success" });
    } else {
      return res
        .setCookie("token", token, {
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 3600,
        })
        .status(200)
        .send({ token: token, message: "User Login success" });
    }
  } catch (error: any) {
    console.log(error);
    return res.status(500).send({ message: "Failed to Sign In User" });
  }
};
export const user = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const token = req.cookies["token"];
    if (!token) return res.status(404).send({ message: "Token not found" });

    const { username } = (await verfiyToken(token)) as {
      _id: string;
      username: string;
      role: string;
      spaces: string[];
      iat: number;
    };
    return res.status(200).send({ message: "User found", username: username });
    // const user = await UserModel.findOne({user})
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Eroror getting user data" });
  }
};
export const avatar = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const avatars = await AvatarModel.find({}).lean();
    return res.status(200).send({
      avatars: avatars.map(a => ({
        id: a._id,
        imageUrl: a.imageUrl,
        name: a.name,
      })),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Error getting users avatars" });
  }
};

export const elements = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const elements = await ElementModel.find({}).lean();
    return res.status(200).send({
      elements: elements.map(e => ({
        id: e._id,
        imageUrl: e.imageUrl,
        width: e.width,
        height: e.height,
        static: e.static,
      })),
    });
  } catch (error) {}
};
