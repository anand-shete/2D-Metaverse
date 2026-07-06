import { InteractionZone } from "@/types/interface";

const spawnDocument: InteractionZone = {
  id: "spawn_doc",
  url: "https://www.notion.so/Metaverse-Rules-33ca4b810918805c8d00d618607f73d0",
  promptText: "Press X to read Document",
  highlight: { x: 890, y: 950, height: 40, width: 34 },
  triggerArea: { yMin: 30, xMin: 24, xMax: 34, yMax: 35 },
};

const whiteBoard: InteractionZone = {
  id: "whiteboard",
  url: "https://excalidraw.com/#room=54811235ce6d1678d357,Npenw2hcDGhNDce-R1gG0A",
  promptText: "Press X to use whiteboard",
  // pixel based
  highlight: { x: 455, y: 96, height: 92, width: 115 },
  // tile based
  triggerArea: { yMin: 3, xMin: 3, xMax: 18, yMax: 10 },
};

const music: InteractionZone = {
  id: "music",
  url: "https://open.spotify.com",
  promptText: "Press X to listen Music",
  highlight: { x: 1315, y: 90, height: 80, width: 270 },
  triggerArea: { yMin: 2, xMin: 38, xMax: 63, yMax: 12 },
};

const uploadNotes: InteractionZone = {
  id: "uploadNotes",
  promptText: "Press X to Upload Notes",
  highlight: { x: 1480, y: 900, height: 86, width: 105 },
  triggerArea: { yMin: 24, xMin: 40, xMax: 52, yMax: 35 },
};

const viewArchives: InteractionZone = {
  id: "viewArchives",
  promptText: "Press X to View archives",
  highlight: { x: 1760, y: 900, height: 90, width: 100 },
  triggerArea: { yMin: 24, xMin: 52, xMax: 63, yMax: 35 },
};

const pacMan: InteractionZone = {
  id: "pacMan",
  promptText: "Press X to play Pac Man",
  url: "https://www.google.com/logos/2010/pacman10-i.html",
  highlight: { x: 415, y: 1830, height: 130, width: 60 },
  triggerArea: { yMin: 56, xMin: 10, xMax: 20, yMax: 63 },
};

const quickDraw: InteractionZone = {
  id: "quickDraw",
  promptText: "Press X to play Quick Draw",
  url: "https://quickdraw.withgoogle.com/",
  highlight: { x: 65, y: 1830, height: 130, width: 60 },
  triggerArea: { yMin: 56, xMin: 0, xMax: 10, yMax: 63 },
};

const hurdles: InteractionZone = {
  id: "hurdles",
  promptText: "Press X to play Hurdles",
  url: "https://www.google.com/logos/2012/hurdles-2012-hp.html",
  highlight: { x: 30, y: 2015, height: 130, width: 60 },
  triggerArea: { yMin: 63, xMin: 0, xMax: 10, yMax: 68 },
};

const solitaire: InteractionZone = {
  id: "solitaire",
  promptText: "Press X to play Solitaire",
  url: "https://www.google.com/logos/fnbx/solitaire/standalone.4.html?hl=en&origin=www.google.com",
  highlight: { x: 795, y: 1830, height: 130, width: 60 },
  triggerArea: { yMin: 56, xMin: 20, xMax: 30, yMax: 63 },
};

// const halloween: InteractionZone = {
//   id: "halloween",
//   promptText: "Press X to play Halloween",
//   url: "https://doodles.google/doodle/halloween-2016/",
//   highlight: { x: 950, y: 2015, height: 130, width: 60 },
//   triggerArea: { yMin: 63, xMin: 20, xMax: 40, yMax: 68 },
// };

export const interactArray = [
  spawnDocument,
  whiteBoard,
  music,
  uploadNotes,
  viewArchives,
  pacMan,
  quickDraw,
  hurdles,
  solitaire,
];
