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


export const ChatBot = () => {
  if (typeof window !== "undefined") {


    posthog.init("phc_QWCQnocWvXO4UW30UUmZusN3OoPwucgo3VELxKq9AOR", {
      api_host: "https://eu.i.posthog.com",
      loaded: (posthog) => {
        if (import.meta.env.NODE_ENV === "development") posthog.debug(); // debug mode in development
      },
      capture_pageview: true,
      disable_session_recording: false,
      enable_recording_console_log: true,
      property_blacklist: [],
    });
    posthog.capture("$pageview");
  }

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
          auth={{ type: "apiKey", value: "UGr0q0DHsFcJT1EufOcjI5glJVArdLTlxkYZqO0tGbysfsfs" }}
          onMessage={dispatchMessage}
          configId={"b14e74c9-7854-40da-bfdd-7ed07d229c91"}
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
