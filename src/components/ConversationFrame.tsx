import React, { FC, PropsWithChildren, useState } from "react";
import { useVoice } from "@humeai/voice-react";
import { Box, Flex, Button } from "@chakra-ui/react";
import { Pause, X } from "lucide-react";
import * as Tooltip from '@radix-ui/react-tooltip';

export type ConversationFrameProps = PropsWithChildren<{
  onClose: () => void;
}>;

export const ConversationFrame: FC<ConversationFrameProps> = ({
  onClose,
  children,
}) => {
  const { status, sendPauseAssistantMessage, sendResumeAssistantMessage } = useVoice();
  const [isPaused, setIsPaused] = useState(false);

  const handlePauseResume = () => {
    if (isPaused) {
      sendResumeAssistantMessage();
    } else {
      sendPauseAssistantMessage();
    }
    setIsPaused(!isPaused);
  };

  return (
    <Flex align="center" justify="center" height="100vh">
      <Box>
        <Box>{children}</Box>

        {status.value === "connected" && (
          <>
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <Button
                    onClick={handlePauseResume}
                    borderRadius="full"
                    variant="solid"
                    width="50px"
                    height="50px"
                    position="absolute"
                    bottom="calc(20%)"
                    left="calc(50% - 100px)"
                    bg={isPaused ? "black" : "gray.300"}
                    color={isPaused ? "white" : "black"}
                    _hover={{ bg: isPaused ? "gray.700" : "gray.500", boxShadow: "md" }}
                    _active={{ bg: isPaused ? "black" : "gray.300", boxShadow: "lg" }} // Add box shadow on active
                    boxShadow="base" // Initial box shadow
                  >
                    <Pause color={isPaused ? "white" : "black"} size={48} />
                  </Button>
                </Tooltip.Trigger>
                <Tooltip.Content side="bottom" align="center" sideOffset={5}>
                  {isPaused ? 'Resume the assistant' : 'Pause the assistant'}
                  <Tooltip.Arrow />
                </Tooltip.Content>
              </Tooltip.Root>

              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <Button
                    onClick={onClose}
                    borderRadius="full"
                    bg="red"
                    _hover={{ bg: "lightcoral", boxShadow: "md" }}
                    _active={{ boxShadow: "lg" }} // Add box shadow on active
                    width="50px"
                    height="50px"
                    position="absolute"
                    bottom="calc(20%)"
                    right="calc(50% - 100px)"
                    boxShadow="base" // Initial box shadow
                  >
                    <X color="white" size={48} />
                  </Button>
                </Tooltip.Trigger>
                <Tooltip.Content side="bottom" align="center" sideOffset={5}>
                  End the chat
                  <Tooltip.Arrow />
                </Tooltip.Content>
              </Tooltip.Root>
            </Tooltip.Provider>
          </>
        )}
      </Box>
    </Flex>
  );
};
