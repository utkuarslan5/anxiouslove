import { ConversationFrame } from "../components/ConversationFrame";
import { ConversationScreen } from "./ConversationScreen";
import { ErrorScreen } from "./ErrorScreen";
import { IntroScreen } from "./IntroScreen";
import { EndScreen } from "./EndScreen";
import { useVoice } from "@humeai/voice-react";
import { FC, useState } from "react";
import { match } from "ts-pattern";
import { Center } from "@chakra-ui/react";
import { getTimeOfDay } from "../utils";

export type ViewsProps = Record<never, never>;

export const Views: FC<ViewsProps> = () => {
  const { connect, disconnect, status, error, clearMessages, sendUserInput } = useVoice();
  const [conversationEnded, setConversationEnded] = useState(false);

  const onConnect = () => {
    void connect()
      .then(() => {
        setTimeout(() => {
          const now = new Date();
          const formattedDate = now.toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          const formattedTime = now.toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
          });
          const timeOfDay = getTimeOfDay();

          // Create a context message for the assistant
          const contextMessage = `Hi. It's ${formattedDate}, ${formattedTime}. It's ${timeOfDay} now. Ask me How's it going? Got any plans for today? How's everything going on my end? Randomize and make it feel natural and non-repetitive, keep it low-key and casual`;

          // Send the context message to the assistant
          sendUserInput(contextMessage);
          console.log(contextMessage);
        }, 1000); // Wait for 1 second before sending the message





      })
      .catch((e) => {
        console.error(e);
      });
  };
  
  
  

  return (
    <ConversationFrame
      onClose={() => {
        disconnect();
        setConversationEnded(true);
      }}
      onRefresh={clearMessages}
    >
      {match(status.value)
        .with("error", () => {
          return (
            <ErrorScreen
              errorType={error?.type ?? ("unknown" as const)}
              errorReason={error?.message ?? "Unknown"}
              onConnect={onConnect}
              isConnecting={status.value === "connecting"}
            />
          );
        })
        .with("disconnected", "connecting", () => {
          return (
            <IntroScreen
              onConnect={onConnect}
              isConnecting={status.value === "connecting"}
            />
          );
        })
        .with("connected", () => {
          return <ConversationScreen />;
        })
        .exhaustive()}
    </ConversationFrame>
  );
};
