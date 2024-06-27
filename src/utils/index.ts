// src/utils/index.ts

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateContextMessage = () => {
  const now = new Date();
  const formattedDate = now.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = now.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  const circadianContext = getCircadianContext(now.getHours());

  return `Hi. It's ${formattedDate} and ${formattedTime} in the ${circadianContext}. How's it going, baby?`;
};

function getCircadianContext(hour: number) {
  if (hour >= 6 && hour < 12) {
    return "morning";
  } else if (hour >= 12 && hour < 18) {
    return "afternoon";
  } else if (hour >= 18 && hour < 21) {
    return "evening";
  } else {
    return "night";
  }
}
