export interface Players {
  [id: string]: { x: number; y: number };
}

export interface IRemoteVideos {
  [peerid: string]: HTMLVideoElement;
}

type InteractionZone = {
  id: string;
  label: string;
  key: string;
  url: string;
  trigger: { x: number; y: number; width: number; height: number };
  highlight: { x: number; y: number; width: number; height: number };
};
