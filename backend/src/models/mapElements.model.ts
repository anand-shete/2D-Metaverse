import { prop, getModelForClass, Ref } from "@typegoose/typegoose";
import mongoose from "mongoose";
import { Map } from "./map.model";
import { Element } from "./element.model";

export class MapElements {
  @prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Map })
  mapId?: Ref<Map>;

  @prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Element })
  elementId?: Ref<Element>;

  @prop({ type: Number })
  x?: number;

  @prop({ type: Number })
  y?: number;
}
