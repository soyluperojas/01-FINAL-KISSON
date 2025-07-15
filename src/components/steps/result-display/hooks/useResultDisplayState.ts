
import { useState, useEffect } from "react";
import { generateRecipeId } from "@/utils/recipeStorage";

export const useResultDisplayState = () => {
  const [recipeTitle, setRecipeTitle] = useState<string>("");
  const [shareableUrl, setShareableUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [poeticIngredients, setPoeticIngredients] = useState<string[]>([]);
  const [cookingRecipe, setCookingRecipe] = useState<string>("");
  const [memoryDescription, setMemoryDescription] = useState<string>("");
  const [recipeId] = useState<string>(() => generateRecipeId()); // Generate ID once for this session
  const [imageUrl, setImageUrl] = useState<string>("");

  // Set loading to false after a short delay
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleTitleGenerated = (title: string) => {
    console.log("Recipe title generated:", title);
    setRecipeTitle(title);
  };

  const handlePoeticIngredientsGenerated = (ingredients: string[]) => {
    setPoeticIngredients(ingredients);
    console.log("Poetic ingredients generated:", ingredients);
  };

  const handleCookingRecipeGenerated = (recipe: string) => {
    setCookingRecipe(recipe);
    console.log("Cooking recipe generated");
  };

  const handleMemoryDescriptionGenerated = (description: string) => {
    setMemoryDescription(description);
    console.log("Memory description generated:", description);
  };

  const handleImageGenerated = (generatedImageUrl: string) => {
    console.log("Image generated in ResultDisplay:", generatedImageUrl);
    setImageUrl(generatedImageUrl);
  };

  const handleUrlGenerated = (url: string) => {
    setShareableUrl(url);
  };

  return {
    recipeTitle,
    shareableUrl,
    isLoading,
    poeticIngredients,
    cookingRecipe,
    memoryDescription,
    recipeId,
    imageUrl,
    handleTitleGenerated,
    handlePoeticIngredientsGenerated,
    handleCookingRecipeGenerated,
    handleMemoryDescriptionGenerated,
    handleImageGenerated,
    handleUrlGenerated
  };
};
