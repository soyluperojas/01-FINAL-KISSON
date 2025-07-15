
import { useState, useEffect } from 'react';

interface SimpleReferenceLayoutProps {
  recipeTitle: string;
  memoryDescription: string;
  cookingRecipe: string;
  shareableUrl: string;
}

export const SimpleReferenceLayout = ({
  recipeTitle,
  memoryDescription,
  cookingRecipe,
  shareableUrl
}: SimpleReferenceLayoutProps) => {
  return (
    <div 
      className="w-full h-full relative bg-white text-black"
      style={{ 
        width: '4in', 
        height: '6in',
        padding: '0.2in',
        fontFamily: 'Arial, sans-serif',
        fontSize: '8pt',
        lineHeight: '1.2'
      }}
    >
      {/* QR Code - Top Right Corner */}
      <div style={{
        position: 'absolute',
        top: '0.1in',
        right: '0.1in',
        width: '0.7in',
        height: '0.7in',
        zIndex: 10
      }}>
        <img 
          src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(shareableUrl)}`}
          alt="QR Code"
          style={{ 
            width: '100%',
            height: '100%'
          }}
        />
      </div>

      {/* Logo - Bottom Right Corner */}
      <div style={{
        position: 'absolute',
        bottom: '0.1in',
        right: '0.1in',
        width: '0.7in',
        height: '0.7in',
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

      {/* Main Content Area */}
      <div style={{
        paddingRight: '0.9in', // Space for QR code
        paddingBottom: '0.9in', // Space for logo
        height: '100%'
      }}>
        
        {/* Title */}
        <div style={{
          fontSize: '12pt',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '0.15in',
          lineHeight: '1.1'
        }}>
          {recipeTitle || "Memory Recipe"}
        </div>

        {/* Memory Description */}
        <div style={{
          fontSize: '7pt',
          fontStyle: 'italic',
          marginBottom: '0.15in',
          lineHeight: '1.1',
          textAlign: 'justify'
        }}>
          {memoryDescription}
        </div>

        {/* Recipe Content */}
        <div style={{
          fontSize: '7pt',
          lineHeight: '1.1',
          textAlign: 'left'
        }}>
          {cookingRecipe ? (
            cookingRecipe.split('\n').map((line, index) => (
              <div key={index} style={{ marginBottom: '2pt' }}>
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
