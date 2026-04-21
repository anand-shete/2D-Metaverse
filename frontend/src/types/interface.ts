import { AnimatedSprite, Container, Spritesheet, Text } from "pixi.js";
import { PlayerMoveAnimation } from "./enum";
import { AvatarId } from "./type";

export interface PlayerMoveData {
  x: number;
  y: number;
  animation: PlayerMoveAnimation;
  avatar: AvatarId;
  username: string;
}

export interface Players {
  [id: string]: PlayerMoveData;
}

export interface RemotePlayerData {
  container?: Container;
  animatedSprite?: AnimatedSprite;
  animatedSpriteCreationPromise?: Promise<AnimatedSprite>;
  username?: Text;
  spritesheet?: Spritesheet;
  animation?: PlayerMoveAnimation;
}

export interface IRemoteVideos {
  [peerId: string]: HTMLVideoElement;
}

export interface IRemotePeerUsernames {
  [peerId: string]: string;
}

export interface InteractionZone {
  id: string;
  url?: string;
  promptText?: string;
  triggerArea: {
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
