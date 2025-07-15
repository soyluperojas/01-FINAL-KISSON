
import { useEffect } from "react";
import { RecipeData } from "@/components/RecipeWizard";
import { openAIService } from "@/services/openAiService";
import { useImageUrlValidation } from "./useImageUrlValidation";
import { useImageGenerationService } from "./useImageGenerationService";
import { useImageLoadingState } from "./useImageLoadingState";

interface UseImageGenerationProps {
  data: RecipeData & { storedImageUrl?: string };
  recipeTitle: string;
  recipeId?: string;
  poeticIngredients?: string[];
  onImageGenerated?: (imageUrl: string) => void;
}

export const useImageGeneration = ({
  data,
  recipeTitle,
  recipeId,
  poeticIngredients,
  onImageGenerated
}: UseImageGenerationProps) => {
  const { extractValidImageUrl } = useImageUrlValidation();
  const { generateRecipeImage } = useImageGenerationService();
  const {
    imageUrl,
    hasValidImage,
    showApiError,
    isGenerating,
    errorMessage,
    setGeneratingState,
    setImageSuccess,
    setImageFailure,
    handleImageError,
    handleImageLoad
  } = useImageLoadingState();

  const performImageGeneration = async () => {
    if (!recipeTitle || isGenerating) {
      console.log("Skipping image generation - missing title or already generating");
      return;
    }
    
    console.log("=== DEBUG: Starting image generation ===");
    console.log("API Key configured:", openAIService.isApiKeyConfigured());
    
    setGeneratingState(true);
    
    try {
      const result = await generateRecipeImage({
        data,
        recipeTitle,
        recipeId,
        poeticIngredients,
        onImageGenerated
      });
      
      if (result.imageUrl) {
        setImageSuccess(result.imageUrl);
      } else {
        setImageFailure(result.error);
      }
    } catch (error) {
      setImageFailure(error?.message || "Unknown error");
    }
  };

  useEffect(() => {
    console.log("=== IMAGE GENERATION HOOK EFFECT ===");
    console.log("Recipe ID:", recipeId);
    console.log("Recipe title:", recipeTitle);
    console.log("Has stored image:", !!data.storedImageUrl);
    console.log("Current path:", window.location.pathname);
    console.log("API configured:", openAIService.isApiKeyConfigured());
    
    // Priority 1: Use stored image URL if it exists and is valid
    if (data.storedImageUrl) {
      const cleanImageUrl = extractValidImageUrl(data.storedImageUrl);
      
      if (cleanImageUrl) {
        console.log("Using existing stored image:", cleanImageUrl);
        setImageSuccess(cleanImageUrl);
        if (onImageGenerated) {
          onImageGenerated(cleanImageUrl);
        }
        return;
      }
    }

    // For shared recipes (URL contains /recipe/), don't generate new images
    const isSharedRecipe = window.location.pathname.includes('/recipe/');
    if (isSharedRecipe) {
      console.log("Shared recipe detected - skipping image generation");
      setImageFailure("Shared recipe - no generation needed");
      return;
    }

    // Check if API is configured before attempting generation
    if (!openAIService.isApiKeyConfigured()) {
      console.log("=== DEBUG: API key not configured ===");
      setImageFailure("API key not configured");
      return;
    }

    // Only attempt generation if we have a recipe title and API is configured
    if (recipeTitle && recipeTitle.length > 0) {
      console.log("=== DEBUG: Triggering image generation ===");
      performImageGeneration();
    } else {
      console.log("=== DEBUG: Waiting for recipe title ===");
    }
  }, [recipeTitle, data.storedImageUrl]); // Depend on both title and stored image

  return {
    imageUrl,
    hasValidImage,
    showApiError,
    isGenerating,
    errorMessage,
    handleImageError,
    handleImageLoad
  };
};
