
import { useEffect, useRef } from "react";

interface TextFittingOptimizerProps {
  targetElementId: string;
  maxHeight: number;
  minFontSize?: number;
  enabled?: boolean;
}

export const TextFittingOptimizer = ({ 
  targetElementId,
  maxHeight,
  minFontSize = 4,
  enabled = true
}: TextFittingOptimizerProps) => {
  const optimizerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;

    const optimizeContentFit = () => {
      const targetElement = document.getElementById(targetElementId);
      if (!targetElement) return;

      console.log("🔧 Starting content fitting optimization...");

      // Check if content fits
      const checkFit = (): boolean => {
        const contentHeight = targetElement.scrollHeight;
        const availableHeight = maxHeight;
        const fits = contentHeight <= availableHeight;
        console.log(`📏 Content: ${contentHeight}px, Available: ${availableHeight}px, Fits: ${fits}`);
        return fits;
      };

      // Get all text elements that can be optimized
      const getOptimizableElements = () => {
        return {
          recipeContent: targetElement.querySelector('.recipe-content') as HTMLElement,
          recipeContentChildren: targetElement.querySelectorAll('.recipe-content *') as NodeListOf<HTMLElement>,
          memoryDescription: targetElement.querySelector('.memory-description') as HTMLElement,
          memoryDescChildren: targetElement.querySelectorAll('.memory-description *') as NodeListOf<HTMLElement>,
          title: targetElement.querySelector('.recipe-title h1') as HTMLElement,
          qrContainer: targetElement.querySelector('.qr-code-container') as HTMLElement,
          qrTexts: targetElement.querySelectorAll('.qr-code-text') as NodeListOf<HTMLElement>
        };
      };

      // Reduce font sizes systematically
      const optimizeFontSizes = (): boolean => {
        const elements = getOptimizableElements();
        
        // Priority 1: Recipe content (has most text)
        if (elements.recipeContent) {
          const currentSize = parseFloat(getComputedStyle(elements.recipeContent).fontSize) || 6;
          if (currentSize > minFontSize) {
            const newSize = Math.max(currentSize - 0.3, minFontSize);
            elements.recipeContent.style.fontSize = `${newSize}pt`;
            elements.recipeContent.style.lineHeight = '1.0';
            
            // Apply to all children
            elements.recipeContentChildren.forEach(child => {
              child.style.fontSize = `${newSize}pt`;
              child.style.lineHeight = '1.0';
              child.style.margin = '1px 0';
              child.style.padding = '0';
            });
            
            console.log(`📝 Reduced recipe font to ${newSize}pt`);
            return true;
          }
        }

        // Priority 2: Memory description
        if (elements.memoryDescription) {
          const currentSize = parseFloat(getComputedStyle(elements.memoryDescription).fontSize) || 6;
          if (currentSize > minFontSize) {
            const newSize = Math.max(currentSize - 0.3, minFontSize);
            elements.memoryDescription.style.fontSize = `${newSize}pt`;
            elements.memoryDescription.style.lineHeight = '1.0';
            
            elements.memoryDescChildren.forEach(child => {
              child.style.fontSize = `${newSize}pt`;
              child.style.lineHeight = '1.0';
            });
            
            console.log(`💭 Reduced memory font to ${newSize}pt`);
            return true;
          }
        }

        // Priority 3: Title (less critical)
        if (elements.title) {
          const currentSize = parseFloat(getComputedStyle(elements.title).fontSize) || 9;
          if (currentSize > minFontSize + 1) {
            const newSize = Math.max(currentSize - 0.3, minFontSize + 1);
            elements.title.style.fontSize = `${newSize}pt`;
            elements.title.style.lineHeight = '1.0';
            console.log(`🏷️ Reduced title font to ${newSize}pt`);
            return true;
          }
        }

        return false;
      };

      // Optimize spacing and layout
      const optimizeSpacing = () => {
        const elements = getOptimizableElements();

        // Compact memory description
        if (elements.memoryDescription) {
          elements.memoryDescription.style.margin = '1px 0 2px 0';
          elements.memoryDescription.style.padding = '1px';
          elements.memoryDescription.style.maxHeight = '0.35in';
          elements.memoryDescription.style.overflow = 'hidden';
        }

        // Compact title
        if (elements.title) {
          elements.title.style.margin = '0';
          elements.title.style.padding = '1px 0';
          elements.title.style.maxHeight = '0.25in';
          elements.title.style.overflow = 'hidden';
        }

        // Compact QR section
        if (elements.qrContainer) {
          elements.qrContainer.style.padding = '1px';
          elements.qrContainer.style.margin = '1px 0';
          elements.qrContainer.style.maxHeight = '0.9in';
          
          const qrImg = elements.qrContainer.querySelector('img') as HTMLElement;
          if (qrImg) {
            qrImg.style.width = '0.6in';
            qrImg.style.height = '0.6in';
          }
        }

        // Optimize QR text
        elements.qrTexts.forEach(text => {
          text.style.fontSize = '3pt';
          text.style.margin = '0';
          text.style.lineHeight = '1.0';
        });

        // Reduce gaps
        const mainContent = targetElement.querySelector('.flex.gap-1, .flex.gap-2') as HTMLElement;
        if (mainContent) {
          mainContent.style.gap = '1px';
        }

        console.log("📐 Applied spacing optimizations");
      };

      // Main optimization loop
      let iterations = 0;
      const maxIterations = 30;

      // First optimize spacing
      optimizeSpacing();

      // Then iteratively reduce font sizes
      const optimize = async () => {
        while (!checkFit() && iterations < maxIterations) {
          iterations++;
          console.log(`🔄 Optimization iteration ${iterations}`);
          
          if (!optimizeFontSizes()) {
            console.log("⚠️ Cannot reduce fonts further, applying final constraints");
            
            // Final fallback: force height constraints
            const elements = getOptimizableElements();
            if (elements.recipeContent) {
              const availableRecipeHeight = maxHeight - 100; // Reserve space for other elements
              elements.recipeContent.style.maxHeight = `${availableRecipeHeight}px`;
              elements.recipeContent.style.overflow = 'hidden';
              console.log(`🚫 Applied height constraint: ${availableRecipeHeight}px`);
            }
            break;
          }
          
          // Allow DOM to update
          await new Promise(resolve => setTimeout(resolve, 10));
        }

        const finalFits = checkFit();
        console.log(`✅ Optimization complete in ${iterations} iterations. Fits: ${finalFits}`);
      };

      optimize();
    };

    // Run optimization after component mounts and content loads
    const timeouts = [
      setTimeout(() => optimizeContentFit(), 100),
      setTimeout(() => optimizeContentFit(), 500),
      setTimeout(() => optimizeContentFit(), 1000)
    ];

    // Also optimize on window events
    const handleOptimize = () => {
      setTimeout(optimizeContentFit, 50);
    };

    window.addEventListener('beforeprint', handleOptimize);
    window.addEventListener('resize', handleOptimize);

    return () => {
      timeouts.forEach(clearTimeout);
      window.removeEventListener('beforeprint', handleOptimize);
      window.removeEventListener('resize', handleOptimize);
    };
  }, [targetElementId, maxHeight, minFontSize, enabled]);

  return <div ref={optimizerRef} style={{ display: 'none' }} />;
};
