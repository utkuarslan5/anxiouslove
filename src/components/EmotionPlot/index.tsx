import React, { useState, useEffect, useRef } from "react";
import { Box, Text, VStack, Heading, HStack, Flex, Icon } from "@chakra-ui/react";
import { UserTranscriptMessage, AssistantTranscriptMessage } from "@humeai/voice";
import { Clock, MessageCircle } from "lucide-react";
import useMessagesStore from "../../store/messagesStore";
import EmotionData from "./EmotionData";
import EmotionBarChart from "./EmotionBarChart";
import EmotionRadarChart from "./EmotionRadarChart";
import {
  calculateGroupAverages,
  calculateMetrics,
  getEmotionAverages,
  calculateCallDuration,
} from "../../utils/emotionUtils";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  BarElement,
  Filler,
} from 'chart.js';

// Register the components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  BarElement,
  Filler
);

export type MessageType = UserTranscriptMessage | AssistantTranscriptMessage;

export const EmotionPlot = () => {
  const messages = useMessagesStore((state) => state.messages);
  const [callDuration, setCallDuration] = useState<string>("");
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCallDuration(calculateCallDuration(messages));
  }, [messages]);

  const filterAndExtractScores = (type: string) =>
    messages
      .filter(
        (message) => message.type === type && message.models?.prosody?.scores
      )
      .map((message) => message.models?.prosody?.scores);

  const userEmotions = filterAndExtractScores("user_message");
  const userMetrics = calculateMetrics(userEmotions);
  const firstThreeAverages = getEmotionAverages(userEmotions.slice(0, 3));
  const lastThreeAverages = getEmotionAverages(userEmotions.slice(-3));
  const groupAverages = calculateGroupAverages(userMetrics.sums);

  return (
    <div id="emotion-plot">
      <VStack
        spacing={8}
        p={5}
        ref={chartRef}
        width={["100%", "80%", "60%"]}
        align="center"
        maxW="800px"
        mx="auto"
      >
        {/* <Heading>Call Summary</Heading> */}
        <HStack spacing={4} align="center">
          <Icon as={MessageCircle} boxSize={6} />
          <Text>{messages.length} messages</Text>
          <Icon as={Clock} boxSize={6} />
          <Text>
            {callDuration
              ? `${callDuration} minutes`
              : "Calculating duration..."}
          </Text>
        </HStack>
        <HStack spacing={8} align="center" justify="center" wrap="wrap">
          <EmotionData
            data={userMetrics.averages.slice(0, 3)}
            title="Top Averages"
            componentKey="averages" 
            metricKey="average"
          />
          <EmotionData
            data={userMetrics.highestPeaks.slice(0, 3)}
            title="Highest Peaks"
            componentKey="peaks" 
            metricKey="peak"
          />
        </HStack>
        <Flex
          direction={["column", "row"]}
          justify="center"
          align="center"
          width="100%"
        >
          <EmotionBarChart
            title="Starting Emotions"
            averages={firstThreeAverages}
          />
          <EmotionBarChart
            title="After conversation"
            averages={lastThreeAverages}
          />
        </Flex>
        <EmotionRadarChart groupAverages={groupAverages} />
      </VStack>
    </div>
  );
};

export default EmotionPlot;
