import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { expressionColors } from 'expression-colors';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
  data: { emotion: string; first: number; last: number }[];
  title: string;
  dataKey: 'first' | 'last';
}

const BarChart: React.FC<BarChartProps> = ({ data, title, dataKey }) => {
  const createBarData = () => ({
    labels: data.map((item) => item.emotion),
    datasets: [
      {
        label: dataKey === 'first' ? 'First 3 Messages' : 'Last 3 Messages',
        data: data.map((item) => (dataKey === 'first' ? item.first : -item.last)),
        backgroundColor: data.map((item) => expressionColors[item.emotion]?.hex || '#ccc'),
        borderRadius: 5,
      },
    ],
  });

  const barOptions = {
    indexAxis: 'y' as const,
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => Math.abs(value),
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            return `${tooltipItem.dataset.label}: ${Math.abs(tooltipItem.raw)}`;
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <Box width="50%" transform={dataKey === 'first' ? 'scaleX(-1)' : undefined} height="500px">
      <Heading size="sm" textAlign="center">
        {title}
      </Heading>
      <Bar data={createBarData()} options={barOptions} />
    </Box>
  );
};

export default BarChart;