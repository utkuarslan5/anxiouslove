import React, { useState, useEffect } from 'react';
import { VStack, HStack, Flex, Heading, Text } from '@chakra-ui/react';
import {
  UserTranscriptMessage,
  AssistantTranscriptMessage,
} from '@humeai/voice';
import BarChart from './BarChart';
import EmotionProgress from './EmotionProgress';

type MessageType = UserTranscriptMessage | AssistantTranscriptMessage;

export const EmotionPlot: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);

  useEffect(() => {
    fetch('/conversation.json')
      .then((response) => response.json())
      .then((data) => setMessages(data))
      .catch((error) => console.error('Error fetching conversation data:', error));
  }, []);

  const filterAndExtractScores = (type: string) =>
    messages
      .filter((message): message is UserTranscriptMessage => message.type === type && message.models?.prosody?.scores !== undefined)
      .map((message) => message.models.prosody.scores);

  const userEmotions = filterAndExtractScores('user_message');

  const calculateMetrics = (emotions: Record<string, number>[]) => {
    const sums: Record<string, number> = {};
    const counts: Record<string, number> = {};
    const peaks: Record<string, number> = {};

    emotions.forEach((scores) => {
      Object.keys(scores).forEach((emotion) => {
        sums[emotion] = (sums[emotion] || 0) + scores[emotion];
        counts[emotion] = (counts[emotion] || 0) + 1;
        peaks[emotion] = Math.max(peaks[emotion] || 0, scores[emotion]);
      });
    });

    const averages = Object.keys(sums).map((emotion) => ({
      emotion,
      average: sums[emotion] / counts[emotion],
    }));

    const highestPeaks = Object.keys(peaks).map((emotion) => ({
      emotion,
      peak: peaks[emotion],
    }));

    averages.sort((a, b) => b.average - a.average);
    highestPeaks.sort((a, b) => b.peak - a.peak);

    return { averages, highestPeaks };
  };

  const userMetrics = calculateMetrics(userEmotions);

  const getEmotionAverages = (messages: Record<string, number>[]) => {
    const sums: Record<string, number> = {};
    const counts: Record<string, number> = {};

    messages.forEach((scores) => {
      Object.keys(scores).forEach((emotion) => {
        sums[emotion] = (sums[emotion] || 0) + scores[emotion];
        counts[emotion] = (counts[emotion] || 0) + 1;
      });
    });

    const averages = Object.keys(sums).map((emotion) => ({
      emotion,
      average: sums[emotion] / counts[emotion],
    }));

    averages.sort((a, b) => b.average - a.average);
    return averages.slice(0, 15); // Top 15 emotions
  };

  const firstThreeMessages = userEmotions.slice(0, 3);
  const lastThreeMessages = userEmotions.slice(-3);

  const firstThreeAverages = getEmotionAverages(firstThreeMessages);
  const lastThreeAverages = getEmotionAverages(lastThreeMessages);

  const combineEmotionData = (
    firstAverages: { emotion: string; average: number }[],
    lastAverages: { emotion: string; average: number }[]
  ) => {
    const combined: Record<string, { first: number; last: number }> = {};
    firstAverages.forEach((item) => {
      combined[item.emotion] = { first: item.average, last: 0 };
    });
    lastAverages.forEach((item) => {
      if (combined[item.emotion]) {
        combined[item.emotion].last = item.average;
      } else {
        combined[item.emotion] = { first: 0, last: item.average };
      }
    });
    return Object.entries(combined).map(([emotion, values]) => ({
      emotion,
      first: values.first,
      last: values.last,
    }));
  };

  const combinedEmotionData = combineEmotionData(firstThreeAverages, lastThreeAverages);

  return (
    <VStack spacing={8} p={5}>
      <Heading>Call Summary</Heading>
      <Text>Only up to the most recent 100 messages are included in call summary metrics.</Text>
      <Text>Duration: 00:00:14</Text>
      <Heading size="md">User</Heading>
      <Text>2 messages</Text>
      <HStack spacing={8} align="start">
        <EmotionProgress
          data={userMetrics.averages.slice(0, 3)}
          title="Top Averages"
          key="averages"
          metricKey="average"
        />
        <EmotionProgress
          data={userMetrics.highestPeaks.slice(0, 3)}
          title="Highest Peaks"
          key="peaks"
          metricKey="peak"
        />
      </HStack>
      <Flex direction="row" justify="center" align="center" width="100%">
        <BarChart
          data={combinedEmotionData}
          title="First 3 Messages"
          key="first"
        />
        <BarChart
          data={combinedEmotionData}
          title="Last 3 Messages"
          key="last"
        />
      </Flex>
    </VStack>
  );
};

export default EmotionPlot;
