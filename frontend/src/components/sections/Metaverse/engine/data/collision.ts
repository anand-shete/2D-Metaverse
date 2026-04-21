export function createCollisionMap(): number[][] {
  const collisionMap = new Array(72).fill(0).map(() => new Array(64).fill(0));

  // collisionMap[y][x] - collisionMap[71][63] - indices start from 0

  // map boundaries
  for (let y = 0; y < 71; y++) {
    collisionMap[y][0] = 1;
    collisionMap[y][63] = 1;
  }
  for (let x = 0; x < 63; x++) {
    collisionMap[0][x] = 1;
    collisionMap[70][x] = 1;
  }

  // console.log("collisionMap", collisionMap);

  // Room 1
  // top wall
  for (let x = 2; x < 17; x++) {
    collisionMap[3][x] = 1;
  }
  // right wall
  for (let y = 5; y < 15; y++) {
    collisionMap[y][18] = 1;
  }
  // bottom walls
  for (let x = 0; x < 11; x++) {
    collisionMap[15][x] = 1;
    collisionMap[16][x] = 1;
    collisionMap[17][x] = 1;
  }
  for (let x = 16; x < 27; x++) {
    collisionMap[15][x] = 1;
    collisionMap[16][x] = 1;
    collisionMap[17][x] = 1;
  }
  // left wall - racks
  for (let x = 4; x < 15; x++) {
    collisionMap[x][1] = 1;
  }
  // desks
  for (let x = 5; x < 14; x++) {
    collisionMap[8][x] = 1;
    collisionMap[9][x] = 1;
  }

  // Room 2
  // top wall
  for (let x = 18; x < 38; x++) {
    collisionMap[3][x] = 1;
  }
  // left wall
  for (let y = 5; y < 15; y++) {
    collisionMap[y][19] = 1;
  }
  // bottom wall
  for (let x = 32; x < 39; x++) {
    collisionMap[15][x] = 1;
    collisionMap[16][x] = 1;
    collisionMap[17][x] = 1;
  }
  // desks
  for (let x = 24; x < 34; x++) {
    collisionMap[8][x] = 1;
    collisionMap[9][x] = 1;
  }
  // right wall
  for (let y = 5; y < 15; y++) {
    collisionMap[y][38] = 1;
  }

  // Room 3 - Disco
  // top wall
  for (let x = 38; x < 63; x++) {
    collisionMap[3][x] = 1;
  }

  // Room 4
  // top wall
  for (let x = 1; x < 16; x++) {
    collisionMap[25][x] = 1;
    collisionMap[26][x] = 1;
    collisionMap[27][x] = 1;
    collisionMap[28][x] = 1;
  }
  // right wall
  for (let y = 26; y < 37; y++) {
    collisionMap[y][16] = 1;
  }
  for (let y = 42; y < 44; y++) {
    collisionMap[y][16] = 1;
  }
  // bottom wall
  for (let x = 1; x < 17; x++) {
    collisionMap[45][x] = 1;
    collisionMap[46][x] = 1;
    collisionMap[47][x] = 1;
  }
  // desk
  for (let x = 34; x < 40; x++) {
    collisionMap[x][6] = 1;
    collisionMap[x][7] = 1;
    collisionMap[x][8] = 1;
  }

  // Room 5 - spawn
  // top wall
  for (let x = 24; x < 36; x++) {
    collisionMap[25][x] = 1;
    collisionMap[26][x] = 1;
    collisionMap[27][x] = 1;
    collisionMap[28][x] = 1;
  }

  // left wall
  for (let y = 25; y < 48; y++) collisionMap[y][23] = 1;

  // right wall
  for (let y = 25; y < 37; y++) collisionMap[y][35] = 1;

  // bottom wall
  for (let x = 25; x < 36; x++) {
    collisionMap[45][x] = 1;
    collisionMap[46][x] = 1;
    collisionMap[47][x] = 1;
  }

  // Room 6 - library
  // top wall
  for (let x = 43; x < 64; x++) {
    collisionMap[26][x] = 1;
    collisionMap[27][x] = 1;
    collisionMap[28][x] = 1;
  }

  // tables
  for (let x = 46; x < 50; x++) {
    collisionMap[37][x] = 1;
    collisionMap[38][x] = 1;
    collisionMap[39][x] = 1;
    collisionMap[40][x] = 1;
    collisionMap[41][x] = 1;
  }
  for (let x = 56; x < 59; x++) {
    collisionMap[37][x] = 1;
    collisionMap[38][x] = 1;
    collisionMap[39][x] = 1;
    collisionMap[40][x] = 1;
    collisionMap[41][x] = 1;
  }

  // bottom wall
  for (let x = 43; x < 64; x++) {
    collisionMap[45][x] = 1;
    collisionMap[46][x] = 1;
    collisionMap[47][x] = 1;
  }

  // Room 7 - Game room
  // top wall
  for (let x = 0; x < 16; x++) {
    collisionMap[56][x] = 1;
    collisionMap[57][x] = 1;
    collisionMap[58][x] = 1;
  }
  for (let x = 22; x < 38; x++) {
    collisionMap[56][x] = 1;
    collisionMap[57][x] = 1;
    collisionMap[58][x] = 1;
  }

  // left wall
  for (let y = 58; y < 71; y++) {
    collisionMap[y][0] = 1;
    collisionMap[y][1] = 1;
  }

  // right wall
  for (let y = 58; y < 71; y++) {
    collisionMap[y][31] = 1;
    collisionMap[y][32] = 1;
  }

  // Room 8
  // top wall
  for (let x = 43; x < 63; x++) {
    collisionMap[56][x] = 1;
    collisionMap[57][x] = 1;
    collisionMap[58][x] = 1;
  }
  // table 1
  for (let x = 41; x < 44; x++) {
    collisionMap[63][x] = 1;
    collisionMap[64][x] = 1;
    collisionMap[65][x] = 1;
    collisionMap[66][x] = 1;
  }
  // table 2
  for (let x = 52; x < 55; x++) {
    collisionMap[63][x] = 1;
    collisionMap[64][x] = 1;
    collisionMap[65][x] = 1;
    collisionMap[66][x] = 1;
  }

  return collisionMap;
}

// collisionMap[y][x] - collisionMap[71][63] - indices start from 0
