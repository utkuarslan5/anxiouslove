import React, { ComponentProps, useState, useEffect } from "react";
import { getHumeConfig, useQuery } from "wasp/client/operations";
import { parentDispatch } from "./utils/parentDispatch";
import { Views } from "./views/Views";
import { TRANSCRIPT_MESSAGE_ACTION } from "@humeai/voice-embed-react";
import { VoiceProvider, VoiceProviderProps } from "@humeai/voice-react";
import { Box } from "@chakra-ui/react";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import useMessagesStore, { addMessageToStore } from "./store/messagesStore";
import { useConfigStore } from "./store/config";
import {
  UserTranscriptMessage,
  AssistantTranscriptMessage,
} from "@humeai/voice";

export const ChatBot = () => {
  const { data: humeConfig } = useQuery(getHumeConfig);
  const [chatGroupId, setChatGroupId] = useState<string | undefined>(undefined);
  const { setConfig } = useConfigStore();

  const dispatchMessage: ComponentProps<typeof VoiceProvider>["onMessage"] = (
    message
  ) => {
    posthog.capture("message_received", {
      message,
    });

    if (
      message.type === "user_message" ||
      message.type === "assistant_message"
    ) {
      addMessageToStore(message);
      parentDispatch(TRANSCRIPT_MESSAGE_ACTION(message));
    }

    // Handle chat_metadata message to extract chat_group_id
    if (message.type === "chat_metadata") {
      setChatGroupId(message.chat_group_id);
      console.log("chatGroupId:", message.chat_group_id); // Consistent naming
    }
  };

  useEffect(() => {
    if (chatGroupId && humeConfig?.accessToken) {
      const newConfig: VoiceProviderProps = {
        hostname: "api.hume.ai",
        reconnectAttempts: 30,
        debug: import.meta.env.NODE_ENV === "development", // Set debug true if development
        auth: {
          type: "accessToken",
          value: humeConfig.accessToken,
        },
        configId: "11df331e-ee63-4459-ba66-2ca2dee47f81",
        configVersion: 18,
        resumedChatGroupId: chatGroupId,
      };

      console.log("Setting new config:", newConfig);

      setConfig(newConfig);
    }
  }, [chatGroupId, humeConfig, setConfig]);

  if (!humeConfig?.accessToken) {
    return <div>Loading...</div>; // or some loading indicator
  }

  const config: VoiceProviderProps = {
    hostname: "api.hume.ai",
    reconnectAttempts: 30,
    debug: import.meta.env.NODE_ENV === "development",
    auth: {
      type: "accessToken",
      value: humeConfig.accessToken,
    },
    configId: "11df331e-ee63-4459-ba66-2ca2dee47f81",
    configVersion: 18,
    resumedChatGroupId: chatGroupId,
  };

  return (
    <PostHogProvider client={posthog}>
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
      >
        <Views />
      </VoiceProvider>
    </PostHogProvider>
  );
};
