import { SocketContent } from "@utils/interface";

export const registerPeerEvents = (ctx: SocketContent) => {
  const { socket, playersMap, fastify } = ctx;

  socket.on("peer:joined", (peerId: string) => {
    const player = playersMap.get(socket.id);
    if (!player) return;

    playersMap.set(socket.id, { ...player, peerId: peerId });
    socket.broadcast.emit("peer:available", peerId);

    for (const [id, existingPlayer] of playersMap.entries()) {
      if (id === socket.id || !existingPlayer.peerId) continue;
      socket.emit("peer:username", {
        peerId: existingPlayer.peerId,
        username: existingPlayer.username,
      });
    }

    fastify.io.emit("peer:username", { peerId, username: player.username });
  });
};