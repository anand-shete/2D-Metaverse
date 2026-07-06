import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";
import { NoteType } from "@metaverse/shared/interface";

@modelOptions({
  schemaOptions: { timestamps: true },
})
export class Note {
  @prop({ type: String, required: true, unique: true })
  public fileHash!: string;

  @prop({ type: String, required: true })
  public fileName!: string;

  @prop({ type: String, required: true })
  public fileUrl!: string;

  @prop({ type: String })
  public subject?: string;

  @prop({ type: Number })
  public chapter?: number;

  @prop({ type: String, enum: NoteType })
  public noteType?: NoteType;
}

export const NotesModel = getModelForClass(Note);
