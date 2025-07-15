
export interface ImageGenerationOptions {
  prompt: string;
  shape?: string;
  ingredients?: string[];
  intensity?: string;
  recipeId?: string;
  timePeriod?: string;
}

export interface TimeStyle {
  [key: string]: string;
}

export interface ShapeDescription {
  [key: string]: string;
}

export interface LightingEffect {
  [key: string]: string;
}
