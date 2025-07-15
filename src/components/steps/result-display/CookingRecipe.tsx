
import { useState, useEffect } from "react";
import { RecipeData } from "@/components/RecipeWizard";
import { openAIService } from "@/services/openAiService";
import { generateFallbackRecipe } from "./cooking-recipe/FallbackRecipeGenerator";
import { generateApiRecipe } from "./cooking-recipe/RecipeGenerator";
import { RecipeLoadingState } from "./cooking-recipe/RecipeLoadingState";
import { RecipeContent } from "./cooking-recipe/RecipeContent";

interface CookingRecipeProps {
  data: RecipeData;
  onTitleGenerated: (title: string) => void;
  onRecipeGenerated: (recipe: string) => void;
  poeticIngredients: string[];
  preGeneratedRecipe?: string;
  preGeneratedTitle?: string;
}

// Helper function to clean up generated content by removing unwanted prefixes
const cleanGeneratedContent = (content: string): string => {
  if (!content) return content;
  
  // Remove "Title:" prefix and variations
  let cleaned = content
    .replace(/^Title:\s*/i, '')
    .replace(/^Recipe Title:\s*/i, '')
    .replace(/^Recipe:\s*/i, '')
    .replace(/^\*\*Title:\*\*\s*/i, '')
    .replace(/^\*\*Recipe Title:\*\*\s*/i, '')
    .replace(/^\*\*Recipe:\*\*\s*/i, '')
    .trim();
  
  // Remove any markdown formatting from the beginning
  cleaned = cleaned.replace(/^#+\s*/, '').trim();
  
  return cleaned;
};

export const CookingRecipe = ({ 
  data, 
  onTitleGenerated, 
  onRecipeGenerated, 
  poeticIngredients,
  preGeneratedRecipe,
  preGeneratedTitle 
}: CookingRecipeProps) => {
  const [cookingRecipe, setCookingRecipe] = useState<string>("");
  const [recipeTitle, setRecipeTitle] = useState<string>("");
  const [isGeneratingCookingRecipe, setIsGeneratingCookingRecipe] = useState(false);

  useEffect(() => {
    // Check if this is a shared recipe page by looking at the URL
    const isSharedRecipe = window.location.pathname.includes('/recipe/');
    
    // PRIORITY 1: If we have pre-generated content (from shared recipe), use it immediately
    if (preGeneratedRecipe && preGeneratedTitle) {
      console.log("SHARED RECIPE: Using pre-generated recipe content - NO API calls");
      const cleanedRecipe = cleanGeneratedContent(preGeneratedRecipe);
      const cleanedTitle = cleanGeneratedContent(preGeneratedTitle);
      
      setCookingRecipe(cleanedRecipe);
      setRecipeTitle(cleanedTitle);
      onTitleGenerated(cleanedTitle);
      onRecipeGenerated(cleanedRecipe);
      return;
    }

    // PRIORITY 2: If this is a shared recipe but no pre-generated content, use fallback
    if (isSharedRecipe) {
      console.log("SHARED RECIPE: Using fallback recipe - NO API calls");
      handleFallbackGeneration();
      return;
    }

    // PRIORITY 3: For new recipes only - check API availability and generate
    if (openAIService.isApiKeyConfigured()) {
      console.log("NEW RECIPE: API key available, generating comprehensive recipe with ALL user context");
      handleApiGeneration();
    } else {
      console.log("NEW RECIPE: No API key, using enhanced fallback recipe");
      handleFallbackGeneration();
    }
  }, [poeticIngredients, preGeneratedRecipe, preGeneratedTitle]);

  // Pass the title and recipe up when they're generated (only for new recipes)
  useEffect(() => {
    if (recipeTitle && !preGeneratedTitle) {
      onTitleGenerated(recipeTitle);
    }
  }, [recipeTitle, onTitleGenerated, preGeneratedTitle]);

  useEffect(() => {
    if (cookingRecipe && !preGeneratedRecipe) {
      onRecipeGenerated(cookingRecipe);
    }
  }, [cookingRecipe, onRecipeGenerated, preGeneratedRecipe]);

  const handleFallbackGeneration = () => {
    const { title, recipe } = generateFallbackRecipe(data, poeticIngredients);
    const cleanedTitle = cleanGeneratedContent(title);
    const cleanedRecipe = cleanGeneratedContent(recipe);
    
    setRecipeTitle(cleanedTitle);
    setCookingRecipe(cleanedRecipe);
  };

  const handleApiGeneration = async () => {
    if (!data) return;
    
    setIsGeneratingCookingRecipe(true);
    
    try {
      const { title, recipe } = await generateApiRecipe(data, poeticIngredients);
      const cleanedTitle = cleanGeneratedContent(title);
      const cleanedRecipe = cleanGeneratedContent(recipe);
      
      setRecipeTitle(cleanedTitle);
      setCookingRecipe(cleanedRecipe);
    } catch (error) {
      console.error("Error creating comprehensive cooking recipe:", error);
      
      // Silently use fallback recipe generation without showing errors
      handleFallbackGeneration();
    } finally {
      setIsGeneratingCookingRecipe(false);
    }
  };

  if (isGeneratingCookingRecipe) {
    return <RecipeLoadingState />;
  }

  return <RecipeContent cookingRecipe={cookingRecipe} />;
};
