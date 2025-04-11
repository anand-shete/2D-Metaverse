import { prop, getModelForClass, Ref } from "@typegoose/typegoose";
import { User } from "./user.model";
import mongoose from "mongoose";
import { SpaceElements } from "./spaceElements.model";

export class Space {
  @prop({ type: String, required: true })
  name!: string;

  @prop({ type: Number, required: true })
  width!: number;

  @prop({ type: Number, required: true })
  height!: number;

  @prop({ type: String })
  thumbnail?: string;

  @prop({ type: mongoose.Schema.Types.ObjectId, ref: () => SpaceElements })
  elements?: Ref<SpaceElements>[];

  @prop({ type: mongoose.Schema.Types.ObjectId, ref: () => User })
  createdBy?: Ref<User>;
}
