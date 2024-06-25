import React, { useEffect, useState } from "react";
import { Backdrop } from "../WebGLBackdrop"; // Adjust the import path as needed
import { EmotionScores } from "@humeai/voice-embed-react"; // Adjust the import path as needed
import { VoiceAnimationState } from "../VoiceAnimation";

// Function to generate smoothly changing emotion scores
const generateSmoothEmotionScores = (
  prevScores: EmotionScores,
  time: number
): EmotionScores => {
  const newScores: EmotionScores = {};
  const frequency = 0.005; // Reduced frequency for smoother transitions

  // Generate new scores using a consistent sinusoidal function
  for (const emotion in prevScores) {
    // Using a consistent phase to ensure smoother transitions
    const newScore = 0.5 + 0.5 * Math.sin(frequency * time);
    newScores[emotion] = newScore;
  }

  return newScores;
};

// React functional component for the animated backdrop
const AnimatedBackdrop: React.FC = () => {
  const [emotionScores, setEmotionScores] = useState<EmotionScores>({
    Admiration: 0,
    Adoration: 0,
    "Aesthetic Appreciation": 0,
    Amusement: 0,
    Anger: 0,
    Anxiety: 0,
    Awe: 0,
    Awkwardness: 0,
    Boredom: 0,
    Calmness: 0,
    Concentration: 0,
    Confusion: 0,
    Contemplation: 0,
    Contempt: 0,
    Contentment: 0,
    Craving: 0,
    Desire: 0,
    Determination: 0,
    Disappointment: 0,
    Disgust: 0,
    Distress: 0,
    Doubt: 0,
    Ecstasy: 0,
    Embarrassment: 0,
    "Empathic Pain": 0,
    Entrancement: 0,
    Envy: 0,
    Excitement: 0,
    Fear: 0,
    Guilt: 0,
    Horror: 0,
    Interest: 0,
    Joy: 0,
    Love: 0,
    Nostalgia: 0,
    Pain: 0,
    Pride: 0,
    Realization: 0,
    Relief: 0,
    Romance: 0,
    Sadness: 0,
    Satisfaction: 0,
    Shame: 0,
    "Surprise (negative)": 0,
    "Surprise (positive)": 0,
    Sympathy: 0,
    Tiredness: 0,
    Triumph: 0,
  });

  useEffect(() => {
    let time = 0;
    const interval = setInterval(() => {
      setEmotionScores((prevScores) =>
        generateSmoothEmotionScores(prevScores, time)
      );
      time += 100; // Increment time slower to match the new frequency
    }, 100); // Update every 1000 milliseconds for slower transitions

    return () => clearInterval(interval);
  }, []);

  return (
    <Backdrop prosody={emotionScores} activeView={VoiceAnimationState.ERROR} />
  );
};

export default AnimatedBackdrop;
