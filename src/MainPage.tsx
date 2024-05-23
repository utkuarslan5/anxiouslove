import React, { FormEventHandler, FormEvent } from "react";
import { type Task } from "wasp/entities";
import { type AuthUser, getUsername } from "wasp/auth";
import { logout } from "wasp/client/auth";
import {
  createTask,
  updateTask,
  deleteTasks,
  useQuery,
  getTasks,
} from "wasp/client/operations";
import waspLogo from "./waspLogo.png";
import { useConfigStore } from "./store/config";
import { parentDispatch } from "./utils/parentDispatch";
import { MessageListener } from "./components/MessageListener";
import { Views } from "./views/Views";
import { TRANSCRIPT_MESSAGE_ACTION } from "@humeai/voice-embed-react";
import { VoiceProvider } from "@humeai/voice-react";
import { AnimatePresence } from "framer-motion";
import { ComponentProps } from "react";

import "./Main.css";

export const MainPage = ({ user }: { user: AuthUser }) => {
  const { data: tasks, isLoading, error } = useQuery(getTasks);

  if (isLoading) return "Loading...";
  if (error) return "Error: " + error;

  const apiKey = import.meta.env.HUME_API_KEY || "";

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
    <>
      <AnimatePresence mode={"wait"}>
        <VoiceProvider
          auth={{ type: "apiKey", value: apiKey }}
          onMessage={dispatchMessage}
        >
          <Views />
        </VoiceProvider>
      </AnimatePresence>
    </>
  );
};
