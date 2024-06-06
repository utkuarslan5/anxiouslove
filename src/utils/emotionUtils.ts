import { expressionColors } from 'expression-colors';
import { MessageType } from '../components/EmotionPlot';
import { UserTranscriptMessage, AssistantTranscriptMessage } from "@humeai/voice";

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

export function calculateAverageEmotionMessage(
  messages: MessageType[]
): AssistantTranscriptMessage {
  const userEmotions: Record<string, number> = {};
  let userMessageCount = 0;

  messages.forEach((message) => {
    if (message.type === "user_message" && message.models?.prosody) {
      userMessageCount++;
      Object.entries(message.models.prosody.scores).forEach(
        ([emotion, score]) => {
          userEmotions[emotion] = (userEmotions[emotion] || 0) + score;
        }
      );
    }
  });

  // Calculate the average scores
  Object.keys(userEmotions).forEach((emotion) => {
    userEmotions[emotion] /= userMessageCount;
  });

  // Create a new assistant message object with the average emotions
  const averageEmotionMessage: AssistantTranscriptMessage = {
    type: "assistant_message",
    message: {
      role: "assistant",
      content: "Conversation Average",
    },
    id: "conversation-average", // Add a unique identifier for the message
    models: {
      prosody: {
        scores: userEmotions,
      },
    },
    from_text: false, // Set from_text to false since it's not generated from text
    receivedAt: new Date(), // Add the receivedAt property with the current date
  };

  return averageEmotionMessage;
}

export const calculateGroupAverages = (sums: Record<string, number>) => {
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

export const calculateMetrics = (emotions: Record<string, number>[]) => {
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

export const getEmotionAverages = (messages: Record<string, number>[]) => {
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

export const calculateCallDuration = (data: MessageType[]) => {
  if (data.length > 0) {
    const firstTimestamp = new Date(data[0].receivedAt).getTime();
    const lastTimestamp = new Date(data[data.length - 1].receivedAt).getTime();
    const durationInMs = lastTimestamp - firstTimestamp;
    const durationInMinutes = Math.floor(durationInMs / 60000);
    const seconds = Math.floor((durationInMs % 60000) / 1000);
    return `${durationInMinutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
  return '';
};