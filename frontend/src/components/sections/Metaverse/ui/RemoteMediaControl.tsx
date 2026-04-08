import { useMetaverseContext } from "@/context/metaverse.context";
import { Maximize2, Minimize2 } from "lucide-react";

const RemoteMediaControl = () => {
  const { remoteVideos, fullScreenPeerId, isVideoActive, setFullScreenPeerId } =
    useMetaverseContext();

  return (
    <div className="fixed top-0 flex h-22 w-screen flex-wrap items-center justify-center space-x-10 border-b bg-slate-800/80">
      {Object.entries(remoteVideos).map(([peerId, videoElement]) => (
        <div
          key={peerId}
          className={`rounded-md border border-slate-400 transition-all duration-300 ${
            fullScreenPeerId === peerId
              ? "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-slate-600/50 p-4 text-white"
              : "relative h-18 w-28 text-white"
          }`}
        >
          <video
            autoPlay
            className="h-full w-full rounded-md object-cover"
            ref={el => {
              if (el && videoElement.srcObject) el.srcObject = videoElement.srcObject;
            }}
          />
          <div
            className={`${
              isVideoActive ? "block" : "hidden"
            } absolute top-0 right-0 cursor-pointer rounded-md bg-black/40 p-0.5`}
            onClick={() => {
              setFullScreenPeerId(prev => (prev === peerId ? null : peerId));
            }}
          >
            {fullScreenPeerId === peerId ? <Minimize2 size={30} /> : <Maximize2 />}
          </div>
          <span className="absolute top-1 left-1 rounded bg-black/50 px-1 text-xs text-white">
            User {peerId.slice(0, 4)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default RemoteMediaControl;
