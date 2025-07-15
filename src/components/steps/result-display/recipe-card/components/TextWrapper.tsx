
import { createTextMeasurer, measureText, cleanupMeasurer } from '../utils/textMeasurement';
import { calculateAvailableWidth, type LayoutDimensions } from '../utils/layoutCalculations';

interface TextWrapperProps {
  text: string;
  fontSize: number;
  lineHeight: number;
  dimensions: LayoutDimensions;
  currentY: { value: number };
}

export const useTextWrapper = () => {
  const wrapText = ({ text, fontSize, lineHeight, dimensions, currentY }: TextWrapperProps): string[] => {
    const measurer = createTextMeasurer(fontSize);
    const words = text.split(/\s+/).filter(w => w.trim());
    const lines: string[] = [];
    let wordIndex = 0;

    while (wordIndex < words.length && currentY.value + lineHeight <= dimensions.containerHeight - dimensions.margin) {
      const availableWidth = calculateAvailableWidth(currentY.value, lineHeight, dimensions);
      
      if (availableWidth < 80) {
        currentY.value += lineHeight;
        continue;
      }

      let currentLine = '';
      while (wordIndex < words.length) {
        const word = words[wordIndex];
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        
        if (measureText(testLine, measurer) <= availableWidth) {
          currentLine = testLine;
          wordIndex++;
        } else {
          if (currentLine === '') {
            currentLine = word;
            wordIndex++;
          }
          break;
        }
      }

      if (currentLine) {
        lines.push(currentLine);
        currentY.value += lineHeight;
      }
    }

    cleanupMeasurer(measurer);
    return lines;
  };

  return { wrapText };
};
