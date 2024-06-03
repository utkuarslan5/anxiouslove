import React from 'React';
import { Box, HStack, Text, VStack, Progress, Heading } from '@chakra-ui/react';
import { expressionColors } from 'expression-colors';

interface EmotionProgressProps {
  data: { emotion: string; average?: number; peak?: number }[];
  title: string;
  metricKey: 'average' | 'peak';
}

const EmotionProgress: React.FC<EmotionProgressProps> = ({ data, title, metricKey }) => (
  <VStack align="stretch" spacing={4} key={title}>
    <Heading size="sm">{title}</Heading>
    {data.map((item) => {
      const fillColor = expressionColors[item.emotion]?.hex || 'gray';
      const backgroundColor = `${fillColor}33`; // Adjust opacity
      return (
        <Box key={item.emotion}>
          <HStack justify="space-between" align="center">
            <Text>{item.emotion}</Text>
            <Text>{item[metricKey]!== undefined? item[metricKey].toFixed(3) : 'N/A'}</Text>
          </HStack>
          <Progress
            value={item[metricKey]!== undefined? item[metricKey] * 100 : 0}
            height="20px"
            borderRadius="10px"
            bg={backgroundColor}
            sx={{
              '& > div': {
                borderRadius: '10px',
                backgroundColor: fillColor,
              },
            }}
          />
        </Box>
      );
    })}
  </VStack>
);

export default EmotionProgress;