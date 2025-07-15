
import { useEffect, useRef } from "react";

interface TextOptimizerProps {
  targetElementId: string;
  maxHeight?: number;
  minFontSize?: number;
  maxFontSize?: number;
}

export const TextOptimizer = ({ 
  targetElementId,
  maxHeight = 520, // Available height for 4x6 inch card
  minFontSize = 4,
  maxFontSize = 9
}: TextOptimizerProps) => {
  const optimizerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const optimizeText = async () => {
      const printArea = document.getElementById(targetElementId);
      if (!printArea) return;

      console.log("Starting text optimization to prevent cropping...");

      // Function to check if content fits
      const doesContentFit = (): boolean => {
        const contentHeight = printArea.scrollHeight;
        const availableHeight = maxHeight;
        console.log(`Content height: ${contentHeight}px, Available: ${availableHeight}px`);
        return contentHeight <= availableHeight;
      };

      // Function to reduce font sizes systematically
      const optimizeFontSizes = () => {
        const recipeContent = printArea.querySelector('.recipe-content') as HTMLElement;
        const memoryDescription = printArea.querySelector('.memory-description') as HTMLElement;
        const title = printArea.querySelector('.recipe-title') as HTMLElement;

        if (!recipeContent) return false;

        // Get current font sizes
        const currentRecipeSize = parseFloat(getComputedStyle(recipeContent).fontSize) || 6;
        const currentMemorySize = memoryDescription ? parseFloat(getComputedStyle(memoryDescription).fontSize) || 6 : 6;
        const currentTitleSize = title ? parseFloat(getComputedStyle(title).fontSize) || 9 : 9;

        console.log(`Current sizes - Recipe: ${currentRecipeSize}pt, Memory: ${currentMemorySize}pt, Title: ${currentTitleSize}pt`);

        // Reduce recipe content font size first (most content)
        if (currentRecipeSize > minFontSize) {
          const newSize = Math.max(currentRecipeSize - 0.2, minFontSize);
          recipeContent.style.fontSize = `${newSize}pt`;
          recipeContent.style.lineHeight = '1.0';
          
          // Apply to all child elements
          const childElements = recipeContent.querySelectorAll('*') as NodeListOf<HTMLElement>;
          childElements.forEach(child => {
            child.style.fontSize = `${newSize}pt`;
            child.style.lineHeight = '1.0';
            child.style.margin = '1px 0';
            child.style.padding = '0';
          });
          
          console.log(`Reduced recipe font size to ${newSize}pt`);
          return true;
        }

        // Then reduce memory description
        if (memoryDescription && currentMemorySize > minFontSize) {
          const newSize = Math.max(currentMemorySize - 0.2, minFontSize);
          memoryDescription.style.fontSize = `${newSize}pt`;
          memoryDescription.style.lineHeight = '1.0';
          memoryDescription.style.margin = '1px 0 2px 0';
          console.log(`Reduced memory font size to ${newSize}pt`);
          return true;
        }

        // Finally reduce title if necessary
        if (title && currentTitleSize > minFontSize + 1) {
          const newSize = Math.max(currentTitleSize - 0.2, minFontSize + 1);
          title.style.fontSize = `${newSize}pt`;
          title.style.lineHeight = '1.0';
          title.style.margin = '0 0 2px 0';
          console.log(`Reduced title font size to ${newSize}pt`);
          return true;
        }

        return false;
      };

      // Function to optimize spacing
      const optimizeSpacing = () => {
        // Reduce gaps between sections
        const mainContent = printArea.querySelector('.flex-1.flex.gap-1') as HTMLElement;
        if (mainContent) {
          mainContent.style.gap = '1px';
        }

        // Compact QR section
        const qrContainer = printArea.querySelector('.qr-code-container') as HTMLElement;
        if (qrContainer) {
          qrContainer.style.margin = '1px 0';
          qrContainer.style.padding = '1px';
          qrContainer.style.maxHeight = '0.9in';
          
          const qrImg = qrContainer.querySelector('img') as HTMLElement;
          if (qrImg) {
            qrImg.style.width = '0.6in';
            qrImg.style.height = '0.6in';
          }
          
          const qrTexts = qrContainer.querySelectorAll('.qr-code-text') as NodeListOf<HTMLElement>;
          qrTexts.forEach(text => {
            text.style.fontSize = '3pt';
            text.style.margin = '0';
            text.style.lineHeight = '1.0';
          });
        }

        // Compact memory description
        const memoryDesc = printArea.querySelector('.memory-description') as HTMLElement;
        if (memoryDesc) {
          memoryDesc.style.margin = '1px 0 2px 0';
          memoryDesc.style.padding = '1px';
          memoryDesc.style.maxHeight = '0.4in';
          memoryDesc.style.overflow = 'hidden';
        }

        // Compact title
        const title = printArea.querySelector('.recipe-title') as HTMLElement;
        if (title) {
          title.style.margin = '0 0 1px 0';
          title.style.padding = '1px 0';
          title.style.maxHeight = '0.3in';
        }
      };

      // Main optimization loop
      let iterations = 0;
      const maxIterations = 50;

      // First, optimize spacing
      optimizeSpacing();

      // Then iteratively reduce font sizes until content fits
      while (!doesContentFit() && iterations < maxIterations) {
        iterations++;
        console.log(`Optimization iteration ${iterations}`);
        
        if (!optimizeFontSizes()) {
          console.log("Cannot reduce font sizes further, applying final constraints");
          
          // Final resort: set max height and hide overflow
          const recipeContent = printArea.querySelector('.recipe-content') as HTMLElement;
          if (recipeContent) {
            const availableRecipeHeight = maxHeight - 120; // Account for title, memory, QR code
            recipeContent.style.maxHeight = `${availableRecipeHeight}px`;
            recipeContent.style.overflow = 'hidden';
            console.log(`Applied max height constraint: ${availableRecipeHeight}px`);
          }
          
          break;
        }
        
        // Small delay to allow DOM to update
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      console.log(`Text optimization completed in ${iterations} iterations`);
      console.log(`Final fit status: ${doesContentFit() ? 'SUCCESS' : 'CONSTRAINED'}`);
    };

    // Run optimization on mount and when window resizes
    const runOptimization = () => {
      setTimeout(() => optimizeText(), 100);
    };

    // Run optimization for both screen and print
    runOptimization();

    // Add print event listeners
    const handleBeforePrint = () => {
      console.log("Optimizing for print...");
      setTimeout(() => optimizeText(), 50);
    };

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('resize', runOptimization);

    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('resize', runOptimization);
    };
  }, [targetElementId, maxHeight, minFontSize, maxFontSize]);

  return <div ref={optimizerRef} style={{ display: 'none' }} />;
};
