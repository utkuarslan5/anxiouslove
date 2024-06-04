import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Text,
  Progress,
  VStack,
  Heading,
  HStack,
  Flex,
  Button,
  Icon
} from '@chakra-ui/react';
import {
  UserTranscriptMessage,
  AssistantTranscriptMessage,
} from "@humeai/voice";
import { Clock, MessageCircle } from 'lucide-react';
import { expressionColors } from 'expression-colors';
import { Bar, Radar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, RadialLinearScale, PointElement, LineElement, Filler } from 'chart.js';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, RadialLinearScale, PointElement, LineElement, Filler);

type MessageType = UserTranscriptMessage | AssistantTranscriptMessage;

const emotionGroups = {
  'Positive High Arousal': [
    'Amusement', 'Excitement', 'Ecstasy', 'Joy', 'Surprise (positive)', 
    'Triumph', 'Interest', 'Realization'
  ],
  'Positive Low Arousal': [
    'Admiration', 'Contentment', 'Calmness', 'Love', 'Satisfaction', 
    'Nostalgia', 'Pride', 'Aesthetic Appreciation'
  ],
  'Negative High Arousal': [
    'Anger', 'Anxiety', 'Fear', 'Horror', 'Distress', 'Disappointment', 
    'Embarrassment', 'Surprise (negative)'
  ],
  'Negative Low Arousal': [
    'Sadness', 'Boredom', 'Tiredness', 'Disgust', 'Shame', 'Guilt', 
    'Doubt', 'Contempt'
  ],
  'Complex/Contemplative': [
    'Contemplation', 'Confusion', 'Realization', 'Entrancement', 
    'Desire', 'Craving', 'Concentration', 'Adoration'
  ],
  'Social/Relational': [
    'Sympathy', 'Empathic Pain', 'Envy', 'Pride', 'Romance', 'Shame', 
    'Relief', 'Awkwardness'
  ]
};

const calculateGroupAverages = (sums: Record<string, number>) => {
  const groupSums: Record<string, number> = {};
  const groupCounts: Record<string, number> = {};

  Object.keys(emotionGroups).forEach(group => {
    groupSums[group] = 0;
    groupCounts[group] = 0;
  });

  Object.entries(sums).forEach(([emotion, sum]) => {
    Object.entries(emotionGroups).forEach(([group, emotions]) => {
      if (emotions.includes(emotion)) {
        groupSums[group] += sum;
        groupCounts[group] += 1;
      }
    });
  });

  const groupAverages = {};
  Object.keys(groupSums).forEach(group => {
    groupAverages[group] = groupCounts[group] > 0 ? groupSums[group] / groupCounts[group] : 0;
  });

  return groupAverages;
};

