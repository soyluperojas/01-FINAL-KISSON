
import { INTENSITY_LIGHTING } from "./constants";

export function getIntensityLighting(intensity: string): string {
  return INTENSITY_LIGHTING[intensity.toLowerCase()] || "Balanced lighting showcasing the dumpling against pure black background";
}
