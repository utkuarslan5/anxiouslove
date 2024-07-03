"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "wasp/client/operations";
import { getChatEvents } from "wasp/client/operations";
import Messages from "./Messages";
import { ComponentRef } from "react";
import { Box, Spinner, Text } from "@chakra-ui/react";

export default function Chat({ chatGroupId }: { chatGroupId: string }) {
  const ref = useRef<ComponentRef<typeof Messages> | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isMessagesLoading, setIsMessagesLoading] = useState(true);

  const {
    data: chatEventsData,
    isLoading: chatEventsLoading,
    isError,
  } = useQuery(getChatEvents, chatGroupId);

  useEffect(() => {
    if (chatEventsData) {
      console.log('Fetched Messages:', chatEventsData.events_page);
      const fetchedMessages = chatEventsData.events_page;
      setMessages(fetchedMessages);
      setIsMessagesLoading(false);
    }
  }, [chatEventsData]);

  if (chatEventsLoading || isMessagesLoading) {
    return <Spinner />;
  }

  if (isError || !chatEventsData) {
    return <Text>Error loading chat events.</Text>;
  }

  return (
    <div
      // className={
      //   "relative grow flex flex-col mx-auto w-full overflow-hidden h-[0px]"
      // }
    >
      <Messages ref={ref} messages={messages} />
    </div>
  );
}
