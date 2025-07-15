
// Re-export all functionality from the refactored modules
export { generateRecipeId, storeRecipe, getRecipe, updateRecipeImage, getRecipeWithFallback } from "./storage/recipeOperations";
export { generateSimpleShareUrl } from "./storage/sharing";
export type { ExtendedRecipeData } from "./storage/types";
