// MainPage.tsx
import React from "react";
import { useQuery, getTasks } from "wasp/client/operations";
import { ChatBot } from "./ChatBot";

export const MainPage: React.FC = () => {
  // const { data: tasks, isLoading, error } = useQuery(getTasks);

  // if (isLoading) return "Loading...";
  // if (error) return "Error: " + error;

  return <ChatBot />;
};
