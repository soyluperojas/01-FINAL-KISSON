
import { supabase } from "@/integrations/supabase/client";
import { SecurityAuditLogger } from "@/utils/securityAudit";
import { InputSanitizer } from "@/utils/inputSanitizer";
import { ExtendedRecipeData } from "./types";
import { validateImageUrl } from "./validation";
import { getStoredRecipes, saveRecipesToStorage } from "./localStorage";

export const generateRecipeId = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const storeRecipe = async (recipeData: ExtendedRecipeData, imageUrl?: string, providedId?: string): Promise<string> => {
  const id = providedId || generateRecipeId();
  console.log("=== STORE RECIPE DEBUG (PUBLIC MODE) ===");
  console.log("Storing recipe with ID:", id);
  console.log("Raw image URL:", imageUrl);
  
  // Sanitize recipe data
  const sanitizedRecipeData = InputSanitizer.sanitizeRecipeData(recipeData);
  
  // Validate and clean the image URL
  const cleanImageUrl = validateImageUrl(imageUrl);
  console.log("Cleaned image URL:", cleanImageUrl);
  
  try {
    // For public mode, we primarily use localStorage but can still try database for read-only recipes
    console.log("Public mode: storing in localStorage");
    const recipes = getStoredRecipes();
    if (cleanImageUrl) {
      sanitizedRecipeData.storedImageUrl = cleanImageUrl;
    }
    recipes.set(id, sanitizedRecipeData);
    saveRecipesToStorage(recipes);
    console.log("Stored recipe in localStorage (public mode)");
    
    // Log the action for audit
    await SecurityAuditLogger.logRecipeAction('create', id);
  } catch (error) {
    console.error("Error with storage operation:", error);
    // Still try to save to localStorage as fallback
    const recipes = getStoredRecipes();
    if (cleanImageUrl) {
      sanitizedRecipeData.storedImageUrl = cleanImageUrl;
    }
    recipes.set(id, sanitizedRecipeData);
    saveRecipesToStorage(recipes);
    console.log("Stored recipe in localStorage as fallback");
  }
  
  return id;
};

export const getRecipe = async (id: string): Promise<ExtendedRecipeData | null> => {
  console.log("=== GET RECIPE DEBUG (PUBLIC MODE) ===");
  console.log("Retrieving recipe with ID:", id);
  
  // Validate ID format to prevent injection
  if (!id || typeof id !== 'string' || id.length > 100) {
    console.error("Invalid recipe ID format");
    return null;
  }
  
  try {
    // First try localStorage for public mode
    const recipes = getStoredRecipes();
    const localRecipe = recipes.get(id);
    if (localRecipe) {
      console.log("Retrieved recipe from localStorage (public mode)");
      await SecurityAuditLogger.logRecipeAction('view', id);
      return localRecipe;
    }

    // Try to get from database for shared recipes (public read access)
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single();

    if (!error && data) {
      console.log("Retrieved shared recipe from database");
      console.log("Image URL from database:", data.image_url);
      
      const recipeData = data.recipe_data as unknown as ExtendedRecipeData;
      
      // Set the stored image URL from the database
      if (data.image_url) {
        recipeData.storedImageUrl = data.image_url;
      }
      
      // Sanitize data from database
      const sanitizedRecipe = InputSanitizer.sanitizeRecipeData(recipeData);
      
      // Log recipe view for audit
      await SecurityAuditLogger.logRecipeAction('view', id);
      
      return sanitizedRecipe;
    } else {
      console.log("Recipe not found:", error?.message);
    }
  } catch (error) {
    console.error("Error retrieving recipe:", error);
  }

  return null;
};

export const updateRecipeImage = async (id: string, imageUrl: string): Promise<boolean> => {
  console.log("=== UPDATE RECIPE IMAGE DEBUG (PUBLIC MODE) ===");
  console.log("Updating recipe image for ID:", id);
  console.log("New image URL:", imageUrl);
  
  const cleanImageUrl = validateImageUrl(imageUrl);
  
  if (!cleanImageUrl) {
    console.error("Invalid image URL provided for update:", imageUrl);
    return false;
  }
  
  try {
    // For public mode, update localStorage
    const recipes = getStoredRecipes();
    const recipe = recipes.get(id);
    if (recipe) {
      recipe.storedImageUrl = cleanImageUrl;
      recipes.set(id, recipe);
      saveRecipesToStorage(recipes);
      console.log("Updated recipe image in localStorage (public mode)");
      await SecurityAuditLogger.logRecipeAction('update', id);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error updating recipe image:", error);
    return false;
  }
};

export const getRecipeWithFallback = async (id: string, encodedData?: string): Promise<ExtendedRecipeData | null> => {
  // Try to get from storage first
  let recipe = await getRecipe(id);
  
  if (!recipe && encodedData) {
    console.log("Recipe not found in storage, trying URL fallback data");
    try {
      const jsonString = decodeURIComponent(escape(atob(encodedData)));
      const rawRecipe = JSON.parse(jsonString);
      
      // Sanitize the decoded recipe
      recipe = InputSanitizer.sanitizeRecipeData(rawRecipe);
      console.log("Successfully decoded and sanitized recipe from URL");
      
      // Store it for future use in localStorage
      if (recipe) {
        try {
          const recipes = getStoredRecipes();
          recipes.set(id, recipe);
          saveRecipesToStorage(recipes);
          console.log("Stored decoded recipe in localStorage (public mode)");
          await SecurityAuditLogger.logRecipeAction('create', id);
        } catch (error) {
          console.error("Failed to store decoded recipe:", error);
        }
      }
    } catch (error) {
      console.error("Failed to decode recipe from URL:", error);
    }
  }
  
  return recipe;
};
