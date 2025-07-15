import { Card, CardContent } from "@/components/ui/card";
import { RecipeData } from "@/components/RecipeWizard";
import { RecipeImage } from "./RecipeImage";
import { useImageGeneration } from "./hooks/useImageGeneration";

interface ImageDisplayBoxProps {
  data: RecipeData;
  recipeTitle: string;
  recipeId?: string;
  poeticIngredients?: string[];
  onImageGenerated?: (imageUrl: string) => void;
}

export const ImageDisplayBox = ({ 
  data, 
  recipeTitle, 
  recipeId, 
  poeticIngredients,
  onImageGenerated 
}: ImageDisplayBoxProps) => {
  const {
    imageUrl,
    hasValidImage,
    showApiError,
    isGenerating,
    handleImageError,
    handleImageLoad
  } = useImageGeneration({
    data,
    recipeTitle,
    recipeId,
    poeticIngredients,
    onImageGenerated
  });

  return (
    <div className="image-display-box no-print">
      <Card className="bg-white border border-gray-200 shadow-lg" 
            style={{ 
              width: '4in', 
              height: '6in', 
              maxWidth: '4in', 
              maxHeight: '6in',
              minWidth: '4in',
              minHeight: '6in'
            }}>
        <CardContent className="p-3 h-full flex flex-col">
          {/* Title and Logo Header */}
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-bold text-black flex-1 mr-3 leading-tight break-words hyphens-auto">
              {recipeTitle || `${data.emotionalIngredients?.[0] || "Memory"} Recipe`}
            </h3>
            <div className="w-16 h-16 flex-shrink-0">
              <img 
                src="/lovable-uploads/7d0c86e8-de4d-46a1-ab91-4fb74602093c.png"
                alt="KissOn Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          
          {/* Generated Image - Takes remaining space */}
          <div className="flex-1 min-h-0 bg-gray-50 rounded-lg overflow-hidden">
            <RecipeImage 
              data={data}
              recipeTitle={recipeTitle || `${data.emotionalIngredients?.[0] || "Memory"} Recipe`}
              qrCodeValue=""
              recipeId={recipeId}
              poeticIngredients={poeticIngredients}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
