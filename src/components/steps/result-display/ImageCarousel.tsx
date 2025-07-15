
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ImageDisplay } from "./ImageDisplay";

interface ImageCarouselProps {
  images: string[];
  recipeTitle: string;
  onImageSelected: (imageUrl: string) => void;
  onImageLoad: () => void;
  onImageError: () => void;
}

export const ImageCarousel = ({ 
  images, 
  recipeTitle, 
  onImageSelected, 
  onImageLoad, 
  onImageError 
}: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const selectCurrentImage = () => {
    onImageSelected(images[currentIndex]);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <ImageDisplay
          imageUrl={images[currentIndex]}
          recipeTitle={recipeTitle}
          onImageLoad={onImageLoad}
          onImageError={onImageError}
        />
        
        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 border-white/20 text-white hover:bg-black/70"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 border-white/20 text-white hover:bg-black/70"
              onClick={goToNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
      
      {/* Image counter and selection */}
      <div className="text-center space-y-2">
        {images.length > 1 && (
          <p className="text-sm text-white/70">
            Image {currentIndex + 1} of {images.length}
          </p>
        )}
        
        <Button 
          onClick={selectCurrentImage}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          Use This Image
        </Button>
      </div>
      
      {/* Thumbnail dots */}
      {images.length > 1 && (
        <div className="flex justify-center space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex 
                  ? 'bg-orange-500' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
