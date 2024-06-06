import React from 'react';
import { VStack, Heading, Box, HStack, Text, Progress } from '@chakra-ui/react';
import { expressionColors } from 'expression-colors';

interface EmotionDataProps {
  data: any[];
  title: string;
  componentKey: string; // Rename key to componentKey
  metricKey: string;
}

const EmotionData: React.FC<EmotionDataProps> = ({ data, title, componentKey, metricKey }) => (
  <VStack align="stretch" spacing={4} key={componentKey}>
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

export default EmotionData;
