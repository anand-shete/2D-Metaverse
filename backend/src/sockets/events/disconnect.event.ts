import { SocketContent } from "@utils/interface";

export const registerDisconnectEvent = (ctx: SocketContent) => {
  const { socket, playersMap, fastify } = ctx;

  socket.on("disconnect", () => {
    const player = playersMap.get(socket.id);
    if (!player) return;

    fastify.io.emit("peer:disconnect", player.peerId);
    playersMap.delete(socket.id);

    fastify.io.emit("player:online", playersMap.size);
  });
};
