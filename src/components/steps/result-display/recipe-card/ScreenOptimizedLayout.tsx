
import { useState, useEffect } from 'react';

interface ScreenOptimizedLayoutProps {
  recipeTitle: string;
  memoryDescription: string;
  cookingRecipe: string;
  shareableUrl: string;
}

export const ScreenOptimizedLayout = ({
  recipeTitle,
  memoryDescription,
  cookingRecipe,
  shareableUrl
}: ScreenOptimizedLayoutProps) => {
  return (
    <div 
      className="w-full h-full relative bg-white text-black screen-layout"
      style={{ 
        width: '4in', 
        height: '6in',
        padding: '0.25in',
        fontFamily: 'Arial, sans-serif',
        fontSize: '9pt',
        lineHeight: '1.3',
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}
    >
      {/* Prominent QR Code - Top Right Corner */}
      <div style={{
        position: 'absolute',
        top: '0.15in',
        right: '0.15in',
        width: '0.8in',
        height: '0.8in',
        zIndex: 10,
        background: 'white',
        border: '1px solid #ddd',
        borderRadius: '4px',
        padding: '4px'
      }}>
        <img 
          src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(shareableUrl)}`}
          alt="QR Code"
          style={{ 
            width: '100%',
            height: '100%'
          }}
        />
      </div>

      {/* Prominent Logo - Bottom Right Corner */}
      <div style={{
        position: 'absolute',
        bottom: '0.15in',
        right: '0.15in',
        width: '0.8in',
        height: '0.8in',
        zIndex: 10,
        background: 'white',
        border: '1px solid #ddd',
        borderRadius: '4px',
        padding: '4px'
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

      {/* Main Content Area - Visually appealing layout */}
      <div style={{
        paddingRight: '1.0in', // Space for QR code
        paddingBottom: '1.0in', // Space for logo
        height: '100%'
      }}>
        
        {/* Elegant Title */}
        <div style={{
          fontSize: '14pt',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '0.2in',
          lineHeight: '1.2',
          color: '#333'
        }}>
          {recipeTitle || "Memory Recipe"}
        </div>

        {/* Readable Memory Description */}
        <div style={{
          fontSize: '8pt',
          fontStyle: 'italic',
          marginBottom: '0.2in',
          lineHeight: '1.3',
          textAlign: 'justify',
          color: '#555',
          background: '#f9f9f9',
          padding: '0.1in',
          borderRadius: '4px'
        }}>
          {memoryDescription}
        </div>

        {/* Well-formatted Recipe Content */}
        <div style={{
          fontSize: '8pt',
          lineHeight: '1.3',
          textAlign: 'left',
          color: '#333',
          background: '#fafafa',
          padding: '0.1in',
          borderRadius: '4px',
          border: '1px solid #eee'
        }}>
          {cookingRecipe ? (
            cookingRecipe.split('\n').map((line, index) => (
              <div key={index} style={{ 
                marginBottom: '4pt',
                paddingLeft: line.trim().startsWith('-') || line.trim().startsWith('•') ? '8pt' : '0'
              }}>
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
