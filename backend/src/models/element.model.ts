import { prop, Ref } from "@typegoose/typegoose";
import { Space } from "./space.model";
import { MapElements } from "./mapElements.model";

export class Element {
  @prop({ type: Number })
  width!: number;

  @prop({ type: Number })
  height!: number;

  @prop({ type: Boolean })
  static!: boolean;

  @prop({ type: String })
  imageUrl!: string;

  @prop({ type: Space, ref: () => Space })
  spaces?: Space[];

  @prop({ type: MapElements, ref: () => MapElements })
  mapElements?: MapElements[];
}
