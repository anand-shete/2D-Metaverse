import { InteractionZone } from "@/types";

export const whiteBoard: InteractionZone = {
  id: "whiteboard",
  url: "https://app.eraser.io/",
  promptText: "Press X to use whiteboard",
  // pixel based
  highlight: {
    x: 455,
    y: 96,
    height: 92,
    width: 115,
  },
  // tile based
  area: {
    yMin: 3,
    xMin: 3,
    xMax: 18,
    yMax: 10,
  },
};

// export const demo: InteractionZone = {
//   id: "demo",
//   url: "https://app.eraser.io/",
//   promptText: "Press X to use demo",
//   // pixel based
//   highlight: {
//     x: 1500,
//     y: 120,
//     height: 92,
//     width: 115,
//   },
//   // tile based
//   area: {
//     yMin: 3,
//     xMin: 20,
//     xMax: 36,
//     yMax: 10,
//   },
// };

export const interactArray = [whiteBoard];
