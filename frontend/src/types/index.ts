export interface Players {
  [id: string]: { x: number; y: number };
}

export interface IRemoteVideos {
  [peerid: string]: HTMLVideoElement;
}

export interface InteractionZone {
  id: string;
  url?: string;
  promptText?: string;
  area: {
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
