import { ConversationFrame } from "../components/ConversationFrame";
import { ConversationScreen } from "./ConversationScreen";
import { ErrorScreen } from "./ErrorScreen";
import { IntroScreen } from "./IntroScreen";
import { EndScreen } from "./EndScreen";
import { useVoice } from "@humeai/voice-react";
import { FC, useState } from "react";
import { match } from "ts-pattern";
import { Center } from "@chakra-ui/react";

export type ViewsProps = Record<never, never>;

export const Views: FC<ViewsProps> = () => {
  const { connect, disconnect, status, error } = useVoice();
  const [conversationEnded, setConversationEnded] = useState(false);

  const onConnect = () => {
    void connect()
      .then(() => {})
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <ConversationFrame
      onClose={() => {
        // close();
        disconnect();
        setConversationEnded(true);
      }}
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
