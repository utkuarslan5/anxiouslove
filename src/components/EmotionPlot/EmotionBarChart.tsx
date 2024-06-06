import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Box, Heading } from '@chakra-ui/react';
import { expressionColors } from 'expression-colors';

interface EmotionBarChartProps {
  title: string;
  averages: any[];
}

const EmotionBarChart: React.FC<EmotionBarChartProps> = ({ title, averages }) => {
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

  return (
    <Box width={['100%', '45%']} mb={['8', '0']}>
      <Heading size="sm" textAlign="center">{title}</Heading>
      <Bar data={createBarData(averages)} options={barOptions} width={250} height={200} /> 
    </Box>
  );
};

export default EmotionBarChart;
