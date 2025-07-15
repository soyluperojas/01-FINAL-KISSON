import { RecipeData } from "@/components/RecipeWizard";
import { ThermalLabelPrint } from "./print/ThermalLabelPrint";
// import { A4CookbookPrint } from "./print/A4CookbookPrint"; // ← ya no se necesita

interface ExtendedRecipeData extends RecipeData {
  generatedTitle?: string;
  generatedRecipe?: string;
  generatedIngredients?: string[];
  generatedDescription?: string;
  storedImageUrl?: string;
}

interface PrintPreviewLayoutProps {
  extendedData: ExtendedRecipeData;
  shareableUrl: string;
  recipeTitle: string;
  cookingRecipe: string;
  memoryDescription: string;
  imageUrl: string;
  selectedVideoName?: string;
}

export const PrintPreviewLayout = ({
  extendedData,
  shareableUrl,
  recipeTitle,
  cookingRecipe,
  memoryDescription,
  imageUrl,
  selectedVideoName
}: PrintPreviewLayoutProps) => {
  const derivedImageUrl = selectedVideoName
    ? `/images/${selectedVideoName.replace(".mp4", ".png")}`
    : imageUrl;

  return (
    <div className="flex justify-center no-print">
      
      {/* Thermal Label Preview */}
      <div className="print-preview-container">
        <h3 className="text-white text-lg font-bold mb-4 text-center">Thermal Label Preview</h3>
        <div className="border-2 border-white/20 rounded-lg p-2 bg-white/10">
          <ThermalLabelPrint 
            recipeData={extendedData}
            shareableUrl={shareableUrl}
            recipeTitle={recipeTitle}
          />
        </div>
      </div>

    </div>
  );
};
