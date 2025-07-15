
export const useImageUrlValidation = () => {
  // Helper function to extract valid image URL from various formats
  const extractValidImageUrl = (storedUrl: any): string | null => {
    if (!storedUrl) return null;
    
    let url = "";
    
    // Handle string URLs
    if (typeof storedUrl === 'string') {
      url = storedUrl;
    }
    // Handle object with URL property
    else if (typeof storedUrl === 'object' && storedUrl !== null) {
      url = storedUrl.url || storedUrl.image_url || "";
    }
    
    // Validate URL - but be more lenient about placeholder images
    const isValid = url && 
        url !== 'undefined' && 
        url !== 'null' && 
        url.length > 10 &&
        (url.startsWith('http') || url.startsWith('//') || url.startsWith('data:'));
    
    return isValid ? url : null;
  };

  return { extractValidImageUrl };
};
