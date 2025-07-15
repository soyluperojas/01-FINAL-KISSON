
import { Card, CardContent } from "@/components/ui/card";
import { RecipeData } from "@/components/RecipeWizard";
import { A4SketchLayout } from "@/components/steps/result-display/print/a4-components/A4SketchLayout";

interface ExtendedRecipeData extends RecipeData {
  generatedTitle?: string;
  generatedRecipe?: string;
  generatedIngredients?: string[];
  generatedDescription?: string;
  storedImageUrl?: string;
}

interface RecipeContentProps {
  recipeData: ExtendedRecipeData;
  qrCodeValue: string;
  id?: string;
}

export const RecipeContent = ({ recipeData, qrCodeValue, id }: RecipeContentProps) => {
  const displayTitle = recipeData.generatedTitle || `${recipeData.emotionalIngredients?.[0] || "Memory"} Recipe`;
  
  return (
    <div className="recipe-card-container max-w-5xl mx-auto">
      <A4SketchLayout
        recipeData={recipeData}
        shareableUrl={qrCodeValue}
        recipeTitle={displayTitle}
        cookingRecipe={recipeData.generatedRecipe || ""}
        memoryDescription={recipeData.generatedDescription || ""}
        imageUrl={recipeData.storedImageUrl}
      />
    </div>
  );
};
