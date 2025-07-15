
import { RecipeData } from "@/components/RecipeWizard";
import { ImageErrorDisplay } from "./ImageErrorDisplay";
import { ImageDisplay } from "./ImageDisplay";
import { useImageGeneration } from "./hooks/useImageGeneration";

interface RecipeImageProps {
  data: RecipeData & { storedImageUrl?: string };
  recipeTitle: string;
  qrCodeValue: string;
  recipeId?: string;
  poeticIngredients?: string[];
  onImageGenerated?: (imageUrl: string) => void;
}

export const RecipeImage = ({ 
  data, 
  recipeTitle, 
  qrCodeValue, 
  recipeId, 
  poeticIngredients, 
  onImageGenerated 
}: RecipeImageProps) => {
  const {
    imageUrl,
    hasValidImage,
    showApiError,
    isGenerating,
    errorMessage,
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
    <div className="space-y-1 h-full">
      {/* Show square loading state while generating - MATCHES IMAGE CONTAINER */}
      {isGenerating && (
        <div className="w-full bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center relative"
             style={{ 
               aspectRatio: '1/1',
               minHeight: '0',
               maxWidth: '100%',
               background: 'linear-gradient(135deg, #fef7ed 0%, #fed7aa 100%)'
             }}>
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Force a perfect square container for the loading animation */}
            <div className="flex flex-col items-center justify-center"
                 style={{ 
                   width: '60px', 
                   height: '60px',
                   maxWidth: '60px',
                   maxHeight: '60px'
                 }}>
              {/* Exactly 12x12 pixel spinning icon */}
              <div className="mb-1" style={{ width: '12px', height: '12px' }}>
                <div className="w-full h-full rounded-full border border-orange-500 border-t-transparent animate-spin"></div>
              </div>
              
              {/* Minimal text */}
              <p className="text-center text-gray-600" 
                 style={{ fontSize: '3pt', lineHeight: '1.0', margin: '0', padding: '0' }}>
                Generating...
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Show single image when ready */}
      {!isGenerating && hasValidImage && imageUrl && (
        <ImageDisplay
          imageUrl={imageUrl}
          recipeTitle={recipeTitle}
          onImageLoad={handleImageLoad}
          onImageError={handleImageError}
        />
      )}
      
      {/* Show API error message if needed */}
      {!isGenerating && !hasValidImage && (
        <div className="w-full bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center"
             style={{ aspectRatio: '1/1', minHeight: '0' }}>
          <ImageErrorDisplay 
            showApiError={showApiError} 
            errorMessage={errorMessage}
          />
        </div>
      )}
    </div>
  );
};
