import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Progress,
  VStack,
  Heading,
  HStack,
  Flex
} from '@chakra-ui/react';
import { expressionColors } from 'expression-colors';
import { Bar, Radar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, RadialLinearScale, PointElement, LineElement, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, RadialLinearScale, PointElement, LineElement, Filler);

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
  'Complex/Contemplative Emotions': [
    'Contemplation', 'Confusion', 'Realization', 'Entrancement', 
    'Desire', 'Craving', 'Concentration', 'Adoration'
  ],
  'Social/Relational Emotions': [
    'Sympathy', 'Empathic Pain', 'Envy', 'Pride', 'Romance', 'Shame', 
    'Relief', 'Awkwardness'
  ]
};

const calculateGroupAverages = (sums) => {
  const groupSums = {};
  const groupCounts = {};

  // Initialize group sums and counts
  Object.keys(emotionGroups).forEach(group => {
    groupSums[group] = 0;
    groupCounts[group] = 0;
  });

  // Sum the emotions for each group
  Object.entries(sums).forEach(([emotion, sum]) => {
    Object.entries(emotionGroups).forEach(([group, emotions]) => {
      if (emotions.includes(emotion)) {
        groupSums[group] += sum;
        groupCounts[group] += 1;
      }
    });
  });

  // Calculate the average for each group
  const groupAverages = {};
  Object.keys(groupSums).forEach(group => {
    groupAverages[group] = groupCounts[group] > 0 ? groupSums[group] / groupCounts[group] : 0;
  });

  return groupAverages;
};

export const EmotionPlot = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch('/conversation.json')
      .then(response => response.json())
      .then(data => setMessages(data))
      .catch(error => console.error('Error fetching conversation data:', error));
  }, []);

  const filterAndExtractScores = (type) => messages
    .filter(message => message.type === type && message.models?.prosody?.scores)
    .map(message => message.models.prosody.scores);

  const userEmotions = filterAndExtractScores('user_message');

  const calculateMetrics = (emotions) => {
    const sums = {};
    const counts = {};
    const peaks = {};

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

  const renderEmotionData = (data, title, key, metricKey) => (
    <VStack align="stretch" spacing={4} key={key}>
      <Heading size="sm">{title}</Heading>
      {data.map(item => {
        const fillColor = expressionColors[item.emotion]?.hex || 'gray';
        const backgroundColor = `${fillColor}33`; // Adjust opacity
        return (
          <Box key={item.emotion}>
            <HStack justify="space-between" align="center">
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

  const getEmotionAverages = (messages) => {
    const sums = {};
    const counts = {};

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
    return averages.slice(0, 10); // Top 10 emotions
  };

  const firstThreeMessages = userEmotions.slice(0, 3);
  const lastThreeMessages = userEmotions.slice(-3);

  const firstThreeAverages = getEmotionAverages(firstThreeMessages);
  const lastThreeAverages = getEmotionAverages(lastThreeMessages);

  const createBarData = (data, label) => ({
    labels: data.map(item => item.emotion),
    datasets: [{
      label: label,
      data: data.map(item => item.average),
      backgroundColor: data.map(item => expressionColors[item.emotion]?.hex || 'gray'),
      borderRadius: 5
    }]
  });

  const barOptions = {
    indexAxis: 'y',
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

  const createRadarData = (groupAverages) => ({
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
    }
  };

  const groupAverages = calculateGroupAverages(userMetrics.sums);

  return (
    <VStack spacing={8} p={5}>
      <Heading>Call Summary</Heading>
      <Text>Only up to the most recent 100 messages are included in call summary metrics.</Text>
      <Text>Duration: 00:00:14</Text>
      <Heading size="md">User</Heading>
      <Text>2 messages</Text>
      <HStack spacing={8} align="start">
        {renderEmotionData(userMetrics.averages.slice(0, 3), "Top Averages", "averages", "average")}
        {renderEmotionData(userMetrics.highestPeaks.slice(0, 3), "Highest Peaks", "peaks", "peak")}
      </HStack>
      <Flex direction="row" justify="center" align="center" width="100%">
        <Box width="50%">
          <Heading size="sm" textAlign="center">First 3 Messages</Heading>
          <Bar data={createBarData(firstThreeAverages, 'First 3 Messages')} options={barOptions} />
        </Box>
        <Box width="50%">
          <Heading size="sm" textAlign="center">Last 3 Messages</Heading>
          <Bar data={createBarData(lastThreeAverages, 'Last 3 Messages')} options={barOptions} />
        </Box>
      </Flex>
      <Box width="100%">
        <Heading size="sm" textAlign="center">Emotion Sums Across the Conversation</Heading>
        <Radar data={createRadarData(groupAverages)} options={radarOptions} />
      </Box>
    </VStack>
  );
};

export default EmotionPlot;
