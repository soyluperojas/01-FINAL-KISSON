
import { useCallback } from 'react';

interface UseImageLoaderProps {
  onProgress: (progress: number) => void;
  onSuccess: (image: HTMLImageElement) => void;
  onError: (message: string) => void;
}

export const useImageLoader = ({ onProgress, onSuccess, onError }: UseImageLoaderProps) => {
  const loadImage = useCallback((imageUrl: string) => {
    console.log("Starting image load for:", imageUrl);
    onProgress(10);

    if (!imageUrl) {
      onError("No image URL provided");
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    
    const timeout = setTimeout(() => {
      onError("Image loading timeout (10 seconds)");
    }, 10000);

    img.onload = () => {
      console.log("Image loaded successfully");
      clearTimeout(timeout);
      onProgress(50);
      
      // Validate image dimensions
      if (img.width === 0 || img.height === 0) {
        onError("Invalid image dimensions");
        return;
      }
      
      onSuccess(img);
    };

    img.onerror = (e) => {
      console.error("Image failed to load:", e);
      clearTimeout(timeout);
      onError("Failed to load image - check URL or network connection");
    };

    img.src = imageUrl;
  }, [onProgress, onSuccess, onError]);

  return { loadImage };
};
