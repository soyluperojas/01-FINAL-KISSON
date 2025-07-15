
import { generateImage } from "@/services/imageGeneration/imageGenerationService";
import { updateRecipeImage } from "@/utils/recipeStorage";
import { toast } from "@/components/ui/sonner";
import { RecipeData } from "@/components/RecipeWizard";

interface GenerateImageParams {
  data: RecipeData;
  recipeTitle: string;
  recipeId?: string;
  poeticIngredients?: string[];
  onImageGenerated?: (imageUrl: string) => void;
}

export const useImageGenerationService = () => {
  const generateRecipeImage = async ({
    data,
    recipeTitle,
    recipeId,
    poeticIngredients,
    onImageGenerated
  }: GenerateImageParams): Promise<{ imageUrl: string | null; error?: string }> => {
    if (!recipeTitle) {
      console.log("Skipping image generation - missing title");
      return { imageUrl: null };
    }
    
    console.log("=== DEBUG: Starting image generation ===");
    console.log("Recipe title:", recipeTitle);
    console.log("Recipe ID:", recipeId);
    
    try {
      // Create comprehensive prompt using ALL user information
      let comprehensivePrompt = `A beautiful dumpling that embodies the essence of "${data.memoryType}" memory`;
      
      // Add emotional context
      if (data.emotionalIngredients && data.emotionalIngredients.length > 0) {
        comprehensivePrompt += ` infused with the emotions of ${data.emotionalIngredients.join(", ")}`;
      }
      
      // Add dedication context
      if (data.dedication) {
        comprehensivePrompt += ` created with ${data.dedication}`;
        if (data.dedicationRecipient) {
          comprehensivePrompt += ` for ${data.dedicationRecipient}`;
        }
      }
      
      // Add intensity and final emotion
      if (data.intensity) {
        comprehensivePrompt += ` with ${data.intensity} energy intensity`;
      }
      if (data.finalEmotion) {
        comprehensivePrompt += ` designed to evoke ${data.finalEmotion}`;
      }
      
      // Add flavor profile
      if (data.flavorProfile) {
        comprehensivePrompt += ` following a ${data.flavorProfile} flavor philosophy`;
      }
      
      // Combine all ingredients
      const allIngredients = [
        ...(poeticIngredients || []),
        data.actualIngredient,
        data.spiceOrCondiment
      ].filter(Boolean) as string[];
      
      console.log("=== DEBUG: About to call generateImage ===");
      console.log("Prompt:", comprehensivePrompt);
      console.log("Shape:", data.shape?.value);
      console.log("Ingredients:", allIngredients);
      
      const generatedImageUrl = await generateImage(
        comprehensivePrompt,
        data.shape?.value,
        allIngredients,
        data.intensity,
        recipeId,
        data.serveTime
      );
      
      console.log("=== DEBUG: generateImage returned ===");
      console.log("Generated URL:", generatedImageUrl);
      
      if (generatedImageUrl && generatedImageUrl.length > 0) {
        console.log("=== IMAGE GENERATION SUCCESS ===");
        
        if (onImageGenerated) {
          onImageGenerated(generatedImageUrl);
        }
        
        // Update stored image if it's a Supabase URL
        if (recipeId && generatedImageUrl.includes('supabase')) {
          try {
            await updateRecipeImage(recipeId, generatedImageUrl);
            console.log("Recipe image record updated");
            toast.success("Recipe image generated and saved!");
          } catch (updateError) {
            console.warn("Failed to update recipe image record:", updateError);
          }
        } else {
          toast.success("Recipe image generated!");
        }
        
        return { imageUrl: generatedImageUrl };
      } else {
        console.error("=== DEBUG: No valid image URL returned ===");
        throw new Error("No image URL received from generation service");
      }
    } catch (error) {
      console.error("=== IMAGE GENERATION FAILED ===");
      console.error("Full error object:", error);
      console.error("Error message:", error?.message);
      console.error("Error stack:", error?.stack);
      
      // More specific error handling with better user messages
      const errorMessage = error?.message || "Unknown error";
      let userMessage = "";
      
      if (errorMessage.includes('server issues') || errorMessage.includes('500')) {
        userMessage = "OpenAI DALL-E service is temporarily down due to server issues on their end. This is a known issue that should resolve within a few minutes.";
        toast.error("DALL-E service temporarily unavailable - OpenAI server issues", {
          description: "This is a temporary issue on OpenAI's end. Please try again in a few minutes."
        });
      } else if (errorMessage.includes('quota') || errorMessage.includes('429')) {
        userMessage = "OpenAI rate limit exceeded - too many requests. Please wait a moment before trying again.";
        toast.error("Rate limit exceeded", {
          description: "Please wait a moment and try again."
        });
      } else if (errorMessage.includes('402') || errorMessage.includes('payment')) {
        userMessage = "OpenAI payment required - please check your OpenAI billing settings.";
        toast.error("Payment required", {
          description: "Please check your OpenAI billing settings."
        });
      } else {
        userMessage = `Image generation failed: ${errorMessage}`;
        toast.error("Image generation failed", {
          description: errorMessage
        });
      }
      
      return { imageUrl: null, error: userMessage };
    }
  };

  return { generateRecipeImage };
};
