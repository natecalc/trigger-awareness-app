export const emotionColors: Record<string, string> = {
  anger: "bg-red-100 text-red-800 border-red-200",
  sadness: "bg-blue-100 text-blue-800 border-blue-200",
  fear: "bg-purple-100 text-purple-800 border-purple-200",
  disgust: "bg-green-100 text-green-800 border-green-200",
  shame: "bg-orange-100 text-orange-800 border-orange-200",
  anxiety: "bg-yellow-100 text-yellow-800 border-yellow-200",
  guilt: "bg-cyan-100 text-cyan-800 border-cyan-200",
  joy: "bg-emerald-100 text-emerald-800 border-emerald-200",
  hurt: "bg-rose-100 text-rose-800 border-rose-200",
};

export const getEmotionColor = (emotion: string) => {
  const lowerEmotion = emotion.toLowerCase();
  return (
    emotionColors[lowerEmotion] || "bg-gray-100 text-gray-800 border-gray-200"
  );
};
