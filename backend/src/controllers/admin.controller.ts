import { FastifyRequest, FastifyReply } from "fastify";
import {
  CreateAvatarSchema,
  CreateElementSchema,
  CreateMapSchema,
  UpdateElementSchema,
} from "../types";
import { ElementModel as Element, UserModel } from "../models";
import { AvatarModel as Avatar } from "../models";
import { MapModel as Map } from "../models";
import { User } from "../models/user.model";
import { Types } from "mongoose";

export const createElement = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const parsedData = CreateElementSchema.safeParse(req.body);
    if (!parsedData.success)
      return res.status(400).send({ message: "Validation Error" });

    const element = await Element.create({
      imageUrl: parsedData.data.imageUrl,
      static: parsedData.data.static,
      width: parsedData.data.width,
      height: parsedData.data.height,
    });

    return res
      .status(201)
      .send({ message: "Element Created sucessfully", elementId: element._id });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Element couldn't be created" });
  }
};

export const updateElementById = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  try {
    const parsedData = UpdateElementSchema.safeParse(req.body);
    if (!parsedData.success)
      return res.status(400).send({ message: "Validation Error" });

    const params = req.params as { elementId: string };
    const elementId = params?.elementId;
    if (!elementId)
      return res.status(404).send({ message: "Element ID not found" });

    await Element.updateOne(
      { _id: elementId },
      { imageUrl: parsedData.data.imageUrl }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Element couldn't be updated" });
  }
};

export const createAvatar = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const parsedData = CreateAvatarSchema.safeParse(req.body);
    if (!parsedData.success)
      return res.status(400).send({ message: "Validation Error" });

    const avatar = await Avatar.create({
      name: parsedData.data.name,
      imageUrl: parsedData.data.imageUrl,
    });

    await UserModel.findByIdAndUpdate(req.userId, { avatarId: avatar._id });
    return res
      .status(201)
      .send({ message: "Avatar Created sucessfully", avatarId: avatar._id });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Avatar couldn't be created" });
  }
};

export const createMap = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const parsedData = CreateMapSchema.safeParse(req.body);
    if (!parsedData.success)
      return res.status(400).send({ message: "Validation Error" });

    const map = await Map.create({
      name: parsedData.data.name,
      width: parsedData.data.dimensions.split("x")[0],
      height: parsedData.data.dimensions.split("x")[1],
      thumbnail: parsedData.data.thumbnail,
      mapElements: parsedData.data.defaultElements.map((e) => ({
        elementId: new Types.ObjectId(e.elementId),
        x: e.x,
        y: e.y,
      })),
    });
    
    return res
      .status(200)
      .send({ message: "Map created successfully", mapId: map._id });
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).send({ message: "Element couldn't be created" });
  }
};
