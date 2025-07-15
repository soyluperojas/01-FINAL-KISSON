
/**
 * Enhanced input sanitization for public-facing application
 */

// HTML entities to prevent XSS
const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
};

export class InputSanitizer {
  /**
   * Sanitize text input to prevent XSS attacks
   */
  static sanitizeText(input: string): string {
    if (typeof input !== 'string') return '';
    
    return input
      .replace(/[&<>"'\/]/g, (char) => HTML_ENTITIES[char] || char)
      .trim()
      .slice(0, 10000); // Reasonable length limit
  }

  /**
   * Sanitize and validate recipe data
   */
  static sanitizeRecipeData(data: any): any {
    if (!data || typeof data !== 'object') return {};

    const sanitized: any = {};

    // Sanitize string fields
    const stringFields = [
      'memoryType', 'writtenMemory', 'dedication', 'dedicationRecipient',
      'secretIngredient', 'spiceCondiment', 'shape', 'intensity', 'serveTime',
      'generatedTitle', 'generatedRecipe', 'generatedDescription'
    ];

    stringFields.forEach(field => {
      if (data[field] && typeof data[field] === 'string') {
        sanitized[field] = this.sanitizeText(data[field]);
      }
    });

    // Sanitize array fields
    if (Array.isArray(data.emotionalIngredients)) {
      sanitized.emotionalIngredients = data.emotionalIngredients
        .slice(0, 10) // Limit array size
        .map((item: any) => typeof item === 'string' ? this.sanitizeText(item) : '')
        .filter(Boolean);
    }

    if (Array.isArray(data.generatedIngredients)) {
      sanitized.generatedIngredients = data.generatedIngredients
        .slice(0, 20) // Limit array size
        .map((item: any) => typeof item === 'string' ? this.sanitizeText(item) : '')
        .filter(Boolean);
    }

    // Validate URLs
    if (data.storedImageUrl && typeof data.storedImageUrl === 'string') {
      sanitized.storedImageUrl = this.validateUrl(data.storedImageUrl);
    }

    return sanitized;
  }

  /**
   * Validate and sanitize URL inputs
   */
  static validateUrl(url: string): string | null {
    if (!url || typeof url !== 'string') return null;
    
    try {
      const parsed = new URL(url);
      // Only allow HTTP/HTTPS protocols
      if (!['http:', 'https:'].includes(parsed.protocol)) return null;
      
      // Basic URL sanitization
      return url.trim().slice(0, 2048); // Reasonable URL length limit
    } catch {
      return null;
    }
  }

  /**
   * Sanitize data for localStorage storage
   */
  static sanitizeForStorage(data: any): any {
    if (!data) return null;
    
    // Convert to JSON and back to remove any functions or undefined values
    try {
      const jsonString = JSON.stringify(data);
      if (jsonString.length > 1024 * 1024) { // 1MB limit
        console.warn('Data too large for storage, truncating');
        return null;
      }
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Error sanitizing data for storage:', error);
      return null;
    }
  }
}
