export enum Keys {
  w = "w",
  a = "a",
  s = "s",
  d = "d",
}

export const enum PlayerMoveAnimation {
  IDLE = "idle",
  FRONT = "front",
  BACK = "back",
  LEFT = "left",
  RIGHT = "right",
}

export const enum PlayerConfig {
  TILE_SIZE = 32,
  PLAYER_WIDTH = 48,
  PLAYER_HEIGHT = 48,
  MOVE_SPEED = 8,
  SOCKET_THROTTLE_MS = 100,
}
