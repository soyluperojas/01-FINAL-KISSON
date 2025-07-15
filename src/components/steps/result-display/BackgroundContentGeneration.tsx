
import { RecipeData } from "@/components/RecipeWizard";
import { RecipeCard } from "./RecipeCard";
import { ImageDisplayBox } from "./ImageDisplayBox";

interface BackgroundContentGenerationProps {
  data: RecipeData;
  recipeTitle: string;
  shareableUrl: string;
  recipeId: string;
  poeticIngredients: string[];
  onTitleGenerated: (title: string) => void;
  onPoeticIngredientsGenerated: (ingredients: string[]) => void;
  onCookingRecipeGenerated: (recipe: string) => void;
  onMemoryDescriptionGenerated: (description: string) => void;
  onImageGenerated: (imageUrl: string) => void;
}

export const BackgroundContentGeneration = ({
  data,
  recipeTitle,
  shareableUrl,
  recipeId,
  poeticIngredients,
  onTitleGenerated,
  onPoeticIngredientsGenerated,
  onCookingRecipeGenerated,
  onMemoryDescriptionGenerated,
  onImageGenerated
}: BackgroundContentGenerationProps) => {
  return (
    <div style={{ display: 'none' }}>
      <RecipeCard 
        data={data} 
        recipeTitle={recipeTitle} 
        shareableUrl={shareableUrl} 
        recipeId={recipeId} 
        poeticIngredients={poeticIngredients} 
        onTitleGenerated={onTitleGenerated} 
        onPoeticIngredientsGenerated={onPoeticIngredientsGenerated} 
        onCookingRecipeGenerated={onCookingRecipeGenerated} 
        onMemoryDescriptionGenerated={onMemoryDescriptionGenerated} 
      />
      <ImageDisplayBox 
        data={data}
        recipeTitle={recipeTitle}
        recipeId={recipeId}
        poeticIngredients={poeticIngredients}
        onImageGenerated={onImageGenerated}
      />
    </div>
  );
};
