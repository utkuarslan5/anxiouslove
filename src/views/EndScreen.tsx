import { FC, useState } from "react";
import { Box, VStack, useDisclosure } from "@chakra-ui/react";
import { Button } from "../components/Button";
import {
  UserTranscriptMessage,
  AssistantTranscriptMessage,
} from "@humeai/voice";
import { LastVoiceMessage } from "../components/LastVoiceMessage";
import { calculateAverageEmotionMessage } from "../utils";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../utils";
import EmailForm from "../components/EmailForm";

type MessageType = UserTranscriptMessage | AssistantTranscriptMessage;

export const EndScreen: FC<{
  messages: MessageType[];
  onTryAgain: () => void;
}> = ({ messages, onTryAgain }) => {
  const [showEmailForm, setShowEmailForm] = useState(false);

  const userMessages = messages.filter(
    (message): message is UserTranscriptMessage => message.type === "user_message"
  );
  const averageEmotionMessage = calculateAverageEmotionMessage(userMessages);

  return (
    <motion.div
      className={cn("flex flex-col items-center justify-center h-screen px-12 gap-4")}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, translateY: -4 }}
      transition={{ duration: 2 }}
    >
      {!showEmailForm ? (
        <Box>
          <VStack pt={0} spacing={2} align="center">
            <h2 className="text-center text-2xl"><span>Top Emotions:</span></h2>
            <Box>
              <LastVoiceMessage lastVoiceMessage={averageEmotionMessage} position="top" />
            </Box>
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
              <Button onClick={() => setShowEmailForm(true)}>Get summary</Button>
            </motion.div>
          </VStack>
        </Box>
      ) : (
        <EmailForm onClose={() => setShowEmailForm(false)} />
      )}
    </motion.div>
  );
};
