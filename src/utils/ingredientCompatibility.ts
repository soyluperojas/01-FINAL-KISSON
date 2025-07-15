
// Ingredient compatibility system - now fully permissive to allow creative combinations

export interface IngredientCompatibility {
  sweetCondiments: string[];
  savoryCondiments: string[];
  sweetIngredients: string[];
  savoryIngredients: string[];
  neutralIngredients: string[];
}

// Define ingredient categories for reference only
export const ingredientCategories: IngredientCompatibility = {
  sweetCondiments: [
    'maple syrup', 'honey', 'chocolate', 'milk chocolate', 'dark chocolate', 'white chocolate',
    'bittersweet chocolate', 'cocoa', 'cocoa powder', 'vanilla', 'cinnamon', 'nutmeg', 
    'brown sugar', 'caramel', 'molasses', 'agave', 'coconut sugar',
    'powdered sugar', 'stevia', 'fruit jam', 'marmalade', 'berry sauce', 'sugar', 'icing sugar',
    'condensed milk', 'sweetened condensed milk', 'marshmallow', 'frosting', 'candy'
  ],
  
  savoryCondiments: [
    'salt', 'pepper', 'garlic', 'onion powder', 'paprika', 'cumin',
    'oregano', 'thyme', 'rosemary', 'basil', 'sage', 'bay leaves',
    'soy sauce', 'worcestershire sauce', 'hot sauce', 'vinegar',
    'mustard', 'horseradish', 'ginger', 'turmeric', 'curry powder',
    'chili powder', 'cayenne', 'black pepper', 'white pepper',
    'garlic powder', 'onion salt', 'celery salt', 'parsley',
    'dill', 'chives', 'scallions', 'shallots', 'fish sauce', 'anchovy paste',
    'tomato paste', 'miso', 'tahini', 'sesame oil', 'chili oil'
  ],
  
  sweetIngredients: [
    'strawberry', 'blueberry', 'raspberry', 'blackberry', 'peach', 'plum', 
    'apricot', 'cherry', 'grape', 'orange', 'lemon', 'lime', 'pineapple', 
    'mango', 'dates', 'figs', 'raisins', 'cranberries', 'banana'
  ],
  
  savoryIngredients: [
    'chicken', 'beef', 'pork', 'lamb', 'turkey', 'duck', 'fish',
    'salmon', 'tuna', 'shrimp', 'crab', 'lobster', 'mushrooms',
    'spinach', 'kale', 'broccoli', 'cauliflower', 'cabbage',
    'onions', 'garlic', 'leeks', 'celery', 'tomatoes', 'peppers',
    'zucchini', 'eggplant', 'asparagus', 'green beans', 'peas',
    'potatoes', 'beans', 'lentils', 'chickpeas', 'cheese', 'eggs',
    'carrots', 'corn', 'beets', 'pumpkin', 'squash', 'bell peppers',
    'apple', 'pear', 'vegetables'
  ],
  
  neutralIngredients: [
    'flour', 'rice', 'pasta', 'bread', 'oats', 'quinoa', 'barley',
    'nuts', 'almonds', 'walnuts', 'pecans', 'cashews', 'seeds',
    'olive oil', 'butter', 'milk', 'cream', 'yogurt', 'water',
    'stock', 'broth', 'wine', 'beer', 'coconut', 'avocado'
  ]
};

// Simplified ingredient category detection for reference only
export const getIngredientCategory = (ingredient: string): string => {
  const normalizedIngredient = ingredient.toLowerCase().trim();
  
  // Check sweet condiments first
  for (const item of ingredientCategories.sweetCondiments) {
    if (normalizedIngredient.includes(item.toLowerCase()) || item.toLowerCase().includes(normalizedIngredient)) {
      return 'sweetCondiment';
    }
  }
  
  // Check savory condiments
  for (const item of ingredientCategories.savoryCondiments) {
    if (normalizedIngredient.includes(item.toLowerCase()) || item.toLowerCase().includes(normalizedIngredient)) {
      return 'savoryCondiment';
    }
  }
  
  // Check sweet ingredients
  for (const item of ingredientCategories.sweetIngredients) {
    if (normalizedIngredient.includes(item.toLowerCase()) || item.toLowerCase().includes(normalizedIngredient)) {
      return 'sweetIngredient';
    }
  }
  
  // Check savory ingredients
  for (const item of ingredientCategories.savoryIngredients) {
    if (normalizedIngredient.includes(item.toLowerCase()) || item.toLowerCase().includes(normalizedIngredient)) {
      return 'savoryIngredient';
    }
  }
  
  return 'neutral';
};

// COMPLETELY PERMISSIVE - ALL ingredients are compatible
export const areIngredientsCompatible = (ingredient1: string, ingredient2: string): boolean => {
  console.log(`✅ CREATIVE PAIRING ALLOWED: "${ingredient1}" + "${ingredient2}" - letting AI find creative solutions`);
  return true; // Always return true - let the AI be creative!
};

// Get compatible condiment suggestions based on main ingredient
export const getCompatibleCondiments = (mainIngredient: string): string[] => {
  const category = getIngredientCategory(mainIngredient);
  
  if (category === 'sweetIngredient') {
    return ingredientCategories.sweetCondiments.slice(0, 5);
  }
  
  if (category === 'savoryIngredient') {
    return ingredientCategories.savoryCondiments.slice(0, 5);
  }
  
  // For neutral ingredients, return a mix
  return [
    ...ingredientCategories.sweetCondiments.slice(0, 3),
    ...ingredientCategories.savoryCondiments.slice(0, 3)
  ];
};

// COMPLETELY PERMISSIVE validation - always valid
export const validateRecipeIngredients = (ingredients: string[]): {
  isValid: boolean;
  incompatiblePairs: Array<{ ingredient1: string; ingredient2: string; reason: string }>;
} => {
  console.log("✅ CREATIVE VALIDATION: All ingredient combinations are allowed for creative fusion cooking");
  
  // Always return valid - let users be creative!
  return { 
    isValid: true, 
    incompatiblePairs: [] 
  };
};

// NO FILTERING - respect all user choices
export const filterCompatibleIngredients = (ingredients: string[]): {
  compatibleIngredients: string[];
  removedIngredients: string[];
  reasons: string[];
} => {
  console.log("✅ RESPECTING ALL USER INGREDIENT CHOICES - no filtering applied");
  
  // Return all ingredients as compatible - no filtering!
  return { 
    compatibleIngredients: [...ingredients], 
    removedIngredients: [], 
    reasons: [] 
  };
};
