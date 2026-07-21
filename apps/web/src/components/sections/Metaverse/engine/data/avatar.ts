import { AvatarId } from "@/types/type";
import { boy1, boy1Json, girl2, girl2Json } from "@/assets";
import type { SpritesheetData } from "pixi.js";

export const AvatarConfig: Record<
  AvatarId,
  {
    texture: string;
    sheet: SpritesheetData;
  }
> = {
  boy1: { texture: boy1, sheet: boy1Json },
  boy2: { texture: boy1, sheet: boy1Json },
  girl1: { texture: girl2, sheet: girl2Json },
  girl2: { texture: girl2, sheet: girl2Json },
};
