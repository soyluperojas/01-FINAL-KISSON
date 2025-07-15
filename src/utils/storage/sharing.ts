
import { ExtendedRecipeData } from "./types";
import { validateImageUrl } from "./validation";
import { storeRecipe } from "./recipeOperations";
import { SecurityAuditLogger } from "@/utils/securityAudit";

export const generateSimpleShareUrl = async (recipeData: ExtendedRecipeData, imageUrl?: string, recipeId?: string): Promise<string> => {
  const cleanImageUrl = validateImageUrl(imageUrl);
  
  console.log("generateSimpleShareUrl (Public Mode) - Original imageUrl:", imageUrl);
  console.log("generateSimpleShareUrl (Public Mode) - Cleaned imageUrl:", cleanImageUrl);
  
  // Use provided ID or generate new one, then store
  const id = await storeRecipe(recipeData, cleanImageUrl, recipeId);
  
  // Create simple URL with the ID
  const baseUrl = window.location.origin;
  const shareableUrl = `${baseUrl}/recipe/${id}`;
  
  console.log("Generated simple share URL (public mode):", shareableUrl);
  
  // Log the recipe sharing for audit
  await SecurityAuditLogger.logRecipeAction('share', id);
  
  return shareableUrl;
};