export const EmotionPlot = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [callDuration, setCallDuration] = useState<string>('');
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/conversation.json')
      .then(response => response.json())
      .then(data => {
        setMessages(data);
        calculateCallDuration(data);
      })
      .catch(error => console.error('Error fetching conversation data:', error));
  }, []);

  const calculateCallDuration = (data: MessageType[]) => {
    if (data.length > 0) {
      const firstTimestamp = new Date(data[0].receivedAt).getTime();
      const lastTimestamp = new Date(data[data.length - 1].receivedAt).getTime();
      const durationInMs = lastTimestamp - firstTimestamp;
      const durationInMinutes = Math.floor(durationInMs / 60000);
      const seconds = Math.floor((durationInMs % 60000) / 1000);
      const durationString = `${durationInMinutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      setCallDuration(durationString);
    }
  };

  const filterAndExtractScores = (type: string) => messages
    .filter(message => message.type === type && message.models?.prosody?.scores)
    .map(message => message.models?.prosody?.scores);

  const userEmotions = filterAndExtractScores('user_message');

  const calculateMetrics = (emotions: Record<string, number>[]) => {
    const sums: Record<string, number> = {};
    const counts: Record<string, number> = {};
    const peaks: Record<string, number> = {};

    emotions.forEach(scores => {
      Object.keys(scores).forEach(emotion => {
        sums[emotion] = (sums[emotion] || 0) + scores[emotion];
        counts[emotion] = (counts[emotion] || 0) + 1;
        peaks[emotion] = Math.max(peaks[emotion] || 0, scores[emotion]);
      });
    });

    const averages = Object.keys(sums).map(emotion => ({
      emotion,
      average: sums[emotion] / counts[emotion]
    }));

    const highestPeaks = Object.keys(peaks).map(emotion => ({
      emotion,
      peak: peaks[emotion]
    }));

    averages.sort((a, b) => b.average - a.average);
    highestPeaks.sort((a, b) => b.peak - a.peak);

    return { sums, averages, highestPeaks };
  };

  const userMetrics = calculateMetrics(userEmotions);

  const renderEmotionData = (data: any[], title: string, key: string, metricKey: string) => (
    <VStack align="stretch" spacing={4} key={key}>
      <Heading size="sm">{title}</Heading>
      
        {data.map(item => {
          const fillColor = expressionColors[item.emotion]?.hex || 'gray';
          const backgroundColor = `${fillColor}33`; // Adjust opacity
    
          return (
            <Box key={item.emotion}>
              <HStack justifyContent="space-between" alignItems="center" pb={2}>
                <Text>{item.emotion}</Text>
                <Text>{item[metricKey] !== undefined ? item[metricKey].toFixed(3) : 'N/A'}</Text>
              </HStack>
              <Progress
                value={item[metricKey] !== undefined ? item[metricKey] * 100 : 0}
                height="10px"
                borderRadius="5px"
                bg={backgroundColor}
                sx={{
                  '& > div': {
                    borderRadius: '5px',
                    backgroundColor: fillColor,
                  }
                }}
              />
            </Box>
          );
        })}
    </VStack>
  );
  

  const getEmotionAverages = (messages: Record<string, number>[]) => {
    const sums: Record<string, number> = {};
    const counts: Record<string, number> = {};

    messages.forEach(scores => {
      Object.keys(scores).forEach(emotion => {
        sums[emotion] = (sums[emotion] || 0) + scores[emotion];
        counts[emotion] = (counts[emotion] || 0) + 1;
      });
    });

    const averages = Object.keys(sums).map(emotion => ({
      emotion,
      average: sums[emotion] / counts[emotion]
    }));

    averages.sort((a, b) => b.average - a.average);
    return averages.slice(0, 5); // Top 5 emotions
  };

  const firstThreeMessages = userEmotions.slice(0, 3);
  const lastThreeMessages = userEmotions.slice(-3);

  const firstThreeAverages = getEmotionAverages(firstThreeMessages);
  const lastThreeAverages = getEmotionAverages(lastThreeMessages);

  const createBarData = (averages: any[]) => ({
    labels: averages.map(item => item.emotion),
    datasets: [{
      label: 'Average Emotion Scores',
      data: averages.map(item => item.average),
      backgroundColor: averages.map(item => expressionColors[item.emotion]?.hex || 'gray'),
      borderRadius: 5
    }]
  });

  const barOptions = {
    indexAxis: 'y' as const,
    scales: {
      x: {
        beginAtZero: true,
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  const createRadarData = (groupAverages: Record<string, number>) => ({
    labels: Object.keys(groupAverages),
    datasets: [{
      label: 'Emotion Sums',
      data: Object.values(groupAverages),
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
      tension: 0.4, // Add this line to create a bezier curve effect
    }]
  });

  const radarOptions = {
    scale: {
      ticks: { beginAtZero: true }
    },
    elements: {
      line: {
        tension: 0.4 // Add this line to create a bezier curve effect
      }
    },
    plugins: {
      legend: {
        display: false // Hide the legend
      }
    }
  };

  const groupAverages = calculateGroupAverages(userMetrics.sums);

  const downloadImage = async () => {
    const input = chartRef.current;
    if (input) {
      const canvas = await html2canvas(input);
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, "emotion_plot.png");
        }
      });
    }
  };

  return (
    <VStack spacing={8} p={5} ref={chartRef} width={['100%', '80%', '60%']} align="center" maxW="800px" mx="auto">
      <Heading>Call Summary</Heading>
      <HStack spacing={4} align="center">
        <Icon as={MessageCircle} boxSize={6} />
        <Text>{messages.length} messages</Text>
        <Icon as={Clock} boxSize={6} />
        <Text>{callDuration ? `${callDuration} minutes` : 'Calculating duration...'}</Text>
      </HStack>
      <HStack spacing={8} align="center" justify="center" wrap="wrap">
        {renderEmotionData(userMetrics.averages.slice(0, 3), "Top Averages", "averages", "average")}
        {renderEmotionData(userMetrics.highestPeaks.slice(0, 3), "Highest Peaks", "peaks", "peak")}
      </HStack>
      <Flex direction={['column', 'row']} justify="center" align="center" width="100%">
        <Box width={['100%', '45%']} mb={['8', '0']}>
          <Heading size="sm" textAlign="center">Starting Emotions</Heading>
          <Bar data={createBarData(firstThreeAverages)} options={barOptions} width={250} height={200} /> 
        </Box>
        <Box width={['100%', '45%']} mt={['8', '0']}>
          <Heading size="sm" textAlign="center">After conversation</Heading>
          <Bar data={createBarData(lastThreeAverages)} options={barOptions} width={250} height={200} /> 
        </Box>
      </Flex>
      <Box width="100%"> 
        <Heading size="sm" textAlign="center">Emotional State</Heading>
        <Radar data={createRadarData(groupAverages)} options={radarOptions} width={300} height={300} /> 
      </Box>
      <Button onClick={downloadImage} colorScheme="blue">
        Download as Image
      </Button>
    </VStack>
  );
};

export default EmotionPlot;
