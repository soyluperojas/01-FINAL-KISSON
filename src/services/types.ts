
// Define shared types that will be used across the service files
export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

// Additional types to support recipe data
export type RecipeIngredient = {
  name: string;
  amount: string;
  unit: string;
  section?: string; // e.g., "For the dough", "For the filling"
};

export type RecipeInstruction = {
  step: number;
  description: string;
  section?: string; // e.g., "Dough preparation", "Filling preparation"
};

export type CookingRecipe = {
  title: string;
  description: string;
  ingredients: RecipeIngredient[];
  instructions: RecipeInstruction[];
  servingSize: number;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  difficulty: string; // "Easy", "Medium", "Hard"
  cuisineType: string; // e.g., "Italian", "Chinese", "Fusion" 
  notes: string[];
  tips: string[];
  emotionalConnection: string; // Connection to the memory/emotion
};
