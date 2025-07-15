
import { useState } from "react";

export const useImageLoadingState = () => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [hasValidImage, setHasValidImage] = useState(false);
  const [showApiError, setShowApiError] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleImageError = () => {
    console.log("=== DEBUG: Image failed to load ===");
    console.log("Failed URL:", imageUrl);
    setHasValidImage(false);
    setShowApiError(true);
  };

  const handleImageLoad = () => {
    console.log("=== DEBUG: Image loaded successfully ===");
    console.log("Loaded URL:", imageUrl);
    setHasValidImage(true);
    setShowApiError(false);
    setErrorMessage("");
  };

  const setGeneratingState = (generating: boolean) => {
    setIsGenerating(generating);
    if (generating) {
      setShowApiError(false);
      setErrorMessage("");
    }
  };

  const setImageSuccess = (url: string) => {
    setImageUrl(url);
    setHasValidImage(true);
    setShowApiError(false);
    setIsGenerating(false);
    setErrorMessage("");
  };

  const setImageFailure = (error?: string) => {
    setShowApiError(true);
    setHasValidImage(false);
    setIsGenerating(false);
    setErrorMessage(error || "");
  };

  return {
    imageUrl,
    hasValidImage,
    showApiError,
    isGenerating,
    errorMessage,
    setImageUrl,
    setHasValidImage,
    setShowApiError,
    setGeneratingState,
    setImageSuccess,
    setImageFailure,
    handleImageError,
    handleImageLoad
  };
};
