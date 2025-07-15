
interface RecipeCardLogoProps {
  className?: string;
}

export const RecipeCardLogo = ({ className }: RecipeCardLogoProps) => {
  return (
    <div className={`logo-container absolute bottom-2 right-2 print:bottom-2 print:right-2 z-10 ${className}`} 
         style={{ 
           width: '1.2in', 
           height: '1.2in',
           maxWidth: '1.2in',
           maxHeight: '1.2in',
           padding: '8px',
           backgroundColor: 'white',
           borderRadius: '4px'
         }}>
      <img 
        src="/lovable-uploads/7d0c86e8-de4d-46a1-ab91-4fb74602093c.png"
        alt="KissOn Logo"
        className="w-full h-full object-contain print:opacity-100"
        style={{ 
          width: 'calc(1.2in - 16px)', 
          height: 'calc(1.2in - 16px)',
          display: 'block'
        }}
      />
    </div>
  );
};
