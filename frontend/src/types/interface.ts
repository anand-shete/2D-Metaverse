import { PlayerMoveAnimation } from "./enum";
import { AvatarId } from "./type";

export interface PlayerMoveData {
  x: number;
  y: number;
  animation: PlayerMoveAnimation;
  avatar: AvatarId;
}

export interface Players {
  [id: string]: PlayerMoveData;
}

export interface IRemoteVideos {
  [peerid: string]: HTMLVideoElement;
}

export interface InteractionZone {
  id: string;
  url?: string;
  promptText?: string;
  area: {
    yMin: number;
    yMax: number;
    xMin: number;
    xMax: number;
  };
  highlight: { x: number; y: number; width: number; height: number };
}

export interface TileBounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface AvatarConfig {
  texture: string;
  sheet: any;
}
