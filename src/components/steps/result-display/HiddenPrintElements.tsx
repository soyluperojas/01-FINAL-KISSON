
import { RecipeData } from "@/components/RecipeWizard";
import { ThermalLabelPrint } from "./print/ThermalLabelPrint";
import { A4CookbookPrint } from "./print/A4CookbookPrint";

interface ExtendedRecipeData extends RecipeData {
  generatedTitle?: string;
  generatedRecipe?: string;
  generatedIngredients?: string[];
  generatedDescription?: string;
  storedImageUrl?: string;
}

interface HiddenPrintElementsProps {
  extendedData: ExtendedRecipeData;
  shareableUrl: string;
  recipeTitle: string;
  cookingRecipe: string;
  memoryDescription: string;
  imageUrl: string;
}

export const HiddenPrintElements = ({
  extendedData,
  shareableUrl,
  recipeTitle,
  cookingRecipe,
  memoryDescription,
  imageUrl
}: HiddenPrintElementsProps) => {
  return (
    <div style={{ display: 'none' }}>
      <div id="thermal-print-area">
        <ThermalLabelPrint 
          recipeData={extendedData}
          shareableUrl={shareableUrl}
          recipeTitle={recipeTitle}
        />
      </div>
      <div id="a4-print-area">
        <A4CookbookPrint 
          recipeData={extendedData}
          shareableUrl={shareableUrl}
          recipeTitle={recipeTitle}
          cookingRecipe={cookingRecipe}
          memoryDescription={memoryDescription}
          imageUrl={imageUrl}
        />
      </div>
    </div>
  );
};
