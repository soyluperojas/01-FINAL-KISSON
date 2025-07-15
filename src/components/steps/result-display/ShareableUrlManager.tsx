import { useState, useEffect } from "react";
import { RecipeData } from "@/components/RecipeWizard";
import { generateShareableRecipeUrl } from "@/utils/recipeSharing";
import { toast } from "@/components/ui/sonner";

interface ShareableUrlManagerProps {
  data: RecipeData;
  recipeTitle: string;
  cookingRecipe: string;
  poeticIngredients: string[];
  memoryDescription: string;
  recipeId: string;
  onUrlGenerated: (url: string) => void;
}

export const ShareableUrlManager = ({
  data,
  recipeTitle,
  cookingRecipe,
  poeticIngredients,
  memoryDescription,
  recipeId,
  onUrlGenerated
}: ShareableUrlManagerProps) => {
  const [hasGeneratedUrl, setHasGeneratedUrl] = useState(false);

  // Clean up the recipe data to ensure proper string values
  const cleanRecipeData = (rawData: RecipeData): RecipeData => {
    console.log("Raw recipe data:", rawData);
    
    const cleaned = {
      ...rawData,
      actualIngredient: typeof rawData.actualIngredient === 'object' ? 
        (rawData.actualIngredient as any)?.value || "vegetables" : 
        rawData.actualIngredient || "vegetables",
      spiceOrCondiment: typeof rawData.spiceOrCondiment === 'object' ? 
        (rawData.spiceOrCondiment as any)?.value || "salt and pepper" : 
        rawData.spiceOrCondiment || "salt and pepper",
      writtenMemory: typeof rawData.writtenMemory === 'object' ? 
        (rawData.writtenMemory as any)?.value || "" : 
        rawData.writtenMemory || "",
      referenceIngredient: typeof rawData.referenceIngredient === 'object' ? 
        (rawData.referenceIngredient as any)?.value || "" : 
        rawData.referenceIngredient || ""
    };
    
    console.log("Cleaned recipe data:", cleaned);
    return cleaned;
  };

  // Generate shareable URL when we have enough data
  useEffect(() => {
    if (!hasGeneratedUrl && recipeTitle) {
      console.log("Generating shareable URL with current data");
      generateFinalShareableUrl();
      setHasGeneratedUrl(true);
    }
  }, [recipeTitle, hasGeneratedUrl]);

  const generateFinalShareableUrl = async () => {
    try {
      const cleanedData = cleanRecipeData(data);
      // Create the complete recipe data with what we have so far
      const completeRecipeData = {
        ...cleanedData,
        generatedTitle: recipeTitle || `${cleanedData.emotionalIngredients?.[0] || "Memory"} Recipe`,
        generatedRecipe: cookingRecipe || "Recipe being prepared...",
        generatedIngredients: poeticIngredients.length > 0 ? poeticIngredients : [cleanedData.actualIngredient, cleanedData.spiceOrCondiment].filter(Boolean),
        generatedDescription: memoryDescription || "A memory recipe created with love..."
      };
      
      const url = await generateShareableRecipeUrl(completeRecipeData, undefined, recipeId);
      console.log("Generated shareable URL:", url);
      onUrlGenerated(url);
    } catch (error) {
      console.error("Error generating shareable URL:", error);
      toast.error("Failed to generate shareable link");
      
      // Keep a basic fallback that won't work perfectly but won't crash
      const fallbackUrl = `${window.location.origin}/recipe/${recipeId}`;
      console.log("Using basic fallback URL:", fallbackUrl);
      onUrlGenerated(fallbackUrl);
    }
  };

  return null; // This component handles logic only, no UI
};
