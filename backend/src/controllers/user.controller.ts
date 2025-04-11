import { FastifyRequest, FastifyReply } from "fastify";
import { UpdateMetadataSchema } from "../types";
import { AvatarModel, UserModel as User } from "../models";
import mongoose, { Types } from "mongoose";

export const metadata = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const parsedData = UpdateMetadataSchema.safeParse(req.body);
    if (!parsedData.success)
      return res
        .status(400)
        .send({ message: "Invalid Request. Check input fields." });

    if (!mongoose.Types.ObjectId.isValid(parsedData.data.avatarId))
      return res.status(400).send({ message: "Avatar ID is not valid" });
    
    const check = await AvatarModel.countDocuments({
      _id: new Types.ObjectId(parsedData.data.avatarId),
    }).lean();
    if (!check) return res.status(404).send({ message: "Avatar not found" });

    await User.updateOne(
      { _id: req.userId },
      { avatarId: parsedData.data.avatarId }
    ).lean();
  } catch (error: any) {
    console.log(error);
    return res.status(500).send({ message: "avatarId cannot be updated" });
  }
};

export const getUserMetadata = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  try {
    const query = req.query as { ids: string };
    const userIds: Array<string> = JSON.parse(query?.ids);

    const metadata = await User.find({ _id: { $in: userIds } })
      .select("avatarId")
      .lean();
    if (!metadata)
      return res.status(404).send({ message: "Avatar ID does not exists" });

    return res.status(200).send({
      avatars: metadata.map((m) => ({
        userId: new Types.ObjectId(m._id.toString()),
        avatarId: m.avatarId,
      })),
    });
  } catch (error: any) {
    console.log(error.message);
    return res
      .status(500)
      .send({ message: "User metadata couldn't be updated" });
  }
};
