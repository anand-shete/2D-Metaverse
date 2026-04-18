import { InteractionZone } from "@/types/interface";

const spawnDocument: InteractionZone = {
  id: "spawn_doc",
  url: "https://www.notion.so/Metaverse-Rules-33ca4b810918805c8d00d618607f73d0",
  promptText: "Press X to read Document",
  highlight: { x: 890, y: 950, height: 40, width: 34 },
  area: { yMin: 30, xMin: 24, xMax: 34, yMax: 35 },
};

const whiteBoard: InteractionZone = {
  id: "whiteboard",
  // FIXME implement excalidraw-room
  url: "https://excalidraw.com/#room=54811235ce6d1678d357,Npenw2hcDGhNDce-R1gG0A",
  promptText: "Press X to use whiteboard",
  // pixel based
  highlight: { x: 455, y: 96, height: 92, width: 115 },
  // tile based
  area: { yMin: 3, xMin: 3, xMax: 18, yMax: 10 },
};

const disco: InteractionZone = {
  id: "disco",
  url: "https://open.spotify.com",
  promptText: "Press X to listen Music",
  // pixel based
  highlight: { x: 1315, y: 90, height: 80, width: 270 },
  // tile based
  area: { yMin: 2, xMin: 38, xMax: 63, yMax: 12 },
};

const library: InteractionZone = {
  id: "library",
  url: "https://www.ndl.gov.in/",
  promptText: "Press X to use Library",
  highlight: { x: 1560, y: 910, height: 80, width: 120 },
  area: { yMin: 24, xMin: 40, xMax: 63, yMax: 35 },
};

export const interactArray = [spawnDocument, whiteBoard, disco, library];
