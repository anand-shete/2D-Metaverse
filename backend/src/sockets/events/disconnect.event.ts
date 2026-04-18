import { socketContext } from "@utils/interface";

export const registerDisconnectEvent = (ctx: socketContext) => {
  const { socket, playersMap, fastify } = ctx;

  socket.on("disconnect", () => {
    const player = playersMap.get(socket.id);
    if (!player) return;

    fastify.io.emit("peer:disconnect", player.peerId);
    playersMap.delete(socket.id);
  });
};
