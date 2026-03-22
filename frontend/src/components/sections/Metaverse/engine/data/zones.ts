import { InteractionZone } from "@/types/interface";

const whiteBoard: InteractionZone = {
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

const disco: InteractionZone = {
  id: "disco",
  url: "https://open.spotify.com",
  promptText: "Press X to listen Music",
  // pixel based
  highlight: {
    x: 1315,
    y: 90,
    height: 80,
    width: 270,
  },
  // tile based
  area: {
    yMin: 2,
    xMin: 38,
    xMax: 63,
    yMax: 12,
  },
};

const library: InteractionZone = {
  id: "library",
  url: "https://www.ndl.gov.in/",
  promptText: "Press X to use Library",
  // pixel based
  highlight: {
    x: 1560,
    y: 910,
    height: 80,
    width: 120,
  },
  // tile based
  area: {
    yMin: 24,
    xMin: 40,
    xMax: 63,
    yMax: 35,
  },
};

export const interactArray = [whiteBoard, disco, library];
