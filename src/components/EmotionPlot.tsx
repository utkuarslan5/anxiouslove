import React from 'react';
import Plot from 'react-plotly.js';
import { expressionColors } from 'expression-colors';
import { isExpressionColor } from '../utils/isExpressionColor';
import { UserTranscriptMessage, AssistantTranscriptMessage } from '@humeai/voice';

type MessageType = UserTranscriptMessage | AssistantTranscriptMessage;

interface EmotionPlotProps {
  messages: MessageType[];
}

const EmotionPlot: React.FC<EmotionPlotProps> = ({ messages }) => {
  // Filter user messages
  const userMessages = messages.filter(
    (message): message is UserTranscriptMessage => message.type === 'user_message'
  );

  // Extract emotions from user messages
  const emotions = userMessages.map((message) =>
    Object.entries(message.models.prosody?.scores || {}).reduce((acc, [name, score]) => {
      acc[name] = score;
      return acc;
    }, {} as Record<string, number>)
  );

  // Get top 5 emotions
  const emotionCounts = emotions.flatMap(Object.keys).reduce((acc, emotion) => {
    acc[emotion] = (acc[emotion] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const top5Emotions = Object.entries(emotionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([emotion]) => emotion);

  // Line Plot
  const lineData = top5Emotions.map((emotionName) => ({
    x: userMessages.map((_, index) => index),
    y: emotions.map((emotion) => emotion[emotionName] || 0),
    mode: 'lines' as const,
    name: emotionName,
    line: {
      color: expressionColors[emotionName]?.hex || 'gray',
    },
  }));

  const lineLayout = {
    title: 'Emotional Changes over Messages (Line Plot)',
    xaxis: { title: 'Message Index' },
    yaxis: { title: 'Emotion Score' },
  };

  // Stacked Area Plot
  const areaData = top5Emotions.map((emotionName) => ({
    x: userMessages.map((_, index) => index),
    y: emotions.map((emotion) => emotion[emotionName] || 0),
    mode: 'none' as const,
    name: emotionName,
    fill: 'tonexty',
    fillcolor: expressionColors[emotionName]?.hex || 'gray',
  }));

  const areaLayout = {
    title: 'Emotional Changes over Messages (Stacked Area Plot)',
    xaxis: { title: 'Message Index' },
    yaxis: { title: 'Emotion Score' },
  };

  // Heatmap
  const heatmapData = [{
    x: userMessages.map((_, index) => index),
    y: top5Emotions,
    z: top5Emotions.map((emotionName) =>
      emotions.map((emotion) => emotion[emotionName] || 0)
    ),
    type: 'heatmap' as const,
    colorscale: 'Viridis',
  }];

  const heatmapLayout = {
    title: 'Emotional Distribution over Messages (Heatmap)',
    xaxis: { title: 'Message Index' },
    yaxis: { title: 'Emotion' },
  };

  return (
    <div>
      <Plot data={lineData} layout={lineLayout} />
      {/* <Plot data={areaData} layout={areaLayout} /> */}
      <Plot data={heatmapData} layout={heatmapLayout} />
    </div>
  );
};

export default EmotionPlot;
