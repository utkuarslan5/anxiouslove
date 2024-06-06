import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Box, Heading } from '@chakra-ui/react';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

// Register the necessary Chart.js components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler, // Make sure the Filler plugin is registered
  Tooltip,
  Legend
);

interface EmotionRadarChartProps {
  groupAverages: Record<string, number>;
}

const EmotionRadarChart: React.FC<EmotionRadarChartProps> = ({ groupAverages }) => {
  const createRadarData = (groupAverages: Record<string, number>) => ({
    labels: Object.keys(groupAverages),
    datasets: [{
      label: 'Emotion Sums',
      data: Object.values(groupAverages),
      backgroundColor: 'rgba(54, 162, 235, 0.2)', // Shaded area color
      borderColor: 'rgba(54, 162, 235, 1)', // Line border color
      borderWidth: 1,
      pointBackgroundColor: 'rgba(54, 162, 235, 1)', // Point color
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
      fill: true, // Fill the area under the line
    }]
  });

  const radarOptions = {
    scales: {
      r: {
        angleLines: {
          display: true
        },
        grid: {
          circular: true
        },
        ticks: {
          beginAtZero: true,
          maxTicksLimit: 5 // Adjust this to control the number of ticks
        }
      }
    },
    elements: {
      line: {
        tension: 0.4 // Controls the line curvature
      }
    },
    plugins: {
      legend: {
        display: false // Controls the visibility of the legend
      }
    }
  };

  return (
    <Box width="100%">
      <Heading size="sm" textAlign="center">Emotional State</Heading>
      <Radar data={createRadarData(groupAverages)} options={radarOptions} width={300} height={300} />
    </Box>
  );
};

export default EmotionRadarChart;
