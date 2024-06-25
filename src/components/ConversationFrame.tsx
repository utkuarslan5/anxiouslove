import React, { FC, PropsWithChildren, forwardRef, useState } from "react";
import { useVoice } from "@humeai/voice-react";
import * as Tooltip from "@radix-ui/react-tooltip";
import {
  Box,
  HStack,
  Flex,
  Button,
} from "@chakra-ui/react";
import { Pause, Play, X, RefreshCw } from "lucide-react";

export type ConversationFrameProps = PropsWithChildren<{
  onClose: () => void;
  onRefresh: () => void;
}>;

export const ConversationFrame: FC<ConversationFrameProps> = ({
  onClose,
  onRefresh,
  children,
}) => {
  const { status } = useVoice();

  return (
    <Flex align="center" justify="center" height="100vh">
      <Box
      // maxW="600px"
      >
        <Box>{children}</Box>

        {status.value === "connected" && (
          <>
            {/* <Button
              onClick={() => onRefresh()}
              borderRadius="full"
              variant="solid"
              width="50px"
              height="50px"
              position="absolute"
              bottom="calc(33% - 25px)"
              left="calc(50% - 100px)"
            >
              <RefreshCw color="black" size={48} />
            </Button> */}
            <Button
              onClick={() => onClose()}
              borderRadius="full"
              bg="red"
              _hover={{ bg: "lightcoral" }}
              width="50px"
              height="50px"
              position="absolute"
              bottom="calc(33%)"
              right="calc(50% - 25px)"
            >
              <X color="white" size={48} />
            </Button>
          </>
        )}
      </Box>
    </Flex>
  );
};
