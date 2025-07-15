
interface ImageDisplayProps {
  imageUrl: string;
  recipeTitle: string;
  onImageLoad: () => void;
  onImageError: () => void;
}

export const ImageDisplay = ({ imageUrl, recipeTitle, onImageLoad, onImageError }: ImageDisplayProps) => {
  return (
    <div className="w-full bg-slate-100 rounded-lg overflow-hidden"
         style={{ aspectRatio: '1/1', minHeight: '0' }}>
      <img 
        src={imageUrl} 
        alt={recipeTitle || "Memory Recipe"}
        className="w-full h-full object-cover transition-opacity duration-500 opacity-0 animate-fade-in"
        style={{ 
          width: '100%', 
          height: '100%',
          objectFit: 'cover'
        }}
        onError={(e) => {
          console.error("Image failed to load:", imageUrl);
          onImageError();
        }}
        onLoad={(e) => {
          console.log("Image loaded successfully:", imageUrl);
          (e.target as HTMLImageElement).style.opacity = "1";
          onImageLoad();
        }}
      />
    </div>
  );
};
