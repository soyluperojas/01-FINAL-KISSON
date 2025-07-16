
export const flavorOptions = [
  {
    value: "sweet",
    metaphor: "Like dessert after dinner",
    description: "Sweet with fruits, sugar, and dessert notes."
  },
  {
    value: "balanced", 
    metaphor: "Like a perfect harmony",
    description: "Balanced for sweet or savory."
  },
  {
    value: "savory",
    metaphor: "Like a hearty meal",
    description: "Savory with herbs, spices, and tradition."
  }
];

export const getSelectedFlavor = (flavorValue: number) => {
  // Ensure the value is within bounds (0-240)
  const clampedValue = Math.max(0, Math.min(240, flavorValue));
  // Map to indices: 0-80 -> 0, 81-160 -> 1, 161-240 -> 2
  const flavorIndex = Math.round(clampedValue / 120);
  // Ensure index is within array bounds
  const safeIndex = Math.max(0, Math.min(2, flavorIndex));
  return flavorOptions[safeIndex];
};

export const getFlavorColor = (flavorValue: number) => {
  const clampedValue = Math.max(0, Math.min(240, flavorValue));
  const flavorIndex = Math.round(clampedValue / 120);
  const safeIndex = Math.max(0, Math.min(2, flavorIndex));
  
  switch (safeIndex) {
    case 0: return "bg-pink-400"; // Sweet
    case 1: return "bg-green-400"; // Balanced
    case 2: return "bg-amber-400"; // Savory
    default: return "bg-green-400"; // Default to balanced
  }
};

export const getFlavorGradient = (flavorValue: number) => {
  const clampedValue = Math.max(0, Math.min(240, flavorValue));
  const flavorIndex = Math.round(clampedValue / 120);
  const safeIndex = Math.max(0, Math.min(2, flavorIndex));
  
  switch (safeIndex) {
    case 0: return "from-pink-200 to-pink-600"; // Sweet
    case 1: return "from-green-200 to-green-600"; // Balanced
    case 2: return "from-amber-200 to-amber-600"; // Savory
    default: return "from-green-200 to-green-600"; // Default to balanced
  }
};
