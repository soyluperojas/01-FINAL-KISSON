
export function getIngredientVisualEffects(ingredients: string[]): string | null {
  const effects = [];
  
  for (const ingredient of ingredients.slice(0, 2)) { // Limit to 2 effects
    const effect = getIngredientEffect(ingredient);
    if (effect) effects.push(effect);
  }
  
  return effects.length > 0 ? effects.join('. ') : null;
}

export function getIngredientEffect(ingredient: string): string | null {
  const ingredient_lower = ingredient.toLowerCase();
  
  if (ingredient_lower.includes("herb")) return "Fresh herbs visible on the dumpling surface";
  if (ingredient_lower.includes("spice")) return "Aromatic spice dusting creating warm colors on the dumpling";
  if (ingredient_lower.includes("chocolate")) return "Rich chocolate elements creating dark, luxurious tones";
  if (ingredient_lower.includes("vegetable")) return "Colorful vegetable pieces visible in the dumpling";
  if (ingredient_lower.includes("protein")) return "High-quality protein creating rich textures";
  
  return null;
}
