import { isExpressionColor } from "../utils/isExpressionColor";
import { useVoice } from "@humeai/voice-react";
import { expressionColors } from "expression-colors";
import { Circle } from "lucide-react";
import { FC, useRef } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { cn } from "../utils";
import { Stack, Box } from "@chakra-ui/react";

type ProsodyScore = { name: string; score: string };

type LastVoiceMessageProps = {
  lastVoiceMessage: ReturnType<typeof useVoice>["lastVoiceMessage"];
  position?: "default" | "top";
};

const EmotionLabel = (prosody: ProsodyScore) => {
  const ref = useRef<HTMLDivElement>(null);

  const fill = isExpressionColor(prosody.name)
    ? expressionColors[prosody.name].hex
    : "white";

  return (
    <LayoutGroup>
      <AnimatePresence>
        <motion.div
          className="mb-2 mr-2 inline-block last:mr-0"
          style={{ minWidth: ref.current?.offsetWidth }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeIn" }}
        >
          <motion.div
            ref={ref}
            layout
            className="rounded-full bg-tan-200/50 px-2 py-0.5 font-mono text-xs uppercase"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeIn" }}
                key={`emotion-label-${prosody.name}`}
                className="flex items-center gap-2"
              >
                <Circle fill={fill} stroke={"white"} className={"size-3"} />
                <span className="">{prosody.name}</span>
                <span className="ml-auto tabular-nums opacity-50">
                  {prosody.score}
                </span>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </LayoutGroup>
  );
};

export const LastVoiceMessage: FC<LastVoiceMessageProps> = ({
  lastVoiceMessage,
  position = "default",
}) => {
  const prosody = lastVoiceMessage?.models.prosody?.scores ?? {};
  const sortedEmotions: ProsodyScore[] = Object.entries(prosody)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([key, value]) => ({ name: key, score: value }))
    .map((entry) => {
      return { ...entry, score: Number(entry.score).toFixed(2) };
    });

  return (
    <div
      className={cn(
        position === "default"
          ? "pointer-events-none flex justify-center w-full top-2/3 left-1/2 -translate-x-1/2 -translate-y-2/3 absolute"
          : "flex justify-center w-full -translate-y-1/3"
      )}
    >
      <Stack direction={["column", "row"]} pt={position === "default" ? [64, 24] : [16, 8]} align="stretch">
        {sortedEmotions.map((emotion) => {
          return (
            <Box key={`emotion-wrapper-${emotion.name}`} width="100%">
              <EmotionLabel {...emotion} />
            </Box>
          );
        })}
      </Stack>
    </div>

  );
};
