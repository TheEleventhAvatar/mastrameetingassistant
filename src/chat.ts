import { Chat } from "chat";
import { createSlackAdapter } from "@chat-adapter/slack";
import { createMemoryState } from "@chat-adapter/state-memory";
import { meetingAssistant } from "./mastra/agents/meeting-assistant";

export const bot = new Chat({
  userName: "meeting-assistant",
  adapters: {
    slack: createSlackAdapter(),
  },
  // In memory for local dev
  // move to redis backed in a prod deployment
  // @chat-adapter/state-redis
  state: createMemoryState(),
});

bot.onNewMention(async (thread, message) => {
  await thread.subscribe();
  await thread.startTyping();

  const result = await meetingAssistant.generate(message.text);
  await thread.post(result.text);
});

bot.onSubscribedMessage(async (thread, message) => {
  await thread.startTyping();

  const result = await meetingAssistant.generate(message.text);
  await thread.post(result.text);
});
