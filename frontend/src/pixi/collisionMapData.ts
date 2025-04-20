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

  // gaming rooms orange map boundary
  for (let x = 0; x < 10; x++) {
    collisionMap[16][x] = 1;
  }

  // gaming room first door
  for (let x = 10; x < 16; x++) {
    collisionMap[16][x] = 1;
  }

  // first gaming room, after the door
  for (let x = 16; x < 20; x++) {
    collisionMap[16][x] = 1;
  }
  return collisionMap;
}
// (45, 584) to (604, 584)
// Example: A wall at map position (128, 64) to (192, 64)
//   for (let x = 4; x < 6; x++) {
//     collisionMap[2][x] = 1; // x=128→4*32 to 192→6*32,  y=64→2*32
//   }
