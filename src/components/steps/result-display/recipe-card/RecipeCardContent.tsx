
import { RecipeData } from "@/components/RecipeWizard";
import { RecipeTitle } from "../RecipeTitle";
import { MemoryDescription } from "../MemoryDescription";
import { CookingRecipe } from "../CookingRecipe";
import { RecipeImage } from "../RecipeImage";
import { QRCodeSection } from "./QRCodeSection";

interface RecipeCardContentProps {
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

export const RecipeCardContent = ({
  data,
  recipeTitle,
  shareableUrl,
  recipeId,
  poeticIngredients,
  onTitleGenerated,
  onPoeticIngredientsGenerated,
  onCookingRecipeGenerated,
  onMemoryDescriptionGenerated
}: RecipeCardContentProps) => {
  return (
    <>
      {/* Title Section - Compact */}
      <div className="recipe-title text-center mb-1 flex-shrink-0 print:bg-white print:text-black" 
           style={{ maxHeight: '0.3in' }}>
        <h1 className="text-sm font-bold text-white print:text-black print:bg-white" 
            style={{ 
              fontSize: '8pt', 
              lineHeight: '1.0',
              margin: '0',
              padding: '1px 0',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
          {recipeTitle || "Memory Dumplings"}
        </h1>
      </div>
      
      {/* Memory Description - More Compact */}
      <div className="memory-description mb-2 flex-shrink-0 text-white print:text-black print:bg-white" 
           style={{ 
             maxHeight: '0.4in', 
             overflow: 'hidden',
             fontSize: '5pt',
             lineHeight: '1.0'
           }}>
        <MemoryDescription 
          data={data} 
          onIngredientsGenerated={onPoeticIngredientsGenerated}
          onDescriptionGenerated={onMemoryDescriptionGenerated}
        />
      </div>

      {/* Main Content Layout - Adjusted proportions */}
      <div className="flex-1 flex gap-1 min-h-0 print:bg-white" 
           style={{ height: 'calc(6in - 0.9in)' }}>
        
        {/* Left Column - Recipe Content (Takes 60% of width) */}
        <div className="recipe-content-column flex-shrink-0 print:bg-white" 
             style={{ 
               width: '2.2in',
               maxWidth: '2.2in',
               overflow: 'hidden'
             }}>
          <div className="recipe-content h-full overflow-hidden text-white print:text-black print:bg-white print:border-none" 
               style={{ 
                 fontSize: '5pt', 
                 lineHeight: '1.0',
                 padding: '2px',
                 background: 'black',
                 border: '1px solid white'
               }}>
            <CookingRecipe 
              data={data}
              onTitleGenerated={onTitleGenerated}
              onRecipeGenerated={onCookingRecipeGenerated}
              poeticIngredients={poeticIngredients}
            />
          </div>
        </div>
        
        {/* Right Column - QR Code and Image (Takes 40% of width) */}
        <div className="qr-column flex-1 flex flex-col gap-1 print:bg-white">
          <QRCodeSection shareableUrl={shareableUrl} />
          
          {/* Recipe Image Section - Properly sized to fill remaining space */}
          <div className="flex-1 min-h-0 print:bg-white" style={{ minHeight: '4.0in' }}>
            <div style={{ 
                   width: '100%', 
                   height: '100%',
                   overflow: 'hidden'
                 }}>
              <RecipeImage 
                data={data}
                recipeTitle={recipeTitle || `${data.emotionalIngredients?.[0] || "Memory"} Recipe`}
                qrCodeValue={shareableUrl}
                recipeId={recipeId}
                poeticIngredients={poeticIngredients}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
