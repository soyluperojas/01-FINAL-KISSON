
import { supabase } from "@/integrations/supabase/client";
import { StorageService } from "../storageService";
import { generateHologramPrompt } from "./hologramPromptGenerator";
import { getPlaceholderImage } from "./placeholderService";

export async function generateImage(
  prompt: string, 
  shape?: string, 
  ingredients?: string[], 
  intensity?: string, 
  recipeId?: string, 
  timePeriod?: string
): Promise<string> {
  try {
    console.log("=== DALL-E IMAGE GENERATION START ===");
    console.log("Base prompt:", prompt);
    console.log("Shape:", shape);
    console.log("Ingredients:", ingredients);
    console.log("Time period:", timePeriod);
    console.log("Recipe ID:", recipeId);
    
    // Generate hologram-ready prompt with SOLID BLACK BACKGROUND
    let enhancedPrompt = generateHologramPrompt(timePeriod || 'present', prompt, shape, ingredients, intensity);
    
    console.log("Enhanced hologram prompt:", enhancedPrompt);
    
    console.log("=== CALLING SUPABASE FUNCTION ===");
    const { data, error } = await supabase.functions.invoke('openai-proxy', {
      body: {
        endpoint: '/images/generations',
        method: 'POST',
        body: {
          model: "dall-e-3",
          prompt: enhancedPrompt,
          n: 1,
          size: "1024x1024",
          quality: "hd",
          style: "vivid"
        }
      }
    });

    console.log("=== SUPABASE FUNCTION RESPONSE ===");
    console.log("Response data:", data);
    console.log("Response error:", error);
    
    if (error) {
      console.error("=== DALL-E API ERROR ===");
      console.error("Error details:", error);
      
      // Enhanced error handling for specific OpenAI issues
      if (error.message && error.message.includes('500')) {
        throw new Error("OpenAI DALL-E service is temporarily experiencing server issues. This is a known issue on OpenAI's end. Please try again in a few minutes.");
      } else if (error.message && error.message.includes('429')) {
        throw new Error("OpenAI rate limit exceeded. Please wait a moment and try again.");
      } else if (error.message && error.message.includes('402')) {
        throw new Error("OpenAI payment required - please check your OpenAI billing settings.");
      }
      
      throw new Error(`DALL-E API error: ${error.message || "Unknown error"}`);
    }
    
    if (data && data.data && data.data[0] && data.data[0].url) {
      const generatedImageUrl = data.data[0].url;
      console.log("=== DALL-E SUCCESS ===");
      console.log("Generated image URL:", generatedImageUrl);
      
      // If we have a recipe ID, try to upload the image to storage for permanent storage
      if (recipeId) {
        console.log("Attempting to upload image to Supabase Storage...");
        
        // First check if bucket is accessible
        const bucketAccessible = await StorageService.checkBucketAccess();
        if (!bucketAccessible) {
          console.warn("Storage bucket not accessible, using temporary DALL-E URL");
          return generatedImageUrl;
        }
        
        try {
          const fileName = StorageService.generateImageFileName(recipeId);
          const storedImageUrl = await StorageService.uploadImageFromUrl(generatedImageUrl, fileName);
          
          if (storedImageUrl) {
            console.log("Image successfully uploaded to Supabase Storage:", storedImageUrl);
            return storedImageUrl;
          } else {
            console.warn("Failed to upload image to Supabase Storage, using temporary DALL-E URL");
            return generatedImageUrl;
          }
        } catch (uploadError) {
          console.warn("Error during image upload to Supabase Storage:", uploadError);
          console.log("Continuing with temporary DALL-E URL");
          return generatedImageUrl;
        }
      }
      
      // Return the temporary DALL-E URL if no recipe ID provided or upload failed
      return generatedImageUrl;
    } else {
      console.error("=== DALL-E UNEXPECTED RESPONSE ===");
      console.error("Response structure:", data);
      throw new Error("Missing image URL in DALL-E API response");
    }
  } catch (error) {
    console.error("=== IMAGE GENERATION COMPLETE FAILURE ===");
    console.error("Error details:", error);
    console.error("Error name:", error?.name);
    console.error("Error message:", error?.message);
    console.error("Error stack:", error?.stack);
    
    // Instead of returning a placeholder, throw the error so the UI can handle it properly
    throw error;
  }
}
