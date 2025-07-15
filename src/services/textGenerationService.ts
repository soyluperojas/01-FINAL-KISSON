
import { supabase } from "@/integrations/supabase/client";

// Ingredient validation - reject any non-food items
const validateIngredients = (ingredients: string[]): string[] => {
  const nonFoodTerms = [
    'hope', 'love', 'joy', 'sadness', 'memory', 'nostalgia', 'warmth', 'comfort',
    'happiness', 'melancholy', 'wonder', 'curiosity', 'passion', 'serenity',
    'laughter', 'tears', 'dreams', 'wishes', 'soul', 'heart', 'spirit',
    'emotion', 'feeling', 'thought', 'mind', 'zest of', 'pinch of', 'essence of',
    'touch of', 'whisper of', 'breath of', 'hint of'
  ];
  
  return ingredients.filter(ingredient => {
    const lowerIngredient = ingredient.toLowerCase();
    return !nonFoodTerms.some(term => lowerIngredient.includes(term));
  });
};

// TextGenerationService handles generating EXPERIMENTAL and FUTURISTIC text content
export async function generateText(prompt: string): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('openai-proxy', {
      body: {
        endpoint: '/chat/completions',
        method: 'POST',
        body: {
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are a revolutionary molecular gastronomist who creates experimental recipes across different time periods.
              
              CRITICAL RULE: ALL ingredients must be real, measurable food items only. NO poetic ingredients like "pinch of hope" or "zest of curiosity".
              
              Your recipes are:
              1. Clear and direct with no markdown formatting
              2. Concise enough to fit on a single A4 page
              3. Complete with real ingredients and instructions
              4. Written in plain text format
              5. EXPERIMENTAL for future time periods, traditional for past periods
              6. Use ONLY real cooking ingredients with measurements
              
              TIME-PERIOD SPECIALIZATION:
              - DISTANT FUTURE: Use experimental proteins (lab-grown meat, insects, algae), molecular techniques
              - NEAR FUTURE: Sustainable proteins, fermented alternatives, precision methods
              - PRESENT: Modern techniques with traditional ingredients
              - PAST PERIODS: Traditional methods and heritage ingredients
              
              CRITICAL: Transform emotional concepts into cooking techniques and presentations, NOT ingredients.
              Use emotions for storytelling in descriptions, never as recipe components.`,
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.4,
          max_tokens: 750,
        }
      }
    });
    
    if (error) {
      throw new Error(error.message || "Error generating text");
    }
    
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Text generation error:", error);
    throw error;
  }
}

// ENHANCED COMPREHENSIVE PROMPT SYSTEM - WITH STRICT INGREDIENT VALIDATION
export async function generateCompatibleText(
  prompt: string, 
  ingredients: string[],
  userPreferences?: any,
  conversationContext?: string,
  flavorProfile?: string,
  serveTime?: string,
  timeDescription?: string
): Promise<string> {
  console.log("=== ENHANCED SYSTEM WITH INGREDIENT VALIDATION ===");
  console.log("Raw ingredients before validation:", ingredients);
  
  // CRITICAL: Validate and filter out any non-food ingredients
  const validatedIngredients = validateIngredients(ingredients);
  console.log("✅ VALIDATED REAL FOOD INGREDIENTS ONLY:", validatedIngredients);
  
  if (validatedIngredients.length !== ingredients.length) {
    console.log("🚫 REMOVED non-food ingredients:", 
      ingredients.filter(ing => !validatedIngredients.includes(ing))
    );
  }
  
  // Enhanced prompt with strict ingredient validation
  let comprehensivePrompt = `
  EXPERIMENTAL RECIPE SYSTEM: USER CHOSE ${(flavorProfile || 'balanced').toUpperCase()} FLAVOR FOR ${(serveTime || 'present').toUpperCase()} TIME PERIOD!
  
  CRITICAL RULES:
  1. ALL ingredients must be real, measurable food items ONLY
  2. NO poetic ingredients like "pinch of hope" or "zest of curiosity"
  3. Use emotions for storytelling and technique inspiration ONLY
  4. Transform emotional concepts into cooking methods, not ingredients
  
  TIME PERIOD: ${timeDescription || 'Contemporary cooking with modern techniques'}
  
  VALIDATED REAL INGREDIENTS TO USE:
  ${validatedIngredients.map(ing => `- ${ing} (real food ingredient)`).join('\n')}
  
  FLAVOR PROFILE: ${flavorProfile || 'balanced'}
  TIME PERIOD APPROACH: ${serveTime || 'present'}
  
  ${serveTime === 'distant future' ? 'EXPERIMENTAL APPROACH: Use molecular gastronomy, lab-grown proteins, and futuristic techniques' : ''}
  ${serveTime === 'near future' ? 'SUSTAINABLE APPROACH: Focus on eco-friendly proteins and precision fermentation' : ''}
  ${serveTime === 'present' ? 'MODERN APPROACH: Balance traditional techniques with contemporary methods' : ''}
  ${serveTime?.includes('past') ? 'TRADITIONAL APPROACH: Use heritage techniques and classic preparations' : ''}
  
  USER CONTEXT:
  ${conversationContext ? `User shared: "${conversationContext}"` : ''}
  ${userPreferences?.mentionedIngredients?.length ? `User mentioned: ${userPreferences.mentionedIngredients.join(', ')}` : ''}
  
  Create a ${flavorProfile || 'balanced'} dumpling recipe using ONLY the validated real ingredients.
  Apply ${serveTime || 'present'} time-period techniques.
  Use emotions for storytelling in the description, NOT as ingredients.
  
  Requirements:
  1. Creative title reflecting the time period and approach
  2. Complete ingredients list with measurements (real food only)
  3. Clear instructions using time-appropriate techniques
  4. Brief description that tells the emotional story through cooking methods
  5. NO poetic or emotional ingredients in the recipe itself
  `;
  
  return generateText(comprehensivePrompt);
}
