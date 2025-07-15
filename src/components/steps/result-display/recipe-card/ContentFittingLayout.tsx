
import { useState, useEffect } from 'react';

interface ContentFittingLayoutProps {
  recipeTitle: string;
  memoryDescription: string;
  cookingRecipe: string;
  shareableUrl: string;
}

export const ContentFittingLayout = ({
  recipeTitle,
  memoryDescription,
  cookingRecipe,
  shareableUrl
}: ContentFittingLayoutProps) => {
  const [contentId] = useState(`content-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    const optimizeContent = () => {
      const container = document.getElementById(contentId);
      if (!container) return;

      // Available height: 6 inches minus margins = about 520px
      const maxHeight = 520;
      let fontSize = 7; // Start with readable size
      const minFontSize = 4;

      const applyFontSize = (size: number) => {
        const title = container.querySelector('.title-text') as HTMLElement;
        const memory = container.querySelector('.memory-text') as HTMLElement;
        const recipe = container.querySelector('.recipe-text') as HTMLElement;

        if (title) {
          title.style.fontSize = `${Math.max(size + 2, minFontSize + 1)}pt`;
          title.style.lineHeight = '1.1';
        }
        if (memory) {
          memory.style.fontSize = `${Math.max(size - 1, minFontSize)}pt`;
          memory.style.lineHeight = '1.0';
        }
        if (recipe) {
          recipe.style.fontSize = `${size}pt`;
          recipe.style.lineHeight = '1.0';
          
          // Apply to all child elements
          const children = recipe.querySelectorAll('*') as NodeListOf<HTMLElement>;
          children.forEach(child => {
            child.style.fontSize = `${size}pt`;
            child.style.lineHeight = '1.0';
            child.style.margin = '1px 0';
            child.style.padding = '0';
          });
        }
      };

      // Binary search for optimal font size
      while (fontSize > minFontSize) {
        applyFontSize(fontSize);
        
        // Force layout update
        container.style.height = 'auto';
        const actualHeight = container.scrollHeight;
        
        console.log(`Font size ${fontSize}pt: height ${actualHeight}px (max: ${maxHeight}px)`);
        
        if (actualHeight <= maxHeight) {
          break;
        }
        
        fontSize -= 0.3;
      }

      // Final safety: set max height to prevent any overflow
      container.style.maxHeight = `${maxHeight}px`;
      container.style.overflow = 'hidden';
      
      console.log(`Final font size: ${fontSize}pt`);
    };

    // Run optimization with delays to ensure DOM is ready
    setTimeout(optimizeContent, 100);
    setTimeout(optimizeContent, 500);
    
    // Optimize on print
    const handleBeforePrint = () => {
      setTimeout(optimizeContent, 50);
    };
    
    window.addEventListener('beforeprint', handleBeforePrint);
    
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
    };
  }, [contentId, cookingRecipe, memoryDescription]);

  return (
    <div 
      id={contentId}
      className="w-full h-full relative bg-white text-black overflow-hidden"
      style={{ 
        width: '4in', 
        height: '6in',
        padding: '0.15in',
        fontSize: '7pt',
        lineHeight: '1.0',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      {/* Small QR code overlay - top right */}
      <div style={{
        position: 'absolute',
        top: '0.1in',
        right: '0.1in',
        width: '0.8in',
        height: '0.8in',
        background: 'white',
        border: '1px solid #ddd',
        borderRadius: '3px',
        padding: '2px',
        zIndex: 10
      }}>
        <img 
          src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(shareableUrl)}`}
          alt="QR Code"
          style={{ 
            width: '100%',
            height: '100%',
            display: 'block'
          }}
        />
      </div>

      {/* Small logo overlay - bottom right */}
      <div style={{
        position: 'absolute',
        bottom: '0.1in',
        right: '0.1in',
        width: '0.8in',
        height: '0.8in',
        background: 'white',
        border: '1px solid #ddd',
        borderRadius: '3px',
        padding: '2px',
        zIndex: 10
      }}>
        <img 
          src="/lovable-uploads/7d0c86e8-de4d-46a1-ab91-4fb74602093c.png"
          alt="KissOn Logo"
          style={{ 
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />
      </div>

      {/* Main content - single column that avoids overlays */}
      <div style={{
        paddingRight: '1in', // Leave space for QR code
        paddingBottom: '1in', // Leave space for logo
        height: '100%'
      }}>
        {/* Title */}
        <div 
          className="title-text"
          style={{
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '0.1in',
            fontSize: '9pt',
            lineHeight: '1.1'
          }}
        >
          {recipeTitle || "Memory Recipe"}
        </div>

        {/* Memory Description */}
        <div 
          className="memory-text"
          style={{
            fontStyle: 'italic',
            marginBottom: '0.1in',
            fontSize: '6pt',
            lineHeight: '1.0',
            maxHeight: '0.5in',
            overflow: 'hidden'
          }}
        >
          {memoryDescription}
        </div>

        {/* Recipe Content */}
        <div 
          className="recipe-text"
          style={{
            fontSize: '7pt',
            lineHeight: '1.0',
            wordWrap: 'break-word',
            overflowWrap: 'break-word'
          }}
        >
          {cookingRecipe ? (
            cookingRecipe.split('\n').map((paragraph, index) => (
              <p key={index} style={{
                margin: '2px 0',
                padding: '0'
              }}>
                {paragraph}
              </p>
            ))
          ) : (
            <p>Recipe in preparation...</p>
          )}
        </div>
      </div>
    </div>
  );
};
