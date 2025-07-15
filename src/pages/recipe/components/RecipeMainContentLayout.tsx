
import { RecipeData } from "@/components/RecipeWizard";
import { CookingRecipe } from "@/components/steps/result-display/CookingRecipe";
import { RecipeImage } from "@/components/steps/result-display/RecipeImage";

interface ExtendedRecipeData extends RecipeData {
  generatedTitle?: string;
  generatedRecipe?: string;
  generatedIngredients?: string[];
  generatedDescription?: string;
  storedImageUrl?: string;
}

interface RecipeMainContentLayoutProps {
  recipeData: ExtendedRecipeData;
  qrCodeValue: string;
  id?: string;
  onTitleGenerated: (title: string) => void;
  onRecipeGenerated: (recipe: string) => void;
}

export const RecipeMainContentLayout = ({ 
  recipeData, 
  qrCodeValue, 
  id, 
  onTitleGenerated, 
  onRecipeGenerated 
}: RecipeMainContentLayoutProps) => {
  return (
    <div className="flex-1 grid grid-cols-2 gap-8 min-h-0">
      {/* Left Column - Recipe Image */}
      <div className="flex flex-col">
        <h3 className="text-xl font-semibold text-black mb-4 text-center">Recipe Inspiration</h3>
        <div className="flex-1 bg-gray-50 rounded-lg overflow-hidden">
          <RecipeImage 
            data={recipeData}
            recipeTitle={recipeData.generatedTitle || `${recipeData.emotionalIngredients?.[0] || "Memory"} Recipe`}
            qrCodeValue={qrCodeValue}
            recipeId={id}
          />
        </div>
      </div>
      
      {/* Right Column - Recipe Content */}
      <div className="flex flex-col">
        <h3 className="text-xl font-semibold text-black mb-4 text-center">Recipe Instructions</h3>
        <div className="flex-1 bg-gray-50 rounded-lg p-6 overflow-auto">
          <div className="text-sm leading-relaxed text-black">
            <CookingRecipe 
              data={recipeData}
              onTitleGenerated={onTitleGenerated}
              onRecipeGenerated={onRecipeGenerated}
              poeticIngredients={recipeData.generatedIngredients || []}
              preGeneratedRecipe={recipeData.generatedRecipe}
              preGeneratedTitle={recipeData.generatedTitle}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
