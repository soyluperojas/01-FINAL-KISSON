
import { TIME_STYLES } from "./constants";
import { getShapeDescription } from "./shapeUtils";
import { getIngredientVisualEffects } from "./ingredientEffects";
import { getIntensityLighting } from "./lightingUtils";

export function generateHologramPrompt(
  timePeriod: string, 
  basePrompt: string, 
  shape?: string, 
  ingredients?: string[], 
  intensity?: string
): string {
  let prompt = `HOLOGRAM DISPLAY FOOD PHOTOGRAPHY: Professional dumpling photograph on SOLID PURE BLACK BACKGROUND (#000000). CRITICAL: The background must be completely black with no textures, patterns, or variations - pure solid black for hologram fan display. The dumpling should be beautifully lit and floating against this pure black void.`;
  
  // Add time period styling while maintaining black background
  prompt += ` ${TIME_STYLES[timePeriod] || TIME_STYLES["present"]}`;
  
  // Add shape information if provided
  if (shape) {
    const shapeDescription = getShapeDescription(shape);
    prompt += ` The dumpling has ${shapeDescription}.`;
  }
  
  // Add ingredient-based visual elements
  if (ingredients && ingredients.length > 0) {
    const colorEffects = getIngredientVisualEffects(ingredients);
    if (colorEffects) {
      prompt += ` ${colorEffects}`;
    }
  }
  
  // Add intensity-based lighting while maintaining black background
  if (intensity) {
    const lightingEffects = getIntensityLighting(intensity);
    prompt += ` ${lightingEffects}`;
  }
  
  // MANDATORY black background requirement
  prompt += ` MANDATORY: The background must be completely solid black (#000000) with no textures, surfaces, or patterns. The dumpling should appear to float in pure black space, perfect for hologram fan display. Professional food photography with the dumpling as the only visible element against pure black void.`;

  return prompt;
}
