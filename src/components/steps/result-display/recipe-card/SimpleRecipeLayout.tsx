
import { useEffect, useState } from "react";

interface SimpleRecipeLayoutProps {
  title: string;
  memoryDescription: string;
  recipeContent: string;
}

export const SimpleRecipeLayout = ({
  title,
  memoryDescription,
  recipeContent
}: SimpleRecipeLayoutProps) => {
  return (
    <div className="w-full h-full p-2 bg-white text-black overflow-hidden">
      {/* Title */}
      {title && (
        <div className="mb-3">
          <h1 
            className="font-bold text-center"
            style={{ 
              fontSize: '14pt',
              lineHeight: '16pt',
              margin: '0',
              padding: '0'
            }}
          >
            {title}
          </h1>
        </div>
      )}
      
      {/* Memory Description */}
      {memoryDescription && (
        <div className="mb-3">
          <p 
            className="italic"
            style={{ 
              fontSize: '9pt',
              lineHeight: '11pt',
              margin: '0',
              padding: '0'
            }}
          >
            {memoryDescription}
          </p>
        </div>
      )}
      
      {/* Recipe Content */}
      <div 
        className="flex-1"
        style={{ 
          fontSize: '8pt',
          lineHeight: '10pt',
          overflow: 'hidden',
          wordWrap: 'break-word',
          maxHeight: 'calc(100% - 120px)' // Leave room for QR and logo
        }}
      >
        <div style={{ whiteSpace: 'pre-wrap' }}>
          {recipeContent || "Recipe in preparation..."}
        </div>
      </div>
    </div>
  );
};
