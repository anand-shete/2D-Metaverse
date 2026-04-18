import { socketContext } from "@utils/interface";

export const registerPeerEvents = (ctx: socketContext) => {
  const { socket, playersMap } = ctx;

  socket.on("peer:joined", (peerId: string) => {
    const player = playersMap.get(socket.id);
    if (!player) return;

    playersMap.set(socket.id, { ...player, peerId: peerId });
    socket.broadcast.emit("peer:available", peerId);
  });
};
