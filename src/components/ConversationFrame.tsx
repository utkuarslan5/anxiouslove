import { motion } from "framer-motion";
import { CloseButton } from "./CloseButton";
import { FC, PropsWithChildren } from "react";
import { MuteButton } from "./MuteButton";
import { useVoice } from "@humeai/voice-react";
import { ExpandButton } from "./ExpandButton";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Box, HStack, VStack } from "@chakra-ui/react";

export type ConversationFrameProps = PropsWithChildren<{
  onClose: () => void;
}>;

export const ConversationFrame: FC<ConversationFrameProps> = ({
  onClose,
  children,
}) => {
  const { isMuted, mute, unmute, status } = useVoice();
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      className={"flex size-full min-w-0 flex-col overflow-hidden"}
    >
      <motion.div
        className={"flex grow flex-col items-center justify-center px-4"}
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        exit={{
          opacity: 0,
        }}
        transition={{
          delay: 0.1,
          duration: 0.3,
        }}
      >
        {children}
      </motion.div>

      <Box zIndex={10} p={2}>
        <HStack spacing={4} justifyContent="center" pb={[4, 16]} pt={0}>
          {status.value === "connected" && (
            <Tooltip.Provider delayDuration={400} skipDelayDuration={500}>
              {/* <VStack alignItems="center"> */}
                <Tooltip.Root>
                  <Tooltip.Trigger>
                    <MuteButton
                      onPress={() => {
                        if (isMuted) {
                          unmute();
                        } else {
                          mute();
                        }
                      }}
                      isMuted={isMuted}
                    />
                  </Tooltip.Trigger>
                  <Tooltip.Content
                    className={
                      "isolate rounded-md bg-black px-2 py-1 text-xs text-white shadow-sm will-change-[transform,opacity] data-[state=delayed-open]:data-[side=top]:animate-slideUpAndFade"
                    }
                    side={"top"}
                    sideOffset={5}
                  >
                    {isMuted ? "Unmute" : "Mute"}
                  </Tooltip.Content>
                </Tooltip.Root>
                <Tooltip.Root>
                  <Tooltip.Trigger>
                    <ExpandButton
                      onPress={() => {
                        onClose();
                        // window.open("https://tally.so/r/mVZR5N");
                        window.location.href = "https://tally.so/r/mVZR5N";
                      }}
                    />
                  </Tooltip.Trigger>
                  <Tooltip.Content
                    className={
                      "rounded-md bg-black px-2 py-1 text-xs text-white will-change-[transform,opacity] data-[state=delayed-open]:data-[side=top]:animate-slideUpAndFade"
                    }
                    side={"top"}
                    sideOffset={5}
                  >
                    Pre-order
                  </Tooltip.Content>
                </Tooltip.Root>
            </Tooltip.Provider>
          )}

          <Box>
            <CloseButton onPress={() => onClose()} />
          </Box>
        </HStack>
      </Box>
    </motion.div>
  );
};
