import { ConversationFrame } from "../components/ConversationFrame";
import { ConversationScreen } from "./ConversationScreen";
import { ErrorScreen } from "./ErrorScreen";
import { IntroScreen } from "./IntroScreen";
import { EndScreen } from "./EndScreen";
import { useVoice } from "@humeai/voice-react";
import { FC, useState } from "react";
import { match } from "ts-pattern";
import { Box, Center } from "@chakra-ui/react";
import {
  UserTranscriptMessage,
  AssistantTranscriptMessage,
} from "@humeai/voice";

type MessageType = UserTranscriptMessage | AssistantTranscriptMessage;

export type ViewsProps = {
  messages: MessageType[];
};

// export type ViewsProps = Record<never, never>;

export const Views: FC<ViewsProps> = ({ messages }) => {
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
    <Center h="100vh">
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
              <Box>
                <ErrorScreen
                  errorType={error?.type ?? ("unknown" as const)}
                  errorReason={error?.message ?? "Unknown"}
                  onConnect={onConnect}
                  isConnecting={status.value === "connecting"}
                />
              </Box>
            );
          })
          .with("disconnected", "connecting", () => {
            return conversationEnded ? (
              <Box>
                <EndScreen 
                messages={messages} 
                onTryAgain={() => setConversationEnded(false)}/>
              </Box>
            ) : (
              <Box>
                <IntroScreen
                  onConnect={onConnect}
                  isConnecting={status.value === "connecting"}
                />
              </Box>
            );
          })
          .with("connected", () => {
            return (
              <Box>
                <ConversationScreen />
              </Box>
            );
          })
          .exhaustive()}
      </ConversationFrame>
    </Center>
  );
};
