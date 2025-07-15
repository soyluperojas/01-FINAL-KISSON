
import { RecipeData } from "@/components/RecipeWizard";
import { openAIService } from "@/services/openAiService";

export const generateApiRecipe = async (data: RecipeData, poeticIngredients: string[]) => {
  // Create comprehensive prompt including ALL available user data
  const emotionalContext = data.emotionalIngredients?.join(", ") || "memory";
  const dedicationContext = data.dedication ? `Dedicated to: ${data.dedication}` : "";
  const memoryContext = data.writtenMemory || "a cherished memory";
  const intensityLevel = data.intensity || "medium";
  const selectedTime = data.serveTime || "present";
  const poeticIngredientsText = poeticIngredients.length > 0 ? poeticIngredients.join(", ") : "memory essence";

  // Enhanced recipe generation prompt with explicit instructions about formatting
  const recipePrompt = `Create a complete, detailed cooking recipe for dumplings that captures the essence of "${memoryContext}".

Context:
- Emotional ingredients: ${emotionalContext}
- Poetic ingredients: ${poeticIngredientsText} 
- Intensity level: ${intensityLevel}
- Time period: ${selectedTime}
- ${dedicationContext}

IMPORTANT FORMATTING RULES:
- Do NOT start with "Title:" or "Recipe:" or any similar prefix
- Do NOT use markdown headers (##, ###, etc.)
- Start directly with the recipe content
- Use clear, clean formatting without prefixes

Create a recipe that includes:

INGREDIENTS:
- List all ingredients with precise measurements
- Include both traditional dumpling ingredients and symbolic ingredients that reflect the memory
- Make the ingredient list practical but meaningful

INSTRUCTIONS:
- Provide step-by-step cooking instructions
- Include preparation techniques that honor the memory
- Add cooking tips and timing details
- Include symbolic elements that connect to the emotional context

The recipe should be both functional for actual cooking and emotionally resonant with the memory provided.`;

  const titlePrompt = `Generate a poetic, meaningful title for a dumpling recipe that captures "${memoryContext}" with emotional ingredients: ${emotionalContext}.

IMPORTANT: 
- Return ONLY the title text
- Do NOT include "Title:" or any prefix
- Keep it concise (under 10 words)
- Make it evocative and memorable
- Do NOT use quotes around the title`;

  try {
    console.log("Generating recipe with comprehensive context...");
    
    // Generate title and recipe in parallel
    const [titleResponse, recipeResponse] = await Promise.all([
      openAIService.generateText(titlePrompt),
      openAIService.generateText(recipePrompt)
    ]);

    // Clean up responses to remove any unwanted prefixes
    const cleanTitle = titleResponse
      .replace(/^Title:\s*/i, '')
      .replace(/^Recipe Title:\s*/i, '')
      .replace(/^"/, '')
      .replace(/"$/, '')
      .replace(/^#+\s*/, '')
      .trim();

    const cleanRecipe = recipeResponse
      .replace(/^Title:\s*/i, '')
      .replace(/^Recipe:\s*/i, '')
      .replace(/^Recipe Title:\s*/i, '')
      .replace(/^#+\s*/, '')
      .trim();

    console.log("Generated comprehensive recipe successfully");
    return {
      title: cleanTitle,
      recipe: cleanRecipe
    };
  } catch (error) {
    console.error("Recipe generation failed:", error);
    throw error;
  }
};
