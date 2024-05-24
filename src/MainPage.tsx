// MainPage.tsx
import React from "react";
import { useQuery, getTasks } from "wasp/client/operations";
import { ChatBot } from "./ChatBot";

export const MainPage: React.FC = () => {

  return <ChatBot />;
};
