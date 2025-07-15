
import { PLACEHOLDER_IMAGES } from "./constants";

export function getPlaceholderImage(prompt: string): string {
  // Return empty string to let UI handle the error state properly
  // This prevents misleading placeholder images from showing
  console.log(`=== PLACEHOLDER SERVICE ===`);
  console.log(`Image generation failed for prompt: "${prompt}" - no placeholder used`);
  console.log(`Returning empty string to trigger error display`);
  return "";
}
