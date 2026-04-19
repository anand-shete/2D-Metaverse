import { ChatModel } from "@models/chat.model";
import { triggerMetabotService } from "@service/metabot.service";
import { ChatUserType } from "@utils/enum";
import { PopulatedChat, SocketContent } from "@utils/interface";

export const registerChatEvents = (ctx: SocketContent) => {
  const { socket, fastify } = ctx;

  socket.on("chat:history:request", async () => {
    const chats = await ChatModel.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .populate<{ userId: { username: string } }>("userId", "username -_id")
      .select("message sender userId createdAt -_id")
      .lean<PopulatedChat[]>();

    const result = chats.map(chat => ({
      message: chat.message,
      username: chat.sender === ChatUserType.USER ? chat.userId?.username : "Metabot",
      timestamp: new Date(chat.createdAt).getTime(),
    }));

    socket.emit("chat:history", result.reverse());
  });

  socket.on("chat:send", async (message: string) => {
    const { id: userId, username } = socket.data.user;

    const userChat = await ChatModel.create({ message, userId });
    fastify.io.emit("chat:message", { username, message, timestamp: userChat.createdAt.getTime() });

    const hasMetabot = message.toLowerCase().includes("metabot");
    if (!hasMetabot) return;

    const metabotResponse = await triggerMetabotService(message);
    const botChat = await ChatModel.create({
      message: metabotResponse,
      sender: ChatUserType.METABOT,
    });

    fastify.io.emit("chat:message", {
      username: "Metabot",
      message: metabotResponse,
      timestamp: botChat.createdAt.getTime(),
    });
  });
};
