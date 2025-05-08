import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { getModelForClass, pre, prop, Ref, ReturnModelType } from "@typegoose/typegoose";
import { Roles } from "../helper/enum";
import { Space } from "./space.model";
import { Avatar } from "./avatar.model";

@pre<User>("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = bcrypt.hashSync(this.password, salt);
  this.password = hashedPassword;
})
export class User {
  _id!: mongoose.Schema.Types.ObjectId;

  @prop({ type: String, required: true })
  username!: string;

  @prop({ type: String, required: true })
  email!: string;

  @prop({ type: String, required: true })
  password!: string;

  @prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Avatar })
  avatarId?: Ref<Avatar>;

  @prop({ type: String, enum: Roles, default: Roles.User })
  role!: Roles;

  @prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Space })
  spaces?: Ref<Space>[];

  static async comparePassword(
    this: ReturnModelType<typeof User>,
    candidatePassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(candidatePassword, hashedPassword);
  }
}
