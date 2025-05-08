import { prop, getModelForClass, modelOptions, Ref } from "@typegoose/typegoose";
import { MapElements } from "./mapElements.model";

export class Map {
  @prop({ type: String })
  name!: string;

  @prop({ type: Number })
  width!: number;

  @prop({ type: Number })
  height!: number;

  @prop({ type: String })
  thumbnail!: string;

  @prop({ type: MapElements, ref: () => MapElements })
  mapElements?: MapElements[];
}
  