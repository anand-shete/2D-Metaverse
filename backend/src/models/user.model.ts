import { Types } from "mongoose";
import bcrypt from "bcrypt";
import { getModelForClass, pre, prop, ReturnModelType } from "@typegoose/typegoose";
import { Avatar } from "../types/enum";

@pre<User>("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = bcrypt.hashSync(this.password, salt);
  this.password = hashedPassword;
})
export class User {
  _id!: Types.ObjectId;

  @prop({ type: String, required: true, unique: true })
  username!: string;

  @prop({ type: String, required: true })
  email!: string;

  @prop({ type: String, required: true })
  password!: string;

  @prop({ type: String, enum: Avatar, default: Avatar.BOY1 })
  avatar!: Avatar;

  static async comparePassword(
    this: ReturnModelType<typeof User>,
    candidatePassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(candidatePassword, hashedPassword);
  }
}

export const UserModel = getModelForClass(User);
