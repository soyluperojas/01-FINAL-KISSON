
import { useState } from "react";
import { generateImage } from "@/services/imageGenerationService";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

export const ImageTestGenerator = () => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateImage = async () => {
    setIsGenerating(true);
    console.log("Starting test image generation...");
    
    try {
      // Generate a simple dumpling image with emphasis on black background
      const generatedImageUrl = await generateImage(
        "A beautiful memory dumpling with warm colors",
        "organic",
        ["saffron", "honey", "vanilla"],
        "gentle",
        "test-recipe-id"
      );
      
      console.log("Generated image URL:", generatedImageUrl);
      setImageUrl(generatedImageUrl);
      toast.success("Image generated successfully!");
    } catch (error) {
      console.error("Image generation failed:", error);
      toast.error("Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-4">Test Image Generation</h3>
      
      <Button 
        onClick={handleGenerateImage} 
        disabled={isGenerating}
        className="w-full mb-4"
      >
        {isGenerating ? "Generating..." : "Generate Test Image"}
      </Button>
      
      {imageUrl && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Generated Image:</p>
          <img 
            src={imageUrl} 
            alt="Generated dumpling" 
            className="w-full h-64 object-cover rounded border"
            onError={(e) => {
              console.error("Image failed to load:", imageUrl);
              toast.error("Image failed to load");
            }}
          />
          <p className="text-xs text-gray-500 mt-2 break-all">URL: {imageUrl}</p>
        </div>
      )}
      
      {isGenerating && (
        <div className="flex items-center justify-center p-4">
          <div className="h-8 w-8 rounded-full border-4 border-orange-500 border-t-transparent animate-spin"></div>
        </div>
      )}
    </div>
  );
};
