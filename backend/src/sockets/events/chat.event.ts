import { ChatModel } from "@models/chat.model";
import { PopulatedChat, socketContext } from "@utils/interface";

export const registerChatEvents = (ctx: socketContext) => {
  const { socket, fastify } = ctx;

  socket.on("chat:history:request", async () => {
    const chats = await ChatModel.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .populate<{ userId: { username: string } }>("userId", "username -_id")
      .select("message userId createdAt -_id")
      .lean<PopulatedChat[]>();

    const result = chats.map(chat => ({
      message: chat.message,
      username: chat.userId.username,
      timestamp: new Date(chat.createdAt).getTime(),
    }));

    socket.emit("chat:history", result.reverse());
  });

  socket.on("chat:send", async (message: string) => {
    const { id: userId, username } = socket.data.user;
    const chat = await ChatModel.create({ message, userId });

    fastify.io.emit("chat:message", { username, message, timestamp: chat.createdAt });
  });
};
