import { cn } from "../utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Box, VStack } from "@chakra-ui/react";

const prompts = [
  "What can you do?",
  "Who is this for?",
  "What is your purpose?",
  "Where can I learn more?",
];

export const WaitingPrompt = () => {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromptIndex((prevIndex) =>
        prevIndex === prompts.length - 1 ? 0 : prevIndex + 1
      );
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box pb={64}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        // className="flex select-none "
      >
        <VStack spacing={[18]} pb={16}>
          <Box>
            <div className={cn("font-mono uppercase text-black/50")}>
              Ask me...
            </div>
          </Box>
          <Box>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPromptIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className={cn("rounded-full bg-tan-300/50 px-3 py-1")}
                >
                  "{prompts[currentPromptIndex]}"
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </Box>
        </VStack>
      </motion.div>
    </Box>
  );
};
