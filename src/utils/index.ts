import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { UserTranscriptMessage, AssistantTranscriptMessage } from "@humeai/voice";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateAverageEmotionMessage(
  messages: UserTranscriptMessage[]
): AssistantTranscriptMessage {
  const userEmotions: Record<string, number> = {};
  let userMessageCount = 0;

  messages.forEach((message) => {
    if (message.type === "user_message" && message.models.prosody) {
      userMessageCount++;
      Object.entries(message.models.prosody.scores).forEach(([emotion, score]) => {
        userEmotions[emotion] = (userEmotions[emotion] || 0) + score;
      });
    }
  });

  // Calculate the average scores
  Object.keys(userEmotions).forEach((emotion) => {
    userEmotions[emotion] /= userMessageCount;
  });

  // Create a new assistant message object with the average emotions
  const averageEmotionMessage: AssistantTranscriptMessage = {
    type: "assistant_message",
    message: {
      role: "assistant",
      content: "Conversation Average",
    },
    id: "conversation-average", // Add a unique identifier for the message
    models: {
      prosody: {
        scores: userEmotions,
      },
    },
    from_text: false, // Set from_text to false since it's not generated from text
    receivedAt: new Date(), // Add the receivedAt property with the current date
  };

  return averageEmotionMessage;
}