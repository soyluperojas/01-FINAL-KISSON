
import { RecipeData } from "@/components/RecipeWizard";

export interface ExtendedRecipeData extends RecipeData {
  generatedTitle?: string;
  generatedRecipe?: string;
  generatedIngredients?: string[];
  generatedDescription?: string;
  storedImageUrl?: string;
}

export const STORAGE_KEY = "kissonRecipes";
export const MAX_RECIPES_PER_SESSION = 50;
