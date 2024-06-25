import React, { ComponentProps, useState, useEffect } from "react";
import {
  getAccessToken,
  useQuery,
  useAction,
  addChatGroupId,
} from "wasp/client/operations";
import { parentDispatch } from "./utils/parentDispatch";
import { Views } from "./views/Views";
import { TRANSCRIPT_MESSAGE_ACTION } from "@humeai/voice-embed-react";
import {
  VoiceProvider,
  VoiceProviderProps,
  useVoice,
} from "@humeai/voice-react";
import { Box } from "@chakra-ui/react";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import useMessagesStore, { addMessageToStore } from "./store/messagesStore";
import { useConfigStore } from "./store/config";
import { useAuth } from "wasp/client/auth";
import AnimatedBackdrop from "./components/WebGLBackdrop/AnimatedBackdrop";
import {
  UserTranscriptMessage,
  AssistantTranscriptMessage,
} from "@humeai/voice";

export const ChatBot = () => {
  const { data: accessToken } = useQuery(getAccessToken);
  const { data: user } = useAuth();
  const addChatGroupIdFn = useAction(addChatGroupId);

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

    if (message.type === "chat_metadata") {
      if (user && !user.chatGroupId) {
        // If the user does not have a chat group ID, set it in the database
        addChatGroupIdFn({ chatGroupId: message.chat_group_id });
      }
    }
  };

  if (!accessToken) {
    return <AnimatedBackdrop />;
  }

  const config: VoiceProviderProps = {
    hostname: "api.hume.ai",
    reconnectAttempts: 30,
    debug: import.meta.env.NODE_ENV === "development",
    auth: {
      type: "accessToken",
      value: accessToken.accessToken,
    },
    configId: "11df331e-ee63-4459-ba66-2ca2dee47f81",
    configVersion: 18,
    resumedChatGroupId: user?.chatGroupId ?? undefined,
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
        messageHistoryLimit={999}
      >
        <Views />
      </VoiceProvider>
    </PostHogProvider>
  );
};