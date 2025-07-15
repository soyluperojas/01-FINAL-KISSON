
export const getIntensityLabel = (temperature: number) => {
  if (temperature === 0) return "Cold Process";
  if (temperature <= 80) return "Gentle Simmer";
  if (temperature <= 160) return "Steady Flame";
  return "Rolling Boil";
};

export const getIntensityDescription = (temperature: number) => {
  if (temperature === 0) return "A gentle preparation method with no heat, preserving the raw essence";
  if (temperature <= 80) return "A soft, subtle approach that slowly releases flavors";
  if (temperature <= 160) return "A balanced intensity that thoroughly develops the experience";
  return "A powerful, transformative intensity that creates profound change";
};

export const getIntensityColor = (temperature: number) => {
  if (temperature === 0) return "bg-blue-400";
  if (temperature <= 80) return "bg-purple-400";
  if (temperature <= 160) return "bg-orange-400";
  return "bg-red-500";
};

export const getIntensityGradient = (temperature: number) => {
  if (temperature === 0) return "from-blue-200 to-blue-600";
  if (temperature <= 80) return "from-purple-200 to-purple-600";
  if (temperature <= 160) return "from-orange-200 to-orange-600";
  return "from-red-200 to-red-600";
};
