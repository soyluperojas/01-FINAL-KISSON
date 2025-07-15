
import { RecipeData } from "@/components/RecipeWizard";
import { generateSimpleShareUrl } from "./recipeStorage";

interface ExtendedRecipeData extends RecipeData {
  generatedTitle?: string;
  generatedRecipe?: string;
  generatedIngredients?: string[];
  generatedDescription?: string;
}

export const generateShareableRecipeUrl = async (recipeData: ExtendedRecipeData, imageUrl?: string, recipeId?: string): Promise<string> => {
  try {
    // Use the new database-backed URL generation with the provided recipe ID
    const shareableUrl = await generateSimpleShareUrl(recipeData, imageUrl, recipeId);
    
    console.log("Generated shareable URL:", shareableUrl);
    console.log("URL length:", shareableUrl.length);
    
    return shareableUrl;
  } catch (error) {
    console.error("Error generating shareable URL:", error);
    throw new Error("Failed to generate shareable URL");
  }
};

// Keep the old functions for backward compatibility but they won't be used
export const encodeRecipeData = (recipeData: ExtendedRecipeData): string => {
  // This is now unused but kept for compatibility
  return "";
};

export const decodeRecipeData = (encodedData: string): ExtendedRecipeData => {
  // This is now unused but kept for compatibility
  throw new Error("Use getRecipe from recipeStorage instead");
};
