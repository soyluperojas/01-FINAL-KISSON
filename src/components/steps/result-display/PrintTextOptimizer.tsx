
import { useEffect, useRef } from "react";

interface PrintTextOptimizerProps {
  children: React.ReactNode;
  targetElementId: string;
  maxHeight?: number;
  minFontSize?: number;
  maxFontSize?: number;
}

export const PrintTextOptimizer = ({ 
  children, 
  targetElementId,
  maxHeight = 600,
  minFontSize = 4, // Reduced minimum font size for more aggressive optimization
  maxFontSize = 9
}: PrintTextOptimizerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const optimizeForPrint = () => {
      const printArea = document.getElementById(targetElementId);
      if (!printArea) return;

      console.log("Starting aggressive text optimization for print...");

      // Function to check if content fits within the available space
      const doesContentFit = (): boolean => {
        // Force a layout update first
        printArea.style.height = 'auto';
        
        // Get the actual content height
        const contentHeight = printArea.scrollHeight;
        
        // Available height for 4x6 inch page with margins (in pixels at 96 DPI)
        // 4x6 inches = 384x576 pixels, minus margins = approximately 340x520 pixels
        const availableHeight = 520; // Conservative estimate for print area
        
        console.log(`Content height: ${contentHeight}px, Available: ${availableHeight}px`);
        return contentHeight <= availableHeight;
      };

      // Function to get all text elements that need optimization
      const getTextElements = () => {
        return {
          title: printArea.querySelector('.recipe-title') as HTMLElement,
          description: printArea.querySelector('.memory-description') as HTMLElement,
          recipe: printArea.querySelector('.recipe-content') as HTMLElement,
          qrContainer: printArea.querySelector('.qr-code-container') as HTMLElement,
          allTextElements: printArea.querySelectorAll('.recipe-title, .memory-description, .recipe-content, .recipe-content *') as NodeListOf<HTMLElement>
        };
      };

      // Set very aggressive initial font sizes
      const setInitialFontSizes = () => {
        const { title, description, recipe, qrContainer } = getTextElements();
        
        if (title) {
          title.style.fontSize = '8pt';
          title.style.lineHeight = '1.0';
          title.style.margin = '0 0 0.05in 0';
          title.style.padding = '0.02in';
        }
        
        if (description) {
          description.style.fontSize = '6pt';
          description.style.lineHeight = '1.1';
          description.style.margin = '0.02in 0 0.05in 0';
          description.style.padding = '0.02in';
        }
        
        if (recipe) {
          recipe.style.fontSize = '6pt';
          recipe.style.lineHeight = '1.0';
          recipe.style.margin = '0';
          recipe.style.padding = '0.02in';
          
          // Set all child elements to inherit and be very compact
          const childElements = recipe.querySelectorAll('*') as NodeListOf<HTMLElement>;
          childElements.forEach(child => {
            child.style.fontSize = '6pt';
            child.style.lineHeight = '1.0';
            child.style.margin = '0.01in 0';
            child.style.padding = '0';
          });
        }

        // Make QR code section very compact
        if (qrContainer) {
          qrContainer.style.margin = '0.02in 0';
          qrContainer.style.padding = '0.02in';
          
          const qrImg = qrContainer.querySelector('img') as HTMLElement;
          if (qrImg) {
            qrImg.style.width = '0.6in';
            qrImg.style.height = '0.6in';
            qrImg.style.margin = '0.01in 0';
          }
          
          const qrTexts = qrContainer.querySelectorAll('.qr-code-text') as NodeListOf<HTMLElement>;
          qrTexts.forEach(text => {
            text.style.fontSize = '4pt';
            text.style.lineHeight = '1.0';
            text.style.margin = '0.01in 0';
          });
        }
      };

      // Ultra-aggressive text fitting algorithm
      const fitTextToPage = () => {
        let iterations = 0;
        const maxIterations = 100; // Increased iterations for more aggressive optimization
        
        while (!doesContentFit() && iterations < maxIterations) {
          iterations++;
          console.log(`Aggressive optimization iteration ${iterations}`);
          
          const { title, description, recipe, qrContainer } = getTextElements();
          
          // Get current font sizes
          const titleSize = title ? parseFloat(title.style.fontSize) || 8 : 8;
          const descSize = description ? parseFloat(description.style.fontSize) || 6 : 6;
          const recipeSize = recipe ? parseFloat(recipe.style.fontSize) || 6 : 6;
          
          // Very aggressive font size reduction
          if (recipe && recipeSize > minFontSize) {
            const newSize = Math.max(recipeSize - 0.1, minFontSize); // Smaller increments
            recipe.style.fontSize = `${newSize}pt`;
            recipe.style.lineHeight = '0.9';
            
            // Update all child elements with very compact spacing
            const childElements = recipe.querySelectorAll('*') as NodeListOf<HTMLElement>;
            childElements.forEach(child => {
              child.style.fontSize = `${newSize}pt`;
              child.style.lineHeight = '0.9';
              child.style.margin = '0.005in 0';
              child.style.padding = '0';
            });
            
            console.log(`Reduced recipe font size to ${newSize}pt`);
            continue;
          }
          
          if (description && descSize > minFontSize) {
            const newSize = Math.max(descSize - 0.1, minFontSize);
            description.style.fontSize = `${newSize}pt`;
            description.style.lineHeight = '0.9';
            description.style.margin = '0.01in 0 0.02in 0';
            description.style.padding = '0.01in';
            console.log(`Reduced description font size to ${newSize}pt`);
            continue;
          }
          
          if (title && titleSize > minFontSize + 1) {
            const newSize = Math.max(titleSize - 0.1, minFontSize + 1);
            title.style.fontSize = `${newSize}pt`;
            title.style.lineHeight = '0.9';
            title.style.margin = '0 0 0.02in 0';
            title.style.padding = '0.01in';
            console.log(`Reduced title font size to ${newSize}pt`);
            continue;
          }
          
          // Ultra-compact spacing adjustments
          if (recipe) {
            const childElements = recipe.querySelectorAll('*') as NodeListOf<HTMLElement>;
            childElements.forEach(child => {
              child.style.margin = '0';
              child.style.padding = '0';
              child.style.lineHeight = '0.8';
            });
            recipe.style.margin = '0';
            recipe.style.padding = '0.01in';
          }
          
          if (description) {
            description.style.margin = '0.005in 0 0.01in 0';
            description.style.padding = '0.005in';
            description.style.lineHeight = '0.8';
          }

          if (title) {
            title.style.margin = '0 0 0.01in 0';
            title.style.padding = '0.005in';
            title.style.lineHeight = '0.8';
          }

          // Make QR section ultra-compact
          if (qrContainer) {
            qrContainer.style.margin = '0.01in 0';
            qrContainer.style.padding = '0.01in';
            
            const qrImg = qrContainer.querySelector('img') as HTMLElement;
            if (qrImg) {
              qrImg.style.width = '0.5in';
              qrImg.style.height = '0.5in';
              qrImg.style.margin = '0';
            }
            
            const qrTexts = qrContainer.querySelectorAll('.qr-code-text') as NodeListOf<HTMLElement>;
            qrTexts.forEach(text => {
              text.style.fontSize = '3pt';
              text.style.lineHeight = '0.8';
              text.style.margin = '0';
            });
          }
          
          // Final resort: ensure content is contained within bounds
          if (iterations > 80) {
            console.log("Applying final containment measures");
            printArea.style.height = '5.6in'; // Slightly less than page height
            printArea.style.overflow = 'hidden';
            
            // If still too big, start hiding less important elements
            if (!doesContentFit()) {
              const qrTexts = printArea.querySelectorAll('.qr-code-text') as NodeListOf<HTMLElement>;
              qrTexts.forEach(text => {
                text.style.display = 'none';
              });
            }
            
            break;
          }
        }
        
        console.log(`Aggressive text optimization completed in ${iterations} iterations`);
        console.log(`Final fit status: ${doesContentFit() ? 'SUCCESS' : 'FORCED FIT'}`);
        
        // Final safety check - ensure content doesn't exceed page bounds
        const finalHeight = printArea.scrollHeight;
        if (finalHeight > 520) {
          console.log("Applying final height constraint");
          printArea.style.height = '5.6in';
          printArea.style.overflow = 'hidden';
        }
      };

      // Apply ultra-compact grid layout
      const optimizeLayout = () => {
        const grid = printArea.querySelector('.recipe-grid') as HTMLElement;
        if (grid) {
          grid.style.gap = '0.05in';
          grid.style.margin = '0.02in 0';
        }
        
        const columns = printArea.querySelectorAll('.recipe-content-column, .qr-column') as NodeListOf<HTMLElement>;
        columns.forEach(col => {
          col.style.margin = '0';
          col.style.padding = '0';
        });
      };

      // Run the aggressive optimization sequence
      optimizeLayout();
      setInitialFontSizes();
      
      // Multiple optimization passes with delays to ensure DOM updates
      setTimeout(() => {
        fitTextToPage();
        
        // Second pass for fine-tuning
        setTimeout(() => {
          if (!doesContentFit()) {
            console.log("Running second optimization pass");
            fitTextToPage();
          }
        }, 50);
      }, 100);
    };

    // Add print event listeners
    const handleBeforePrint = () => {
      console.log("Preparing for aggressive print optimization...");
      setTimeout(optimizeForPrint, 150);
    };

    const handleAfterPrint = () => {
      console.log("Print completed, resetting styles...");
      const printArea = document.getElementById(targetElementId);
      if (printArea) {
        // Reset all modified styles
        const allElements = printArea.querySelectorAll('*') as NodeListOf<HTMLElement>;
        allElements.forEach((element) => {
          element.style.fontSize = '';
          element.style.lineHeight = '';
          element.style.margin = '';
          element.style.padding = '';
          element.style.height = '';
          element.style.overflow = '';
          element.style.display = '';
          element.style.width = '';
        });
        
        printArea.style.height = '';
        printArea.style.overflow = '';
      }
    };

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);

    // Also run optimization on component mount for immediate preview
    optimizeForPrint();

    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, [targetElementId, maxHeight, minFontSize, maxFontSize]);

  return (
    <div ref={containerRef}>
      {children}
    </div>
  );
};
