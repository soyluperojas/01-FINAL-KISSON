
import { useState, useEffect } from 'react';

interface FlowingRecipeContentProps {
  content: string;
  containerWidth: number;
  containerHeight: number;
  qrCodeArea: { top: number; right: number; width: number; height: number };
  logoArea: { bottom: number; right: number; width: number; height: number };
}

export const FlowingRecipeContent = ({
  content,
  containerWidth,
  containerHeight,
  qrCodeArea,
  logoArea
}: FlowingRecipeContentProps) => {
  const [wrappedLines, setWrappedLines] = useState<string[]>([]);

  useEffect(() => {
    const wrapText = () => {
      if (!content) return;

      const fontSize = 6; // Smaller font for more content
      const lineHeight = 7; // Tighter line spacing
      const charWidth = 3.2; // Character width estimation
      const margin = 8;
      
      // Split content into words, preserving line breaks
      const paragraphs = content.split('\n').filter(p => p.trim());
      const lines: string[] = [];
      let currentY = margin;
      
      for (const paragraph of paragraphs) {
        // Add empty line between paragraphs (except first)
        if (lines.length > 0) {
          lines.push('');
          currentY += lineHeight;
        }
        
        const words = paragraph.split(/\s+/).filter(word => word.trim());
        let wordIndex = 0;
        
        while (wordIndex < words.length && currentY + lineHeight <= containerHeight - margin) {
          // Calculate available width for this line
          let availableWidth = containerWidth - (margin * 2);
          
          // Check QR code interference
          if (currentY >= qrCodeArea.top && currentY <= qrCodeArea.top + qrCodeArea.height) {
            availableWidth = containerWidth - qrCodeArea.width - (margin * 3);
          }
          
          // Check logo interference  
          if (currentY >= containerHeight - logoArea.bottom - logoArea.height) {
            availableWidth = containerWidth - logoArea.width - (margin * 3);
          }
          
          // Minimum width check
          if (availableWidth < 80) {
            currentY += lineHeight;
            continue;
          }
          
          const maxCharsPerLine = Math.floor(availableWidth / charWidth);
          
          // Build line with word wrapping
          let currentLine = '';
          const startWordIndex = wordIndex;
          
          while (wordIndex < words.length) {
            const word = words[wordIndex];
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            
            if (testLine.length <= maxCharsPerLine) {
              currentLine = testLine;
              wordIndex++;
            } else {
              // Can't fit this word, break line
              if (currentLine === '') {
                // Force long word if it's the only word on line
                currentLine = word.substring(0, maxCharsPerLine - 3) + '...';
                wordIndex++;
              }
              break;
            }
          }
          
          if (currentLine) {
            lines.push(currentLine);
            currentY += lineHeight;
          }
          
          // Safety check to prevent infinite loops
          if (wordIndex === startWordIndex && currentLine === '') {
            wordIndex++;
          }
        }
      }
      
      setWrappedLines(lines);
    };

    wrapText();
  }, [content, containerWidth, containerHeight, qrCodeArea, logoArea]);

  return (
    <div className="absolute inset-0" style={{ padding: '8px' }}>
      {wrappedLines.map((line, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            top: `${8 + (index * 7)}px`,
            left: '8px',
            fontSize: '6pt',
            lineHeight: '7pt',
            color: 'black',
            whiteSpace: 'nowrap',
            fontFamily: 'Arial, sans-serif'
          }}
        >
          {line}
        </div>
      ))}
    </div>
  );
};
