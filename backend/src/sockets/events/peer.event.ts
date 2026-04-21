import { SocketContent } from "@utils/interface";

export const registerPeerEvents = (ctx: SocketContent) => {
  const { socket, playersMap } = ctx;

  socket.on("peer:joined", (peerId: string) => {
    const player = playersMap.get(socket.id);
    if (!player) return;

    playersMap.set(socket.id, { ...player, peerId: peerId });
    socket.broadcast.emit("peer:available", {
      peerId,
      username: player.username,
    });
  });
};
