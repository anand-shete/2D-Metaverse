export function createCollisionMap(): number[][] {
  const collisionMap = new Array(72).fill(0).map(() => new Array(64).fill(0));

  // all map boundaries
  // collisionMap[71][63] - remember that indices start from 0
  for (let x = 0; x < 64; x++) {
    collisionMap[1][x] = 1;
    collisionMap[x][0] = 1;
    collisionMap[x][63] = 1;
    collisionMap[71][x] = 1;
  }

  // library area
  for (let x = 43; x < 64; x++) {
    collisionMap[26][x] = 1;
    collisionMap[27][x] = 1;
    collisionMap[28][x] = 1;
  }
  // gaming rooms orange map boundary
  for (let x = 0; x < 10; x++) {
    collisionMap[16][x] = 1;
  }

  // inside first gaming room
  // desks
  for (let x = 5; x < 14; x++) {
    collisionMap[8][x] = 1;
  }
  // whiteboard
  collisionMap[3][15] = 1;
  collisionMap[3][16] = 1;

  // first gaming room right wall
  for (let x = 18; x < 30; x++) {
    collisionMap[3][x] = 1;
  }

  // first gaming room, after the door
  for (let x = 16; x < 27; x++) {
    collisionMap[16][x] = 1;
  }
  for (let x = 32; x < 39; x++) {
    collisionMap[16][x] = 1;
  }
  return collisionMap;
}
// (45, 584) to (604, 584)
// Example: A wall at map position (128, 64) to (192, 64)
//   for (let x = 4; x < 6; x++) {
//     collisionMap[2][x] = 1; // x=128→4*32 to 192→6*32,  y=64→2*32
//   }
