
import { useParams, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { RecipeData } from "@/components/RecipeWizard";
import { PrintStyles } from "@/components/steps/result-display/PrintStyles";
import { getRecipeWithFallback } from "@/utils/recipeStorage";
import { RecipeHeader } from "./recipe/RecipeHeader";
import { RecipeContent } from "./recipe/RecipeContent";
import { RecipeFooter } from "./recipe/RecipeFooter";
import { RecipeLoading } from "./recipe/RecipeLoading";
import { RecipeNotFound } from "./recipe/RecipeNotFound";

interface ExtendedRecipeData extends RecipeData {
  generatedTitle?: string;
  generatedRecipe?: string;
  generatedIngredients?: string[];
  generatedDescription?: string;
  storedImageUrl?: string;
}

const Recipe = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [recipeData, setRecipeData] = useState<ExtendedRecipeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    console.log("=== SHARED RECIPE PAGE DEBUG ===");
    console.log("Recipe ID from URL:", id);
    console.log("Current URL:", window.location.href);
    
    if (!id) {
      setError("No recipe ID found in URL");
      setIsLoading(false);
      return;
    }

    const loadRecipe = async () => {
      try {
        const encodedData = searchParams.get('data');
        console.log("Encoded data from URL:", encodedData ? "present" : "not present");
        
        const parsedData = await getRecipeWithFallback(id, encodedData || undefined);
        
        if (!parsedData) {
          setError("Recipe not found or expired");
          setIsLoading(false);
          return;
        }
        
        console.log("Loaded recipe data:", parsedData);
        
        setRecipeData(parsedData);
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading recipe:", err);
        setError("Failed to load recipe");
        setIsLoading(false);
      }
    };

    loadRecipe();
  }, [id, searchParams]);

  if (isLoading) {
    return <RecipeLoading />;
  }

  if (error || !recipeData) {
    return <RecipeNotFound error={error} />;
  }

  const qrCodeValue = window.location.href;

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8 min-h-screen bg-black text-white">
      <PrintStyles />
      <RecipeHeader />
      <RecipeContent 
        recipeData={recipeData} 
        qrCodeValue={qrCodeValue} 
        id={id} 
      />
      <RecipeFooter />
    </div>
  );
};

export default Recipe;
