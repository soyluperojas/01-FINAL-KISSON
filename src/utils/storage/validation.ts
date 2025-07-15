
import { ExtendedRecipeData } from "./types";

// Validate recipe data structure
export const isValidRecipeData = (recipe: any): recipe is ExtendedRecipeData => {
  if (!recipe || typeof recipe !== 'object') return false;
  
  // Check for required fields and reasonable data types
  const hasValidStructure = (
    typeof recipe.memoryType === 'string' || recipe.memoryType === undefined
  ) && (
    Array.isArray(recipe.emotionalIngredients) || recipe.emotionalIngredients === undefined
  );
  
  return hasValidStructure;
};

// Helper function to validate and clean image URLs
export const validateImageUrl = (imageUrl?: string | null): string | null => {
  if (!imageUrl || typeof imageUrl !== 'string') return null;
  
  const cleaned = imageUrl.trim();
  
  if (cleaned === 'undefined' || 
      cleaned === 'null' || 
      cleaned.length <= 10 ||
      (!cleaned.startsWith('http') && !cleaned.startsWith('//'))) {
    return null;
  }
  
  // Additional security check for URL
  try {
    const parsed = new URL(cleaned);
    // Only allow HTTP/HTTPS protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) return null;
    
    // Basic URL sanitization
    return cleaned.slice(0, 2048); // Reasonable URL length limit
  } catch {
    return null;
  }
};
