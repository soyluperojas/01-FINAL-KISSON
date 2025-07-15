
import { useState, useEffect } from 'react';

interface PrintOptimizedLayoutProps {
  recipeTitle: string;
  memoryDescription: string;
  cookingRecipe: string;
  shareableUrl: string;
}

export const PrintOptimizedLayout = ({
  recipeTitle,
  memoryDescription,
  cookingRecipe,
  shareableUrl
}: PrintOptimizedLayoutProps) => {
  return (
    <div 
      className="w-full h-full relative bg-white text-black print-layout"
      style={{ 
        width: '4in', 
        height: '6in',
        padding: '0.15in',
        fontFamily: "'Courier Prime', 'Courier New', monospace",
        fontSize: '6pt',
        lineHeight: '1.0'
      }}
    >
      {/* Small QR Code - Top Right Corner */}
      <div style={{
        position: 'absolute',
        top: '0.1in',
        right: '0.1in',
        width: '0.6in',
        height: '0.6in',
        zIndex: 10
      }}>
        <img 
          src={`https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=${encodeURIComponent(shareableUrl)}`}
          alt="QR Code"
          style={{ 
            width: '100%',
            height: '100%'
          }}
        />
      </div>

      {/* Small Logo - Bottom Right Corner */}
      <div style={{
        position: 'absolute',
        bottom: '0.1in',
        right: '0.1in',
        width: '0.6in',
        height: '0.6in',
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

      {/* Main Content Area - Maximized for print */}
      <div style={{
        paddingRight: '0.7in', // Space for QR code
        paddingBottom: '0.7in', // Space for logo
        height: '100%'
      }}>
        
        {/* Compact Title */}
        <div style={{
          fontSize: '8pt',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '0.08in',
          lineHeight: '1.0',
          fontFamily: "'Courier Prime', 'Courier New', monospace"
        }}>
          {recipeTitle || "Memory Recipe"}
        </div>

        {/* Compact Memory Description */}
        <div style={{
          fontSize: '5pt',
          fontStyle: 'italic',
          marginBottom: '0.08in',
          lineHeight: '1.0',
          textAlign: 'justify',
          maxHeight: '0.4in',
          overflow: 'hidden',
          fontFamily: "'Courier Prime', 'Courier New', monospace"
        }}>
          {memoryDescription}
        </div>

        {/* Recipe Content - Maximum space utilization */}
        <div style={{
          fontSize: '5pt',
          lineHeight: '0.9',
          textAlign: 'left',
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          fontFamily: "'Courier Prime', 'Courier New', monospace"
        }}>
          {cookingRecipe ? (
            cookingRecipe.split('\n').map((line, index) => (
              <div key={index} style={{ marginBottom: '1pt' }}>
                {line}
              </div>
            ))
          ) : (
            <div>Recipe content loading...</div>
          )}
        </div>
      </div>
    </div>
  );
};
