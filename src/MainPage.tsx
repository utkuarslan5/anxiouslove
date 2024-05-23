// MainPage.tsx
import React from "react";
import { type AuthUser } from "wasp/auth";
import { useQuery, getTasks } from "wasp/client/operations";
import { ChatBot } from "./ChatBot";

export const MainPage = ({ user }: { user: AuthUser }) => {
  const { data: tasks, isLoading, error } = useQuery(getTasks);

  if (isLoading) return "Loading...";
  if (error) return "Error: " + error;

  return <ChatBot user={user} />;
};
