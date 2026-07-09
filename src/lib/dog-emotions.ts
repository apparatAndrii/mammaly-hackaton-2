export const dogEmotions = [
  { id: "happy", label: "Happy" },
  { id: "curious", label: "Curious" },
  { id: "wink", label: "Wink" },
  { id: "neutral", label: "Neutral" },
  { id: "shocked", label: "Shocked" },
  { id: "laughing", label: "Laughing" },
  { id: "angry", label: "Angry" },
  { id: "excited", label: "Excited" },
  { id: "skeptical", label: "Skeptical" },
  { id: "very-happy", label: "Very happy" },
  { id: "sleepy", label: "Sleepy" },
  { id: "playful", label: "Playful" },
  { id: "content", label: "Content" },
  { id: "pouty", label: "Pouty" },
  { id: "guilty", label: "Guilty" },
  { id: "cheerful", label: "Cheerful" },
] as const;

export type DogEmotionId = (typeof dogEmotions)[number]["id"];
