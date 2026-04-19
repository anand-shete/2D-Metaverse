import { env } from "@config/env.config";
import { GroqModel } from "@utils/enum";
import { IUserIntent } from "@utils/interface";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: env.GROQ_API_KEY });

export const checkUserIntent = async (message: string) => {
  const prompt = `
    SYSTEM: You are the brain of "Metabot", an agentic notes-retrieval system  that fetches files from AWS S3 archives. The user has already invoked you. Your job is to only classify the intent of user.

    INTENT DEFINITIONS:
    1. "retrieve": User wants to find specific notes or documents (e.g., "get my RL notes", "find physics archive").
    2. "info": User is asking what Metabot is, how it works, or what it can do.

    OUTPUT FORMAT:
    Return ONLY a JSON object. Do not include prose.

    {
    "intent": "retrieve" | "info",
    "confidence": 0.0-1.0,
    }`;

  const response = await groq.chat.completions.create({
    model: GroqModel.QUICK,
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: message },
    ],
    response_format: { type: "json_object" },
  });

  console.log(response?.choices[0]?.message.content);
  const object: IUserIntent = JSON.parse(response?.choices[0]?.message.content as string);

  return object;
};
