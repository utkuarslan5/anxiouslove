import { FC } from "react";
import { Box, VStack } from "@chakra-ui/react";
import { Button } from "../components/Button";
import {
  UserTranscriptMessage,
  AssistantTranscriptMessage,
} from "@humeai/voice";
import { LastVoiceMessage } from "../components/LastVoiceMessage";
import { calculateAverageEmotionMessage } from "../utils";
import { motion } from "framer-motion";
import { cn } from "../utils";
import { CircledText } from "../components/CircledText";
import EmotionPlot from "../components/EmotionPlot"; // Import the EmotionPlot component

type MessageType = UserTranscriptMessage | AssistantTranscriptMessage;

export const EndScreen: FC<{
  messages: MessageType[];
  onTryAgain: () => void;
}> = ({ messages, onTryAgain }) => {
  // Filter user messages
  const userMessages = messages.filter(
    (message): message is UserTranscriptMessage =>
      message.type === "user_message"
  );

  // Calculate the average emotion message
  const averageEmotionMessage = calculateAverageEmotionMessage(userMessages);

  return (
    <motion.div
      className={cn(
        "flex flex-col items-center justify-center h-screen px-12 gap-8"
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, translateY: -4 }}
      transition={{ duration: 2 }}
    >
      <Box>
        <VStack pt={0} spacing={4} align="center">
          <h2 className="text-center text-2xl">
            <span> Top Emotions:</span>
          </h2>
          <Box>
            <LastVoiceMessage
              lastVoiceMessage={averageEmotionMessage}
              position="top"
            />
          </Box>
          {/* <EmotionPlot messages={messages} /> Add the EmotionPlot component */}
          <motion.div
            variants={{
              initial: {
                y: "100%",
                opacity: 0,
              },
              enter: {
                y: 0,
                opacity: 1,
                transition: {
                  opacity: {
                    duration: 0.7,
                    ease: "easeInOut",
                  },
                  y: {
                    duration: 1.1,
                    ease: "easeInOut",
                  },
                },
              },
              exit: {
                opacity: 0,
              },
            }}
          >
            <Button
              dataAttributes={{
                "data-tally-open": "mVZR5N",
                "data-tally-layout": "modal",
                "data-tally-width": "377",
                "data-tally-align-left": "1",
                "data-tally-hide-title": "1",
                "data-tally-emoji-animation": "none",
              }}
            >
              Get summary
            </Button>
          </motion.div>
        </VStack>
      </Box>
    </motion.div>
  );
};
