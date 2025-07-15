
import { useEffect, useRef, useState } from "react";
import { useTextWrapper } from './TextWrapper';
import { ContentRenderer } from './ContentRenderer';
import { parseContentSections } from '../utils/layoutCalculations';
import { calculateAvailableWidth } from '../utils/layoutCalculations';

interface WrappingContentLayoutProps {
  content: string;
  qrWidth: number;
  qrHeight: number;
  logoWidth: number;
  logoHeight: number;
}

export const WrappingContentLayout = ({
  content,
  qrWidth,
  qrHeight,
  logoWidth,
  logoHeight
}: WrappingContentLayoutProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [wrappedContent, setWrappedContent] = useState<JSX.Element | null>(null);
  const { wrapText } = useTextWrapper();

  useEffect(() => {
    if (!content || !containerRef.current) {
      setWrappedContent(null);
      return;
    }

    const container = containerRef.current;
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    
    const margin = 8;
    const titleFontSize = 12;
    const titleLineHeight = 14;
    const paragraphFontSize = 8;
    const paragraphLineHeight = 10;
    const recipeFontSize = 7;
    const recipeLineHeight = 9;

    const dimensions = {
      containerWidth,
      containerHeight,
      qrWidth,
      qrHeight,
      logoWidth,
      logoHeight,
      margin
    };

    const { title, memoryParagraph, recipeContent } = parseContentSections(content);
    const elements: JSX.Element[] = [];
    const currentY = { value: margin };

    // Render title
    if (title) {
      const titleLines = wrapText({
        text: title,
        fontSize: titleFontSize,
        lineHeight: titleLineHeight,
        dimensions,
        currentY
      });
      
      const titleStartY = currentY.value - (titleLines.length * titleLineHeight);
      elements.push(...ContentRenderer({
        lines: titleLines,
        startY: titleStartY,
        fontSize: titleFontSize,
        lineHeight: titleLineHeight,
        margin,
        keyPrefix: 'title',
        fontWeight: 'bold'
      }));
      
      currentY.value += margin;
    }

    // Render memory paragraph
    if (memoryParagraph) {
      const paragraphLines = wrapText({
        text: memoryParagraph,
        fontSize: paragraphFontSize,
        lineHeight: paragraphLineHeight,
        dimensions,
        currentY
      });
      
      const paragraphStartY = currentY.value - (paragraphLines.length * paragraphLineHeight);
      elements.push(...ContentRenderer({
        lines: paragraphLines,
        startY: paragraphStartY,
        fontSize: paragraphFontSize,
        lineHeight: paragraphLineHeight,
        margin,
        keyPrefix: 'paragraph',
        fontStyle: 'italic'
      }));
      
      currentY.value += margin;
    }

    // Render recipe content
    if (recipeContent) {
      const recipeLines = wrapText({
        text: recipeContent,
        fontSize: recipeFontSize,
        lineHeight: recipeLineHeight,
        dimensions,
        currentY
      });
      
      const recipeStartY = currentY.value - (recipeLines.length * recipeLineHeight);
      elements.push(...ContentRenderer({
        lines: recipeLines,
        startY: recipeStartY,
        fontSize: recipeFontSize,
        lineHeight: recipeLineHeight,
        margin,
        keyPrefix: 'recipe'
      }));
    }

    const wrappedJSX = (
      <div className="absolute inset-0 text-black">
        {elements}
      </div>
    );

    setWrappedContent(wrappedJSX);

  }, [content, qrWidth, qrHeight, logoWidth, logoHeight, wrapText]);

  return { containerRef, wrappedContent };
};
