import { prop, getModelForClass, Ref } from "@typegoose/typegoose";
import mongoose from "mongoose";
import { Space } from "./space.model";
import { Element } from "./element.model";
import { User } from "./user.model";

export class SpaceElements {
  @prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Element })
  elementId?: Ref<Element>;

  @prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Space })
  spaceId?: Ref<Space>;

  @prop({ type: Number })
  x!: number;

  @prop({ type: Number })
  y!: number;

  @prop({ type: mongoose.Schema.Types.ObjectId, ref: () => User })
  createdBy?: Ref<User>;
}
