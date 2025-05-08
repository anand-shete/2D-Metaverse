import { FastifyRequest, FastifyReply } from "fastify";
import {
  AddElementSchema,
  CreateSpaceSchema,
  DeleteElementSchema,
} from "../types";
import { SpaceModel as Space } from "../models";
import { MapModel as Map } from "../models";
import { SpaceElementsModel as SpaceElements } from "../models";
import { MapElementsModel as MapElements } from "../models";
import mongoose from "mongoose";

export const createSpace = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const parsedData = CreateSpaceSchema.safeParse(req.body);
    if (!parsedData.success)
      return res.status(400).send({ message: "Invalid Input." });

    if (!parsedData.data.mapId) {
      const space = await Space.create({
        name: parsedData.data.name,
        width: parsedData.data.dimensions.split("x")[0],
        height: parsedData.data.dimensions.split("x")[1],
        createdBy: req.userId,
        thumbnail: parsedData.data.thumbnail,
      });
      return res
        .status(201)
        .send({ message: "Space has been created", spaceId: space._id });
    }
    // if there is a mapId, get the map and all its elements
    const mapElements = await MapElements.findOne({
      mapId: parsedData.data.mapId,
    }).lean();

    const map = await Map.findOne({ _id: parsedData.data.mapId });
    if (!map) return res.status(403).send({ message: "Map not found" });

    const space = await Space.create({
      name: parsedData.data.name,
      width: parseInt(parsedData.data.dimensions.split("x")[0]),
      height: parseInt(parsedData.data.dimensions.split("x")[1]),
      createdBy: req.userId,
      thumbnail: parsedData.data.thumbnail,
      elements: mapElements,
    });

    await SpaceElements.findOneAndUpdate(
      { spaceId: space._id },
      {
        elementId: mapElements?.elementId,
        x: mapElements?.x,
        y: mapElements?.y,
      }
    );

    return res
      .status(201)
      .send({ message: "Space Created", spaceId: space._id });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Space not found" });
  }
};

export const deleteSpaceById = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  try {
    const params = req.params as { spaceId: string };
    const spaceId = params?.spaceId;

    if (!mongoose.Types.ObjectId.isValid(params?.spaceId))
      return res.status(400).send({ message: "Space ID is not valid" });
    
    const space = await Space.findOne({
      _id: new mongoose.Types.ObjectId(spaceId),
    }).lean();
    if (!space) return res.status(404).send({ message: "Space not found" });

    if (space.createdBy?.toString() !== req.userId)
      return res
        .status(403)
        .send({ message: "User unauthorized to perform deletion" });

    await Space.deleteOne({ _id: spaceId?.toString() });
    return res.status(200).send({ message: "Space deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Error deleting the space" });
  }
};

export const getAllSpaces = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const spaces = await Space.find({ createdBy: req.userId });
    // console.log(req.userId);
    return res.status(200).send({
      spaces: spaces.map((s) => ({
        id: s._id,
        name: s.name,
        dimensions: `${s.width}x${s.height}`,
        thumbnail: s.thumbnail,
      })),
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Error getting all Spaces of User" });
  }
};

export const addElement = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const parsedData = AddElementSchema.safeParse(req.body);
    if (!parsedData)
      return res.status(400).send({ message: "Cannot parse data" });

    const space = await Space.findOne({ createdBy: req.userId });
    if (!space) return res.status(404).send({ message: "Space not found" });

    await SpaceElements.create({
      spaceId: parsedData.data?.spaceId,
      elementId: parsedData.data?.elementId,
      x: parsedData.data?.x,
      y: parsedData.data?.y,
    });
    return res.status(201).send({ message: "Element Added to Spsace" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Error adding element to arena" });
  }
};

export const deleteElement = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const parsedData = DeleteElementSchema.safeParse(req.body);
    if (!parsedData) return res.status(400).send({ message: "Parsing failed" });

    const spaceElement = await SpaceElements.findOne({
      spaceId: parsedData.data?.spaceId,
      _id: parsedData.data?.elementId,
    });
    if (!spaceElement)
      return res.status(404).send({ message: "Space Element not found" });

    const check = await Space.countDocuments({ createdBy: req.userId }).lean();
    if (!check)
      return res
        .status(403)
        .send({ message: "unauthorized to perform deletion" });

    await spaceElement.deleteOne({
      spaceId: spaceElement._id,
      elementId: parsedData.data?.elementId,
    });
    return res.status(200).send({ message: "Element deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Error deleting element" });
  }
};

export const getSpace = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const params = req.params as { spaceId: string };
    const spaceId = params?.spaceId;
    if (!spaceId)
      return res.status(404).send({ message: "Space ID not found" });

    const space = await Space.findOne({ createdBy: req.userId })
      .select("-createdBy")
      .lean();
    if (!space) return res.status(404).send({ message: "Space not found" });

    return res.status(200).send({ message: "Space found", space });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Error " });
  }
};
