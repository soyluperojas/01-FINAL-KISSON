
import { WrappingRecipeContent } from "../recipe-card/WrappingRecipeContent";

interface RecipeContentProps {
  cookingRecipe: string;
  enableTextWrapping?: boolean;
}

export const RecipeContent = ({ cookingRecipe, enableTextWrapping = false }: RecipeContentProps) => {
  if (enableTextWrapping) {
    return (
      <div className="overflow-hidden bg-white recipe-content w-full h-full" 
           style={{
             fontSize: '6pt',
             lineHeight: '1.1',
             padding: '4px',
             wordWrap: 'break-word',
             overflowWrap: 'break-word',
             height: '100%',
             maxHeight: '100%'
           }}>
        <WrappingRecipeContent
          content={cookingRecipe || "Recipe in preparation..."}
          qrWidth={72} // ~1.0in at 72dpi
          qrHeight={86} // ~1.2in at 72dpi
          logoWidth={58} // ~0.8in at 72dpi
          logoHeight={58} // ~0.8in at 72dpi
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white recipe-content w-full h-full" 
         style={{
           fontSize: '6pt',
           lineHeight: '1.1',
           padding: '4px',
           wordWrap: 'break-word',
           overflowWrap: 'break-word',
           height: '100%',
           maxHeight: '100%'
         }}>
      <div style={{
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
        overflow: 'hidden',
        height: '100%'
      }}>
        {cookingRecipe || "Recipe in preparation..."}
      </div>
    </div>
  );
};
