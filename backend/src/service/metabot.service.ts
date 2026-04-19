import { checkUserIntent } from "./intent.service";

export const triggerMetabotService = async (message: string) => {
  const { intent, confidence } = await checkUserIntent(message);

  if (intent === "retrieve" && confidence > 0.7) {
    return "Trigger retrival mechanism....";
  } else {
    return "I'm Metabot! I can help you find your notes. Try asking 'metabot find my RL notes'.";
  }
};
