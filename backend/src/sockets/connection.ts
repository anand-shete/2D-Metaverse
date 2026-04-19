import { Socket } from "socket.io";
import { FastifyInstance } from "fastify";
import { PlayerMoveData, SocketContent } from "@utils/interface";
import { ChatModel } from "@models/chat.model";
import { registerChatEvents } from "./events/chat.event";
import { registerPlayerEvents } from "./events/player.event";
import { registerPeerEvents } from "./events/peer.event";
import { registerDisconnectEvent } from "./events/disconnect.event";

const playersMap: Map<string, PlayerMoveData> = new Map();

export const handleConnection = async (socket: Socket, fastify: FastifyInstance) => {
  const { id: socketId } = socket;

  playersMap.set(socketId, {
    x: -1000,
    y: -1000,
    animation: "idle",
    avatar: socket.data.user.avatar,
    username: socket.data.user.username,
  });

  const ctx: SocketContent = { socket, fastify, playersMap };

  registerChatEvents(ctx);

  registerPlayerEvents(ctx);

  registerPeerEvents(ctx);

  registerDisconnectEvent(ctx);
};
