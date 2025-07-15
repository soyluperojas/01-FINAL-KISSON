
import { RecipeData } from "@/components/RecipeWizard";
import { A4SketchHeader } from "./A4SketchHeader";
import { A4SketchImage } from "./A4SketchImage";
import { A4SketchIngredients } from "./A4SketchIngredients";
import { A4SketchInstructions } from "./A4SketchInstructions";
import { A4SketchFooter } from "./A4SketchFooter";

interface ExtendedRecipeData extends RecipeData {
  generatedTitle?: string;
  generatedRecipe?: string;
  generatedIngredients?: string[];
  generatedDescription?: string;
  storedImageUrl?: string;
}

interface A4SketchLayoutProps {
  recipeData: ExtendedRecipeData;
  shareableUrl: string;
  recipeTitle: string;
  cookingRecipe: string;
  memoryDescription: string;
  imageUrl?: string;
}

export const A4SketchLayout = ({ 
  recipeData, 
  shareableUrl, 
  recipeTitle, 
  cookingRecipe, 
  memoryDescription, 
  imageUrl 
}: A4SketchLayoutProps) => {
  const displayTitle = recipeTitle || recipeData.generatedTitle || `${recipeData.emotionalIngredients?.[0] || "Memory"} Recipe`;
  const finalImageUrl = imageUrl || recipeData.storedImageUrl || "https://images.unsplash.com/photo-1500673922987-e212871fec22";

  // Parse ingredients from the cooking recipe or use emotional ingredients as fallback
  const getIngredients = (): string[] => {
    if (recipeData.generatedIngredients && Array.isArray(recipeData.generatedIngredients)) {
      return recipeData.generatedIngredients;
    }
    
    if (cookingRecipe.includes("Ingredients:")) {
      const parsedIngredients = cookingRecipe.split("Ingredients:")[1]?.split("Instructions:")[0]?.split('\n').filter(line => line.trim()) || [];
      return parsedIngredients;
    }
    
    return recipeData.emotionalIngredients || [];
  };

  const ingredients = getIngredients();

  // Extract instructions from cooking recipe
  const instructions = cookingRecipe.includes("Instructions:") 
    ? cookingRecipe.split("Instructions:")[1] || cookingRecipe
    : cookingRecipe;

  return (
    <div 
      id="a4-print-area"
      className="a4-cookbook-print"
      style={{
        width: '210mm',
        height: '297mm',
        backgroundColor: 'white',
        color: 'black',
        fontFamily: "'Courier Prime', 'Courier New', monospace",
        fontSize: '10pt',
        lineHeight: '1.3',
        margin: '0',
        padding: '12mm',
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <A4SketchHeader 
        title={displayTitle}
        description={memoryDescription}
      />

      {/* Main Content - Two Columns with better spacing */}
      <div style={{
        display: 'flex',
        gap: '12mm',
        flex: '1',
        marginBottom: '18mm',
        minHeight: '0'
      }}>
        
        {/* Left Column - Image and Ingredients */}
        <div style={{
          width: '75mm',
          display: 'flex',
          flexDirection: 'column',
          gap: '6mm'
        }}>
          <A4SketchImage imageUrl={finalImageUrl} />
          <A4SketchIngredients ingredients={ingredients} />
        </div>

        {/* Right Column - Instructions */}
        <div style={{
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '0'
        }}>
          <A4SketchInstructions instructions={instructions} />
        </div>
      </div>

      <A4SketchFooter shareableUrl={shareableUrl} />
    </div>
  );
};
