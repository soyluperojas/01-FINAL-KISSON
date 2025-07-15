
import { RecipeData } from "@/components/RecipeWizard";
import { useRef } from "react";
import { A4SketchLayout } from "./a4-components/A4SketchLayout";

interface ExtendedRecipeData extends RecipeData {
  generatedTitle?: string;
  generatedRecipe?: string;
  generatedIngredients?: string[];
  generatedDescription?: string;
  storedImageUrl?: string;
}

interface A4CookbookPrintProps {
  recipeData: ExtendedRecipeData;
  shareableUrl: string;
  recipeTitle: string;
  cookingRecipe: string;
  memoryDescription: string;
  imageUrl?: string;
}

export const A4CookbookPrint = ({ 
  recipeData, 
  shareableUrl, 
  recipeTitle, 
  cookingRecipe, 
  memoryDescription, 
  imageUrl 
}: A4CookbookPrintProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef}>
      <A4SketchLayout
        recipeData={recipeData}
        shareableUrl={shareableUrl}
        recipeTitle={recipeTitle}
        cookingRecipe={cookingRecipe}
        memoryDescription={memoryDescription}
        imageUrl={imageUrl}
      />
      
      {/* Mobile Responsive and Print Styles */}
      <style>
        {`
          @media screen and (max-width: 768px) {
            .a4-cookbook-print {
              width: 100vw !important;
              height: auto !important;
              min-height: 100vh !important;
              padding: 15mm !important;
            }
          }
          
          @media print {
            @page {
              size: A4 portrait;
              margin: 0;
            }
            
            .a4-cookbook-print {
              width: 210mm !important;
              height: 297mm !important;
              margin: 0 !important;
              padding: 20mm !important;
            }
          }
        `}
      </style>
    </div>
  );
};
