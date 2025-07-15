
import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Download, Loader2, RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useHologramInitialization } from "./hooks/useHologramInitialization";
import { useImageLoader } from "./hooks/useImageLoader";
import { useCanvasAnimation } from "./hooks/useCanvasAnimation";

interface HologramAnimationProps {
  imageUrl: string;
  onClose: () => void;
}

export const HologramAnimation = ({ imageUrl, onClose }: HologramAnimationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  
  const [exportProgress, setExportProgress] = useState(0);
  const [recordedChunks, setRecordedChunks] = useState<BlobPart[]>([]);

  const {
    state,
    error,
    progress,
    setCanvasError,
    setImageError,
    setAnimationError,
    setReady,
    setRecording,
    updateProgress,
    reset
  } = useHologramInitialization();

  const canvasAnimation = useCanvasAnimation({
    onProgress: updateProgress,
    onReady: setReady,
    onError: setAnimationError
  });

  const { loadImage } = useImageLoader({
    onProgress: updateProgress,
    onSuccess: (image) => {
      console.log("Image loaded successfully, starting canvas initialization");
      imageRef.current = image;
      
      const canvas = canvasRef.current;
      if (!canvas) {
        setCanvasError("Canvas element not found");
        return;
      }

      console.log("Initializing canvas...");
      const ctx = canvasAnimation.initializeCanvas(canvas);
      if (!ctx) {
        setCanvasError("Failed to initialize canvas context");
        return;
      }
      
      ctxRef.current = ctx;
      
      console.log("Starting hologram animation...");
      canvasAnimation.startAnimation(image, canvas, ctx);
    },
    onError: setImageError
  });

  useEffect(() => {
    console.log("HologramAnimation: Starting initialization with imageUrl:", imageUrl);
    reset();
    loadImage(imageUrl);

    return () => {
      console.log("HologramAnimation: Cleaning up");
      canvasAnimation.stopAnimation();
    };
  }, [imageUrl, loadImage, canvasAnimation, reset]);

  const retry = () => {
    console.log("Retrying initialization");
    canvasAnimation.stopAnimation();
    reset();
    loadImage(imageUrl);
  };

  const startRecording = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imageRef.current || state !== 'ready') {
      toast.error("Animation not ready for recording");
      return;
    }

    try {
      const stream = canvas.captureStream(30);
      
      const supportedTypes = [
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8', 
        'video/webm',
        'video/mp4'
      ];
      
      let mimeType = '';
      for (const type of supportedTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          mimeType = type;
          break;
        }
      }
      
      if (!mimeType) {
        toast.error("No supported video format found");
        return;
      }

      const recorder = new MediaRecorder(stream, { mimeType });
      
      setRecordedChunks([]);
      setRecording();
      setExportProgress(0);

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setRecordedChunks((prev) => [...prev, e.data]);
        }
      };

      recorder.onstop = () => {
        setTimeout(() => {
          saveVideo(mimeType);
          stream.getTracks().forEach(track => track.stop());
        }, 100);
      };

      recorder.start(250);
      toast.success("Recording 5-second animation...");

      // Auto-stop after 5 seconds with progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 2;
        setExportProgress(progress);
        updateProgress(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          recorder.stop();
        }
      }, 100);

    } catch (error) {
      console.error("Recording error:", error);
      toast.error("Recording failed");
    }
  };

  const saveVideo = (mimeType: string) => {
    if (!recordedChunks.length) {
      toast.error("No recorded content");
      return;
    }

    const blob = new Blob(recordedChunks, { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hologram-dumpling-${Date.now()}.${mimeType.includes('webm') ? 'webm' : 'mp4'}`;
    
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Animation saved!");
    }, 100);
  };

  const getStatusMessage = () => {
    if (state === 'error' && error) {
      return `${error.type} error: ${error.message}`;
    }
    
    switch (state) {
      case 'initializing':
        return "Loading and setting up animation...";
      case 'ready':
        return "Hologram animation running - ready to record";
      case 'recording':
        return `Recording ${exportProgress}%`;
      default:
        return "Preparing...";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="relative bg-white rounded-lg shadow-xl p-4 max-w-3xl w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Hologram Animation</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex-grow overflow-auto flex items-center justify-center bg-black rounded min-h-[400px]">
          {state === 'initializing' ? (
            <div className="text-white text-center">
              <div className="h-8 w-8 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin mx-auto mb-2"></div>
              <p>Loading hologram animation...</p>
            </div>
          ) : state === 'error' ? (
            <div className="text-white text-center p-4">
              <p className="text-red-400 mb-2">⚠️ {getStatusMessage()}</p>
              <Button 
                onClick={retry}
                variant="outline"
                className="mt-2 bg-white text-black hover:bg-gray-200"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          ) : (
            <canvas 
              ref={canvasRef}
              className="max-w-full max-h-[60vh] object-contain border border-cyan-400 shadow-lg shadow-cyan-400/50"
              style={{ width: '400px', height: '400px' }}
            />
          )}
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {getStatusMessage()}
          </p>
          
          <Button
            onClick={startRecording}
            disabled={state !== 'ready'}
            className="flex items-center gap-2"
          >
            {state === 'recording' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Recording {exportProgress}%</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>Export Video</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
