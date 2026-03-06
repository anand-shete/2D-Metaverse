export const createPlayer = (): { x: number; y: number } => ({
  x: Math.floor(Math.random() * 701) + 300,
  y: Math.floor(Math.random() * 501) + 100,
});
