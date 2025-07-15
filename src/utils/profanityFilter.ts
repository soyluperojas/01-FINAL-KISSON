// Enhanced profanity filter with rate limiting for public use

// List of genuinely inappropriate words to filter (removed cooking-related terms)
const inappropriateWords = [
  'fuck', 'fucking', 'fucker', 'fucked', 'fuckoff', 'fuckhead', 'motherfuck', 'motherfucker',
  'shit', 'shitty', 'bullshit', 'shithead', 'shitface',
  'bitch', 'bitches', 'bitching',
  'asshole', 'assholes', 'ass', 'asses',
  'damn', 'damnit', 'goddamn', 'goddamnit',
  'cunt', 'pussy', 'cock', 'dick', 'prick',
  'bastard', 'bastards',
  'whore', 'slut', 'sluts',
  'retard', 'retarded',
  'nigger', 'nigga', 'fag', 'faggot',
  'crap', 'piss', 'pissed',
  'jackass', 'dumbass',
  'hell', 'godammit'
];

// Rate limiting for public users
const RATE_LIMIT_STORAGE_KEY = 'input_rate_limit';
const MAX_INPUTS_PER_MINUTE = 10;
const RATE_LIMIT_WINDOW = 60000; // 1 minute

// Result interface for validation
interface ValidationResult {
  isValid: boolean;
  message?: string;
  severity?: 'warning' | 'error';
}

// Enhanced profanity patterns
const PROFANITY_PATTERNS = [
  // Keep existing patterns but add more comprehensive checking
  /\b(fuck|shit|damn|hell|ass|bitch|bastard)\b/gi,
  /\b(fucking|fucking|bullshit|dammit)\b/gi,
  // Add more patterns as needed
];

// Spam patterns
const SPAM_PATTERNS = [
  /(.)\1{10,}/g, // Repeated characters
  /https?:\/\/[^\s]+/gi, // URLs (suspicious in recipe context)
  /\b(buy now|click here|free money|lottery|winner)\b/gi, // Spam keywords
];

/**
 * Validates input against a list of inappropriate words using word boundaries
 * @param input The text to validate
 * @returns ValidationResult with isValid flag and optional error message
 */
export const validateInput = (input: string): ValidationResult => {
  // Rate limiting check
  const rateLimitResult = checkRateLimit();
  if (!rateLimitResult.isValid) {
    return rateLimitResult;
  }

  // Length validation
  if (!input || input.trim().length === 0) {
    return { isValid: true };
  }

  if (input.length > 5000) {
    return {
      isValid: false,
      message: "Input is too long. Please keep it under 5000 characters.",
      severity: 'error'
    };
  }

  // Spam detection
  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(input)) {
      return {
        isValid: false,
        message: "Input appears to contain spam or suspicious content.",
        severity: 'error'
      };
    }
  }

  // Profanity check (warning, not blocking)
  for (const pattern of PROFANITY_PATTERNS) {
    if (pattern.test(input)) {
      return {
        isValid: true, // Allow but warn
        message: "Please keep your content family-friendly.",
        severity: 'warning'
      };
    }
  }

  // Record valid input for rate limiting
  recordInput();

  return { isValid: true };
};

/**
 * Removes inappropriate words from the input using word boundaries
 * @param input The text to filter
 * @returns Filtered text
 */
export const filterProfanity = (input: string): string => {
  if (!input) {
    return input;
  }
  
  let filteredText = input;
  
  // Replace each inappropriate word with asterisks using word boundaries
  for (const word of inappropriateWords) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    filteredText = filteredText.replace(regex, '*'.repeat(word.length));
  }
  
  return filteredText;
};

/**
 * Validates recipe-specific content
 * @param content The text to validate
 * @param type The type of content (memory, ingredient, dedication)
 * @returns ValidationResult with isValid flag and optional error message
 */
export function validateRecipeContent(content: string, type: 'memory' | 'ingredient' | 'dedication'): ValidationResult {
  const baseValidation = validateInput(content);
  if (!baseValidation.isValid) return baseValidation;

  // Type-specific validation
  switch (type) {
    case 'memory':
      if (content.length < 10) {
        return {
          isValid: false,
          message: "Please share a bit more about your memory (at least 10 characters).",
          severity: 'warning'
        };
      }
      break;
    
    case 'ingredient':
      if (content.length > 100) {
        return {
          isValid: false,
          message: "Ingredient names should be shorter (under 100 characters).",
          severity: 'error'
        };
      }
      break;
    
    case 'dedication':
      if (content.length > 200) {
        return {
          isValid: false,
          message: "Dedication should be shorter (under 200 characters).",
          severity: 'error'
        };
      }
      break;
  }

  return { isValid: true };
}

/**
 * Checks the rate limit for input submissions
 * @returns ValidationResult with isValid flag and optional error message
 */
function checkRateLimit(): ValidationResult {
  try {
    const stored = localStorage.getItem(RATE_LIMIT_STORAGE_KEY);
    const data = stored ? JSON.parse(stored) : { inputs: [], lastReset: Date.now() };
    
    const now = Date.now();
    
    // Reset if window expired
    if (now - data.lastReset > RATE_LIMIT_WINDOW) {
      data.inputs = [];
      data.lastReset = now;
    }
    
    // Check rate limit
    if (data.inputs.length >= MAX_INPUTS_PER_MINUTE) {
      return {
        isValid: false,
        message: "You're submitting too quickly. Please wait a moment before trying again.",
        severity: 'error'
      };
    }
    
    return { isValid: true };
  } catch (error) {
    console.error('Rate limit check error:', error);
    return { isValid: true }; // Fail open
  }
}

/**
 * Records valid input for rate limiting
 */
function recordInput(): void {
  try {
    const stored = localStorage.getItem(RATE_LIMIT_STORAGE_KEY);
    const data = stored ? JSON.parse(stored) : { inputs: [], lastReset: Date.now() };
    
    const now = Date.now();
    
    // Reset if window expired
    if (now - data.lastReset > RATE_LIMIT_WINDOW) {
      data.inputs = [];
      data.lastReset = now;
    }
    
    data.inputs.push(now);
    localStorage.setItem(RATE_LIMIT_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error recording input:', error);
  }
}
