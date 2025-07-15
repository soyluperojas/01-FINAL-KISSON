
import { useRef, useCallback } from 'react';

interface UseCanvasAnimationProps {
  onProgress: (progress: number) => void;
  onReady: () => void;
  onError: (message: string) => void;
}

export const useCanvasAnimation = ({ onProgress, onReady, onError }: UseCanvasAnimationProps) => {
  const animationRef = useRef<number>(0);

  const initializeCanvas = useCallback((canvas: HTMLCanvasElement) => {
    console.log("Initializing canvas");
    onProgress(60);

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      onError("Cannot get canvas context - browser may not support canvas");
      return null;
    }

    // Setup canvas
    canvas.width = 400;
    canvas.height = 400;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    console.log("Canvas initialized successfully");
    onProgress(70);
    return ctx;
  }, [onProgress, onError]);

  const startAnimation = useCallback((
    image: HTMLImageElement, 
    canvas: HTMLCanvasElement, 
    ctx: CanvasRenderingContext2D
  ) => {
    console.log("Starting animation with image:", image.width, "x", image.height);
    onProgress(90);

    let rotation = 0;
    
    const animate = () => {
      try {
        // Clear canvas with black background
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Save context
        ctx.save();
        
        // Move to center and rotate
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(rotation);
        
        // Calculate scale to fit image in canvas
        const maxSize = Math.min(canvas.width, canvas.height) * 0.7;
        const scale = Math.min(maxSize / image.width, maxSize / image.height);
        const scaledWidth = image.width * scale;
        const scaledHeight = image.height * scale;
        
        // Draw image centered
        ctx.drawImage(image, -scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight);
        
        // Add hologram effect - glowing cyan overlay
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = '#00ffff';
        ctx.fillRect(-scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight);
        
        // Add scanning lines
        ctx.globalAlpha = 0.5;
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 2;
        for (let i = 0; i < scaledHeight; i += 20) {
          ctx.beginPath();
          ctx.moveTo(-scaledWidth / 2, -scaledHeight / 2 + i);
          ctx.lineTo(scaledWidth / 2, -scaledHeight / 2 + i);
          ctx.stroke();
        }
        
        // Restore context
        ctx.restore();
        
        // Update rotation
        rotation += 0.02;
        
        // Continue animation
        animationRef.current = requestAnimationFrame(animate);
      } catch (error) {
        console.error("Animation error:", error);
        onError("Animation rendering failed");
      }
    };
    
    // Start the animation immediately
    animate();
    console.log("Animation started successfully");
    
    // Mark as ready after animation starts
    setTimeout(() => {
      onReady();
    }, 100);
  }, [onReady, onError, onProgress]);

  const stopAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = 0;
      console.log("Animation stopped");
    }
  }, []);

  return {
    initializeCanvas,
    startAnimation,
    stopAnimation
  };
};
