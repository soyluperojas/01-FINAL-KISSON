
import { useState, useEffect } from "react";
import { RecipeData } from "@/components/RecipeWizard";
import { openAIService } from "@/services/openAiService";
import { toast } from "@/components/ui/sonner";

interface MemoryDescriptionProps {
  data: RecipeData;
  onIngredientsGenerated?: (ingredients: string[]) => void;
  onDescriptionGenerated?: (description: string) => void;
  preGeneratedIngredients?: string[];
}

export const MemoryDescription = ({ 
  data, 
  onIngredientsGenerated, 
  onDescriptionGenerated,
  preGeneratedIngredients 
}: MemoryDescriptionProps) => {
  const [memoryDescription, setMemoryDescription] = useState<string>("");
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [actualIngredients, setActualIngredients] = useState<string[]>([]);

  useEffect(() => {
    // Check if this is a shared recipe page by looking at the URL
    const isSharedRecipe = window.location.pathname.includes('/recipe/');
    
    // PRIORITY 1: If we have pre-generated ingredients (shared recipe), use them immediately
    if (preGeneratedIngredients && preGeneratedIngredients.length > 0) {
      console.log("SHARED RECIPE: Using pre-generated ingredients - NO API calls");
      setActualIngredients(preGeneratedIngredients);
      if (onIngredientsGenerated) {
        onIngredientsGenerated(preGeneratedIngredients);
      }
      generateSimpleDescription();
      return;
    }

    // PRIORITY 2: If this is a shared recipe but no pre-generated ingredients, use simple fallback
    if (isSharedRecipe) {
      console.log("SHARED RECIPE: Using simple description - NO API calls");
      generateSimpleDescription();
      return;
    }

    // PRIORITY 3: For new recipes only - check API availability and generate
    if (openAIService.isApiKeyConfigured()) {
      console.log("NEW RECIPE: API key available, generating description");
      generateMemoryDescription();
    } else {
      console.log("NEW RECIPE: No API key, using simple description");
      generateSimpleDescription();
    }
  }, [preGeneratedIngredients]);

  const generateSimpleDescription = () => {
    // Create a simple poetic description without API call using ONLY user ingredients
    const memoryTypeText = data.memoryType === "childhood" ? "childhood" : "life";
    const emotionsText = data.emotionalIngredients.join(" and ");
    const ingredientText = data.actualIngredient || "an ingredient";
    const spiceText = data.spiceOrCondiment || "spices";
    const flavorProfile = data.flavorProfile || 'balanced';
    
    // Address the specific person if provided
    const addressee = data.dedicationRecipient ? `, dear ${data.dedicationRecipient}` : "";
    
    const fallbackDescription = `Your ${memoryTypeText} memory${addressee} is served wrapped in ${emotionsText} like ${ingredientText} seasoned with ${spiceText} in a ${flavorProfile} harmony.`;
    setMemoryDescription(fallbackDescription);
    
    // Pass the description back to parent
    if (onDescriptionGenerated) {
      onDescriptionGenerated(fallbackDescription);
    }
    
    // Set ONLY user ingredients (only if not already set from pre-generated)
    if (!preGeneratedIngredients) {
      const userOnlyIngredients = [
        data.actualIngredient,
        data.spiceOrCondiment
      ].filter(Boolean) as string[];
      
      setActualIngredients(userOnlyIngredients);
      
      if (onIngredientsGenerated && userOnlyIngredients.length > 0) {
        onIngredientsGenerated(userOnlyIngredients);
      }
    }
  };

  const generateMemoryDescription = async () => {
    if (!data) return;
    
    setIsGeneratingDescription(true);
    
    try {
      // Extract ONLY user-provided ingredients - NO EMOTIONAL/POETIC INGREDIENTS
      const userOnlyIngredients = [
        data.actualIngredient,
        data.spiceOrCondiment,
        ...(data.secretIngredient ? [data.secretIngredient] : [])
      ].filter(Boolean) as string[];
      
      const flavorProfile = data.flavorProfile || 'balanced';
      
      // Address the specific person if provided
      const addresseeInstruction = data.dedicationRecipient 
        ? `IMPORTANT: Address this person directly by name in the description: "${data.dedicationRecipient}". Use their name naturally in the poetic paragraph.`
        : "";
      
      const prompt = `
        Write a short poetic paragraph (2-3 lines) describing this memory as a culinary metaphor.
        Memory details:
        - Memory type: ${data.memoryType}
        - Emotional ingredients: ${data.emotionalIngredients.join(", ")}
        - Dedicated to: ${data.dedication}
        - Experience intensity: ${data.intensity}
        - Target emotion: ${data.finalEmotion}
        - Serve time: ${data.serveTime}
        - Flavor profile: ${flavorProfile}
        
        ${addresseeInstruction}

        CRITICAL: DO NOT generate any poetic or emotional ingredients. Use ONLY these actual cooking ingredients: ${userOnlyIngredients.join(", ")}
        
        The emotional elements should be used for INSPIRATION in the description only, not as actual recipe ingredients.

        Respond with a JSON object containing:
        {
          "description": "The poetic paragraph here that uses emotions for storytelling but mentions only real ingredients",
          "actualIngredients": ["${userOnlyIngredients.join('", "')}"]
        }
        
        Write the paragraph in English, in second person, with a poetic and gentle tone.
        Use the emotions for storytelling, but only mention actual cooking ingredients.
      `;
      
      const response = await openAIService.generateText(prompt);
      let parsedResponse;
      
      try {
        parsedResponse = JSON.parse(response);
        setMemoryDescription(parsedResponse.description);
        
        // Pass the description back to parent
        if (onDescriptionGenerated) {
          onDescriptionGenerated(parsedResponse.description);
        }
        
        // Use ONLY the actual ingredients, not any AI-generated poetic ones
        const ingredientsToUse = parsedResponse.actualIngredients || userOnlyIngredients;
        
        setActualIngredients(ingredientsToUse);
        
        if (onIngredientsGenerated && ingredientsToUse.length > 0) {
          onIngredientsGenerated(ingredientsToUse);
        }
      } catch (parseError) {
        // If parsing fails, use the response as-is but use only user ingredients
        console.error("Failed to parse JSON response:", parseError);
        setMemoryDescription(response);
        
        // Pass the description back to parent even if parsing failed
        if (onDescriptionGenerated) {
          onDescriptionGenerated(response);
        }
        
        // Use only user ingredients as fallback
        if (onIngredientsGenerated && userOnlyIngredients.length > 0) {
          onIngredientsGenerated(userOnlyIngredients);
        }
      }
    } catch (error) {
      console.error("Error creating memory description:", error);
      toast.error("We couldn't create your memory description");
      
      // Generate a fallback description without API
      generateSimpleDescription();
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  if (isGeneratingDescription) {
    return (
      <div className="animate-pulse h-12 bg-slate-200 rounded mb-4"></div>
    );
  }

  return (
    <div className="mb-4">
      <p className="text-center italic memory-description">{memoryDescription}</p>
    </div>
  );
};
