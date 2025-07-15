
import { RecipeData } from "@/components/RecipeWizard";
import { MemoryDescription } from "@/components/steps/result-display/MemoryDescription";

interface ExtendedRecipeData extends RecipeData {
  generatedTitle?: string;
  generatedRecipe?: string;
  generatedIngredients?: string[];
  generatedDescription?: string;
  storedImageUrl?: string;
}

interface RecipeDescriptionSectionProps {
  recipeData: ExtendedRecipeData;
  onIngredientsGenerated: (ingredients: string[]) => void;
  onDescriptionGenerated: (description: string) => void;
}

export const RecipeDescriptionSection = ({ 
  recipeData, 
  onIngredientsGenerated, 
  onDescriptionGenerated 
}: RecipeDescriptionSectionProps) => {
  return (
    <div className="text-center">
      <div className="text-lg italic text-gray-700 leading-relaxed max-w-3xl mx-auto">
        <MemoryDescription 
          data={recipeData} 
          onIngredientsGenerated={onIngredientsGenerated}
          onDescriptionGenerated={onDescriptionGenerated}
          preGeneratedIngredients={recipeData.generatedIngredients}
        />
      </div>
    </div>
  );
};
