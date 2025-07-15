
import { RecipeData } from "@/components/RecipeWizard";
import { MemoryDescription } from "../MemoryDescription";
import { CookingRecipe } from "../CookingRecipe";
import { PrintOptimizedLayout } from "./PrintOptimizedLayout";
import { ScreenOptimizedLayout } from "./ScreenOptimizedLayout";
import { useState, useEffect } from "react";

interface RecipeContentOptimizedProps {
  data: RecipeData;
  recipeTitle: string;
  shareableUrl: string;
  recipeId: string;
  poeticIngredients: string[];
  onTitleGenerated: (title: string) => void;
  onPoeticIngredientsGenerated: (ingredients: string[]) => void;
  onCookingRecipeGenerated: (recipe: string) => void;
  onMemoryDescriptionGenerated: (description: string) => void;
}

export const RecipeContentOptimized = ({
  data,
  recipeTitle,
  shareableUrl,
  recipeId,
  poeticIngredients,
  onTitleGenerated,
  onPoeticIngredientsGenerated,
  onCookingRecipeGenerated,
  onMemoryDescriptionGenerated
}: RecipeContentOptimizedProps) => {
  const [cookingRecipe, setCookingRecipe] = useState<string>("");
  const [memoryDescription, setMemoryDescription] = useState<string>("");
  const [isPrintContext, setIsPrintContext] = useState(false);

  // Detect print context
  useEffect(() => {
    const checkPrintContext = () => {
      // Check if we're in a print context or print preview
      const isPrint = window.matchMedia('print').matches || 
                     document.querySelector('.print-layout') !== null ||
                     window.location.pathname.includes('/recipe/');
      setIsPrintContext(isPrint);
    };

    checkPrintContext();
    
    // Listen for print events
    const printMediaQuery = window.matchMedia('print');
    const handlePrintChange = () => setIsPrintContext(printMediaQuery.matches);
    
    printMediaQuery.addEventListener('change', handlePrintChange);
    window.addEventListener('beforeprint', () => setIsPrintContext(true));
    window.addEventListener('afterprint', () => setIsPrintContext(false));

    return () => {
      printMediaQuery.removeEventListener('change', handlePrintChange);
      window.removeEventListener('beforeprint', () => setIsPrintContext(true));
      window.removeEventListener('afterprint', () => setIsPrintContext(false));
    };
  }, []);

  const handleRecipeGenerated = (recipe: string) => {
    setCookingRecipe(recipe);
    onCookingRecipeGenerated(recipe);
  };

  const handleMemoryDescriptionGenerated = (description: string) => {
    setMemoryDescription(description);
    onMemoryDescriptionGenerated(description);
  };

  return (
    <div className="w-full h-full relative bg-white text-black" 
         style={{ 
           width: '4in', 
           height: '6in',
           background: 'white',
           overflow: 'hidden',
           position: 'relative'
         }}>
      
      {/* Hidden components to generate content */}
      <div style={{ display: 'none' }}>
        <MemoryDescription 
          data={data} 
          onIngredientsGenerated={onPoeticIngredientsGenerated}
          onDescriptionGenerated={handleMemoryDescriptionGenerated}
        />
        <CookingRecipe 
          data={data}
          onTitleGenerated={onTitleGenerated}
          onRecipeGenerated={handleRecipeGenerated}
          poeticIngredients={poeticIngredients}
        />
      </div>

      {/* Conditionally render layout based on context */}
      {isPrintContext ? (
        <PrintOptimizedLayout
          recipeTitle={recipeTitle || "Memory Recipe"}
          memoryDescription={memoryDescription}
          cookingRecipe={cookingRecipe}
          shareableUrl={shareableUrl}
        />
      ) : (
        <ScreenOptimizedLayout
          recipeTitle={recipeTitle || "Memory Recipe"}
          memoryDescription={memoryDescription}
          cookingRecipe={cookingRecipe}
          shareableUrl={shareableUrl}
        />
      )}
    </div>
  );
};
