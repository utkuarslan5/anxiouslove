import React, { ComponentProps } from "react";
import { type AuthUser, getUsername } from "wasp/auth";
import { logout } from "wasp/client/auth";
import { createTask, updateTask, deleteTasks } from "wasp/client/operations";
import waspLogo from "./waspLogo.png";
import { useConfigStore } from "./store/config";
import { parentDispatch } from "./utils/parentDispatch";
import { MessageListener } from "./components/MessageListener";
import { Views } from "./views/Views";
import { TRANSCRIPT_MESSAGE_ACTION } from "@humeai/voice-embed-react";
import { VoiceProvider } from "@humeai/voice-react";
import { AnimatePresence } from "framer-motion";
import { Box } from "@chakra-ui/react";

export const ChatBot = ({ user }: { user: AuthUser }) => {
  const apiKey = "UGr0q0DHsFcJT1EufOcjI5glJVArdLTlxkYZqO0tGbysfsfs";

  const dispatchMessage: ComponentProps<typeof VoiceProvider>["onMessage"] = (
    message
  ) => {
    if (
      message.type === "user_message" ||
      message.type === "assistant_message"
    ) {
      parentDispatch(TRANSCRIPT_MESSAGE_ACTION(message));
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <AnimatePresence mode={"wait"}>
        <VoiceProvider
          auth={{ type: "apiKey", value: apiKey }}
          onMessage={dispatchMessage}
        >
          <Views />
        </VoiceProvider>
      </AnimatePresence>
    </Box>
  );
};
