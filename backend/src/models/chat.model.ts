import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { ChatUserType } from "@utils/enum";
import { Types } from "mongoose";

class ChatNote {
  @prop({ type: String, required: true })
  fileName!: string;

  @prop({ type: String, required: true })
  fileUrl!: string;
}

export class Chat {
  @prop({ type: String, required: true })
  message!: string;

  @prop({ type: String, enum: ChatUserType, default: ChatUserType.USER })
  sender!: ChatUserType;

  @prop({ type: Types.ObjectId, ref: "User" })
  userId?: Types.ObjectId;

  @prop({ type: [ChatNote], default: [], _id: false })
  notes?: ChatNote[];

  @prop({ type: Date })
  createdAt!: Date;
}

export const ChatModel = getModelForClass(Chat, {
  schemaOptions: { timestamps: true },
});
