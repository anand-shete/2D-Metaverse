import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { Types } from "mongoose";

enum ChatUserType {
  USER = "user",
  BOT = "bot",
}

export class Chat {
  @prop({ type: String, required: true })
  message!: string;

  @prop({ type: Types.ObjectId, required: true, ref: "User" })
  userId!: Types.ObjectId;

  @prop({ type: String, enum: ChatUserType, default: ChatUserType.USER })
  type!: ChatUserType;

  @prop({ type: Date })
  createdAt!: Date;
}

export const ChatModel = getModelForClass(Chat, {
  schemaOptions: { timestamps: true },
});
