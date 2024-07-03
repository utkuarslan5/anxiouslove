"use client";
import { Box, Flex } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { ComponentRef, forwardRef } from "react";
import Expressions from "./Expressions";
import { cn } from "../utils";


const Messages = forwardRef<
  ComponentRef<typeof motion.div>,
  { messages: any[] } // Adjust the type as needed
>(function Messages({ messages }, ref) {
  console.log(messages);
  return (
    <Box
      as={motion.div}
      layoutScroll
      className={"grow rounded-md overflow-auto p-4"}
      ref={ref}
    >
      <Box
        as={motion.div}
        className={"max-w-2xl mx-auto w-full flex flex-col gap-4 pb-24"}
      >
        <AnimatePresence mode={"popLayout"}>
          {messages.map((msg, index) => {
            if (msg.type === "USER_MESSAGE" || msg.type === "AGENT_MESSAGE") {
              return (
                <Box
                  as={motion.div}
                  key={msg.type + index}
                  className={cn(
                    "w-[80%]",
                    "bg-card",
                    "border border-border rounded",
                    msg.type === "USER_MESSAGE" ? "ml-auto" : ""
                  )}
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: 0,
                  }}
                >
                  <Box
                    className={
                      "text-xs capitalize font-medium leading-none opacity-50 pt-4 px-3"
                    }
                  >
                    {msg.role}
                  </Box>
                  <Box className={"pb-3 px-3"}>{msg.message_text}</Box>
                  <Expressions
                    values={
                      msg.emotion_features
                        ? JSON.parse(msg.emotion_features)
                        : {}
                    }
                  />
                </Box>
              );
            }

            return null;
          })}
        </AnimatePresence>
      </Box>
    </Box>
  );
});

export default Messages;
