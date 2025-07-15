
import { useState, useEffect } from 'react';

interface SimpleFlowingContentProps {
  recipeTitle: string;
  memoryDescription: string;
  cookingRecipe: string;
}

export const SimpleFlowingContent = ({
  recipeTitle,
  memoryDescription,
  cookingRecipe
}: SimpleFlowingContentProps) => {
  const [formattedContent, setFormattedContent] = useState<string[]>([]);

  useEffect(() => {
    // Simple approach: split recipe into paragraphs and ensure they fit
    const content = cookingRecipe || "Recipe in preparation...";
    const paragraphs = content.split('\n').filter(p => p.trim());
    
    // Split long paragraphs into smaller chunks for better display
    const chunks: string[] = [];
    
    paragraphs.forEach(paragraph => {
      if (paragraph.length > 200) {
        // Split long paragraphs at sentence boundaries
        const sentences = paragraph.split('. ');
        let currentChunk = '';
        
        sentences.forEach((sentence, index) => {
          const testChunk = currentChunk ? `${currentChunk}. ${sentence}` : sentence;
          
          if (testChunk.length > 200 && currentChunk) {
            chunks.push(currentChunk + '.');
            currentChunk = sentence;
          } else {
            currentChunk = testChunk;
          }
          
          // Add the last chunk
          if (index === sentences.length - 1 && currentChunk) {
            chunks.push(currentChunk + (sentence.endsWith('.') ? '' : '.'));
          }
        });
      } else {
        chunks.push(paragraph);
      }
    });
    
    setFormattedContent(chunks);
  }, [cookingRecipe]);

  return (
    <div className="absolute inset-0 p-2 overflow-hidden">
      {/* Title */}
      <div className="mb-2" style={{ 
        fontSize: '9pt', 
        fontWeight: 'bold', 
        textAlign: 'center',
        lineHeight: '1.1',
        color: 'black'
      }}>
        {recipeTitle}
      </div>

      {/* Memory Description */}
      <div className="mb-2" style={{ 
        fontSize: '6pt', 
        fontStyle: 'italic',
        lineHeight: '1.0',
        color: 'black',
        maxHeight: '0.4in',
        overflow: 'hidden'
      }}>
        {memoryDescription}
      </div>

      {/* Recipe Content - Left column with right margin for QR/Logo */}
      <div style={{
        width: '2.4in',
        height: 'calc(100% - 1.2in)',
        fontSize: '5pt',
        lineHeight: '1.1',
        color: 'black',
        overflow: 'hidden',
        wordWrap: 'break-word'
      }}>
        {formattedContent.map((chunk, index) => (
          <p key={index} style={{
            margin: '0 0 3pt 0',
            padding: '0',
            wordWrap: 'break-word',
            overflowWrap: 'break-word'
          }}>
            {chunk}
          </p>
        ))}
      </div>
    </div>
  );
};
