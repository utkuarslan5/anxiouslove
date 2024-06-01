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

      <Box zIndex={10} p={2} pb={16}>
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
                        const iframe = document.createElement("iframe");
                        iframe.src = "data:text/html,<html><head><meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'><title>How much unresolved anxiety is costing your life?</title><script async src='https://tally.so/widgets/embed.js'></script><style type='text/css'>html { margin: 0; height: 100%; overflow: hidden; } iframe { position: absolute; top: 0; right: 0; bottom: 0; left: 0; border: 0; }</style></head><body><iframe data-tally-src='https://tally.so/r/mVZR5N' width='100%' height='100%' frameborder='0' marginheight='0' marginwidth='0' title='How much unresolved anxiety is costing your life?'></iframe></body></html>";
                        iframe.style.width = "100%";
                        iframe.style.height = "100%";
                        iframe.style.border = "none";
                        const container = document.createElement("div");
                        container.style.position = "fixed";
                        container.style.top = "0";
                        container.style.left = "0";
                        container.style.width = "100%";
                        container.style.height = "100%";
                        container.style.zIndex = "9999";
                        container.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
                        container.appendChild(iframe);
                        document.body.appendChild(container);
                        const closeButton = document.createElement("button");
                        closeButton.innerText = "Close";
                        closeButton.style.position = "fixed";
                        closeButton.style.top = "10px";
                        closeButton.style.right = "10px";
                        closeButton.style.zIndex = "10000";
                        closeButton.style.padding = "10px 20px";
                        closeButton.style.backgroundColor = "white";
                        closeButton.style.border = "none";
                        closeButton.style.borderRadius = "5px";
                        closeButton.style.cursor = "pointer";
                        closeButton.addEventListener("click", () => {
                          document.body.removeChild(container);
                          document.body.removeChild(closeButton);
                        });
                        document.body.appendChild(closeButton);
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
                <Box>
                  <CloseButton onPress={() => onClose()} />
                </Box>
            </Tooltip.Provider>
          )}
        </HStack>
      </Box>
    </motion.div>
  );
};
