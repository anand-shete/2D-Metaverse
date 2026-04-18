import { PlayerMoveData, socketContext } from "@utils/interface";

export const registerPlayerEvents = (ctx: socketContext) => {
  const { socket, fastify, playersMap } = ctx;

  socket.on("player:move", (data: PlayerMoveData) => {
    const check = playersMap.get(socket.id);
    if (!check) return;

    playersMap.set(socket.id, { ...check, ...data });
    fastify.io.emit("player:update", Object.fromEntries(playersMap));
  });
};
