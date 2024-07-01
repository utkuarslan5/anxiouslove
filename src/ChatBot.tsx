import React, { ComponentProps, useState } from "react";
import { getAccessToken, useQuery, useAction, addChatGroupId } from "wasp/client/operations";
import { parentDispatch } from "./utils/parentDispatch";
import { Views } from "./views/Views";
import { TRANSCRIPT_MESSAGE_ACTION } from "@humeai/voice-embed-react";
import { VoiceProvider, VoiceProviderProps } from "@humeai/voice-react";
import { Box, Button, Stack } from "@chakra-ui/react";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import useMessagesStore, { addMessageToStore } from "./store/messagesStore";
import { useConfigStore } from "./store/config";
import { useAuth } from "wasp/client/auth";
import AnimatedBackdrop from "./components/WebGLBackdrop/AnimatedBackdrop";
import { UserTranscriptMessage, AssistantTranscriptMessage } from "@humeai/voice";
import { Play } from "lucide-react";
import "./Main.css"; // Ensure you import your CSS file

interface ChatBotProps {
  configId: string;
  configVersion: number | undefined;
  className?: string; // Add className prop for custom styling
}

export const ChatBot: React.FC<ChatBotProps> = ({
  configId,
  configVersion,
  className,
}) => {
  const { data: accessToken } = useQuery(getAccessToken);
  const { data: user } = useAuth();
  const addChatGroupIdFn = useAction(addChatGroupId);
  const [isConnecting, setIsConnecting] = useState(false);

  const dispatchMessage: ComponentProps<typeof VoiceProvider>["onMessage"] = (
    message
  ) => {
    posthog.capture("message_received", { message });

    if (
      message.type === "user_message" ||
      message.type === "assistant_message"
    ) {
      addMessageToStore(message);
      parentDispatch(TRANSCRIPT_MESSAGE_ACTION(message));
    }

    if (message.type === "chat_metadata") {
      if (user && !user.chatGroupId) {
        addChatGroupIdFn({ chatGroupId: message.chat_group_id });
      }
    }
  };

  if (!accessToken) {
    return (
      <Stack
        direction={["row"]}
        spacing={4}
        align="center"
        position="absolute"
        bottom="33%"
        left="50%"
        transform="translateX(-50%)"
      >
        <Button
          isLoading
          colorScheme="blackAlpha"
          variant="solid"
          width="50px"
          height="50px"
          borderRadius="full"
          bg="black"
          boxShadow="0 2px 4px rgba(0, 0, 0, 0.15), 0 4px 6px rgba(0, 0, 0, 0.15)"
          _loading={{
            bg: "black",
            color: "white",
            opacity: 1,
          }}
        >
          <Play color="white" size={24} />
        </Button>
      </Stack>
    );
  }

  const config: VoiceProviderProps = {
    hostname: "api.hume.ai",
    reconnectAttempts: 100,
    debug: import.meta.env.NODE_ENV === "development",
    auth: {
      type: "accessToken",
      value: accessToken.accessToken,
    },
    configId: configId,
    configVersion: configVersion,
    resumedChatGroupId: user?.chatGroupId ?? undefined,
  };

  return (
    <PostHogProvider client={posthog}>
      <div className={className}>
        <VoiceProvider
          {...config}
          onMessage={dispatchMessage}
          onError={(err) => {
            posthog.capture("api_error", { error: err });
            console.error("VoiceProvider error:", err);
          }}
          onClose={(e) => {
            posthog.capture("socket_closed", { event: e });
          }}
          messageHistoryLimit={9999}
        >
          <Views />
        </VoiceProvider>
      </div>
    </PostHogProvider>
  );
};
