
import { RecipeData } from "@/components/RecipeWizard";
import { Card, CardContent } from "@/components/ui/card";
import { RecipeContentOptimized } from "./recipe-card/RecipeContentOptimized";

interface RecipeCardProps {
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

export const RecipeCard = ({
  data,
  recipeTitle,
  shareableUrl,
  recipeId,
  poeticIngredients,
  onTitleGenerated,
  onPoeticIngredientsGenerated,
  onCookingRecipeGenerated,
  onMemoryDescriptionGenerated
}: RecipeCardProps) => {
  return (
    <Card className="mx-auto print:!bg-white print:!border-none print:!shadow-none print:!outline-none" 
          style={{ 
            width: '4in', 
            height: '6in', 
            maxWidth: '4in', 
            maxHeight: '6in',
            minWidth: '4in',
            minHeight: '6in',
            background: 'white',
            backgroundColor: 'white',
            border: 'none',
            boxShadow: 'none',
            outline: 'none'
          }}>
      <CardContent className="p-2 h-full flex flex-col print:!bg-white print:!text-black print:!border-none print:!outline-none relative" 
                   id="recipe-print-area" 
                   style={{ 
                     fontSize: '7pt', 
                     lineHeight: '1.1',
                     overflow: 'hidden',
                     background: 'white',
                     backgroundColor: 'white',
                     color: 'black',
                     border: 'none',
                     outline: 'none'
                   }}>
        
        <RecipeContentOptimized
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
      </CardContent>
    </Card>
  );
};
