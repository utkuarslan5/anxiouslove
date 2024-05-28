// MainPage.tsx
import React, { useEffect } from "react";
import { useQuery, getTasks } from "wasp/client/operations";
import { ChatBot } from "./ChatBot";

export const MainPage: React.FC = () => {

  return <ChatBot />;
};
