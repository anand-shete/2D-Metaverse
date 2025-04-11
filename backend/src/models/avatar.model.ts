import mongoose from "mongoose";
import { prop, Ref } from "@typegoose/typegoose";
import { User } from "./user.model";

export class Avatar {
  @prop({ type: String })
  name!: string;

  @prop({ type: String })
  imageUrl!: string;

  @prop({ type: User, ref: () => User })
  users?: User[];
}
