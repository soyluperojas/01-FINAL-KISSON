
import { ExtendedRecipeData, STORAGE_KEY, MAX_RECIPES_PER_SESSION } from "./types";
import { isValidRecipeData } from "./validation";
import { InputSanitizer } from "@/utils/inputSanitizer";

export const getStoredRecipes = (): Map<string, ExtendedRecipeData> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsedData = JSON.parse(stored);
      const recipes = new Map<string, ExtendedRecipeData>();
      
      // Convert object entries to Map with proper typing
      Object.entries(parsedData).forEach(([id, recipe]) => {
        if (isValidRecipeData(recipe)) {
          recipes.set(id, recipe as ExtendedRecipeData);
        } else {
          console.warn(`Invalid recipe data found for ID ${id}, removing`);
        }
      });
      
      return recipes;
    }
  } catch (error) {
    console.error("Error reading recipes from localStorage:", error);
    // Clear corrupted data
    localStorage.removeItem(STORAGE_KEY);
  }
  return new Map();
};

export const saveRecipesToStorage = (recipes: Map<string, ExtendedRecipeData>) => {
  try {
    // Limit number of recipes per session to prevent abuse
    if (recipes.size > MAX_RECIPES_PER_SESSION) {
      console.warn(`Too many recipes stored (${recipes.size}), limiting to ${MAX_RECIPES_PER_SESSION}`);
      const recipeArray = Array.from(recipes.entries());
      const limitedRecipes = new Map(recipeArray.slice(-MAX_RECIPES_PER_SESSION));
      recipes = limitedRecipes;
    }

    // Sanitize data before storage
    const sanitizedRecipes = new Map();
    for (const [id, recipe] of recipes) {
      const sanitizedRecipe = InputSanitizer.sanitizeRecipeData(recipe);
      if (sanitizedRecipe && Object.keys(sanitizedRecipe).length > 0) {
        sanitizedRecipes.set(id, sanitizedRecipe);
      }
    }

    const recipesObject = Object.fromEntries(sanitizedRecipes);
    const sanitizedForStorage = InputSanitizer.sanitizeForStorage(recipesObject);
    
    if (sanitizedForStorage) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizedForStorage));
      console.log("Saved recipes to localStorage (sanitized)");
    }
  } catch (error) {
    console.error("Error saving recipes to localStorage:", error);
  }
};
