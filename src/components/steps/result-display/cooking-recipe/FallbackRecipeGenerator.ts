
import { RecipeData } from "@/components/RecipeWizard";

export const generateFallbackRecipe = (data: RecipeData, poeticIngredients: string[]) => {
  const emotion = data.emotionalIngredients?.[0] || "Nostalgic";
  const memory = data.writtenMemory || "a cherished moment";
  const spiceLevel = data.intensity || "medium";
  const dedication = data.dedication;
  
  // Create title without "Title:" prefix
  const baseTitle = `${emotion} Memory Dumplings`;
  const title = dedication ? `${baseTitle} (For ${dedication})` : baseTitle;

  // Get poetic ingredients or use defaults
  const ingredients = poeticIngredients.length > 0 
    ? poeticIngredients 
    : [
        "2 cups flour of forgotten dreams",
        "1 cup water of flowing time", 
        "1 tsp salt of preserved moments",
        "2 tbsp oil of golden memories"
      ];

  // Create intensity-based cooking notes
  const intensityNotes = {
    mild: "gentle simmer to preserve delicate memories",
    medium: "steady cooking to honor the moment", 
    spicy: "vigorous boiling to awaken passionate recollections"
  };

  const cookingStyle = intensityNotes[spiceLevel as keyof typeof intensityNotes] || intensityNotes.medium;

  // Generate recipe content without "Recipe:" prefix
  const recipe = `Ingredients:
${ingredients.map(ing => `• ${ing}`).join('\n')}

Instructions:
1. In a large mixing bowl, combine flour and salt. Slowly add water while mixing until a soft dough forms.

2. Knead the dough gently for 5-7 minutes, thinking of ${memory}. Let rest for 20 minutes.

3. Roll dough into small circles. Place a spoonful of your heart's filling in the center of each.

4. Fold and seal edges carefully, as if protecting the memory itself.

5. Cook using ${cookingStyle} for 12-15 minutes until they float with the lightness of remembrance.

6. Serve warm, allowing each bite to transport you back to that special moment.

Cooking Notes:
- Handle with care, as these dumplings carry more than just flavor
- Best enjoyed while sharing stories of the memory that inspired them
- The aroma alone should evoke the essence of ${memory}`;

  return { title, recipe };
};
