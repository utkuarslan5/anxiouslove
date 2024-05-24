import React, { ComponentProps } from "react";
import { type AuthUser, getUsername } from "wasp/auth";
import { logout } from "wasp/client/auth";
import { createTask, updateTask, deleteTasks } from "wasp/client/operations";
import waspLogo from "./waspLogo.png";
import { useConfigStore } from "./store/config";
import { useLayoutStore } from "./store/layout";
import { Frame } from "./components/Frame";
import { parentDispatch } from "./utils/parentDispatch";
import { MessageListener } from "./components/MessageListener";
import { Views } from "./views/Views";
import { TRANSCRIPT_MESSAGE_ACTION } from "@humeai/voice-embed-react";
import { VoiceProvider } from "@humeai/voice-react";
import { AnimatePresence } from "framer-motion";
import { Box } from "@chakra-ui/react";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

console.log(import.meta.env);

if (typeof window !== "undefined") {
  posthog.init(import.meta.env["REACT_APP_PUBLIC_POSTHOG_KEY"], {
    api_host:
      import.meta.env["REACT_APP_PUBLIC_POSTHOG_HOST"] || "https://eu.i.posthog.com",
    loaded: (posthog) => {
      if (import.meta.env.NODE_ENV === "development") posthog.debug(); // debug mode in development
    },
    capture_pageview: true,
    disable_session_recording: false,
    enable_recording_console_log: true,
    property_blacklist: [],
  });
}

export const ChatBot = () => {
  const apiKey = import.meta.env.REACT_APP_HUME_API_KEY;
  const configId = import.meta.env.REACT_APP_HUME_CONFIG_ID;

  posthog.capture('$pageview')
  
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
      parentDispatch(TRANSCRIPT_MESSAGE_ACTION(message));
    }
  };

  

  return (
    <PostHogProvider client={posthog}>
      <Box>
        <VoiceProvider
          auth={{ type: "apiKey", value: apiKey }}
          onMessage={dispatchMessage}
          configId={configId}
          onError={(err) => {
            posthog.capture("api_error", { error: err });
          }}
          onClose={(e) => {
            posthog.capture("socket_closed", { event: e });
          }}
        >
          <Views />
        </VoiceProvider>
      </Box>
    </PostHogProvider>
  );
};
