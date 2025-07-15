// src/components/wizard/types.ts

// Define user preferences type
export type UserPreferences = {
  mentionedIngredients?: string[];
  preferredFlavors?: string[];
  cookingStyle?: string;
};

// Define the Recipe data structure
export type RecipeData = {
  memoryType: string;
  writtenMemory?: string;
  emotionalIngredients: string[];
  actualIngredient?: string;
  dedication: string;
  dedicationRecipient?: string;
  referenceIngredient?: string;
  secretIngredient?: string;
  spiceOrCondiment?: string;
  intensity: string;
  shape: {
    value: string;         // ← Usamos .value para reproducir el video correcto
    metaphor: string;
    geometry: string;
    example: string;
    image: string;
  } | null;
  flavorProfile?: string;
  finalEmotion: string;
  serveTime: string;
  language: string;
  userPreferences?: UserPreferences;
  conversationContext?: string;
};

// Initial state for recipeData
export const initialRecipeState: RecipeData = {
  memoryType: "",
  emotionalIngredients: [],
  dedication: "",
  dedicationRecipient: "",
  intensity: "",
  shape: null,
  flavorProfile: "balanced",
  finalEmotion: "",
  serveTime: "present",
  language: "english"
};

export const steps = [
  "Memory",
  "Ingredients", 
  "Dedication",
  "Intensity",
  "Final Touch"
];
