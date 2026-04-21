import { Button } from "@/components/ui/button";
import { useMetaverseContext } from "@/context/metaverse.context";
import { LogOut, Maximize2, Minimize2 } from "lucide-react";
import { useNavigate } from "react-router";

const RemoteMediaControl = () => {
  const navigate = useNavigate();
  const {
    remoteVideos,
    remotePeerUsernames,
    fullScreenRemoteUser,
    isVideoActive,
    setFullScreenRemoteUser,
  } = useMetaverseContext();

  return (
    <div className="fixed top-0 left-0 z-50 h-20 w-full border-b bg-slate-800/80">
      <Button
        className="absolute top-1/2 left-4 flex -translate-y-1/2 text-black"
        onClick={() => navigate("/")}
      >
        <LogOut />
        <span>Exit</span>
      </Button>

      <div className="flex h-full w-full items-center justify-center gap-10 px-20">
        {Object.entries(remoteVideos).length === 0 && (
          <p className="text-center text-sm text-neutral-200 md:w-5xl xl:w-6xl">
            Waiting for others to join...
          </p>
        )}

        {Object.entries(remoteVideos).map(([peerId, videoElement]) => (
          <div
            key={peerId}
            className={`rounded-md border border-slate-400 transition-all duration-300 ${
              fullScreenRemoteUser === peerId
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
              className={`${isVideoActive ? "block" : "hidden"} absolute top-0 right-0 cursor-pointer rounded-md bg-black/40 p-0.5`}
              onClick={() => setFullScreenRemoteUser(prev => (prev === peerId ? null : peerId))}
            >
              {fullScreenRemoteUser === peerId ? <Minimize2 size={30} /> : <Maximize2 />}
            </div>
            <span className="absolute top-1 left-1 rounded bg-black/50 px-1 text-xs text-white">
              {remotePeerUsernames[peerId] ?? `User ${peerId.slice(0, 4)}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RemoteMediaControl;
