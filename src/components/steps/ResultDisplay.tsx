// ResultDisplay.tsx

import { useEffect, useState } from "react";
import { RecipeData } from "../RecipeWizard";

import { LoadingState } from "./result-display/LoadingState";
import { ActionButtons } from "./result-display/ActionButtons";
import { ShareableUrlManager } from "./result-display/ShareableUrlManager";
import { BackgroundContentGeneration } from "./result-display/BackgroundContentGeneration";
import { PrintPreviewLayout } from "./result-display/PrintPreviewLayout";
import { HiddenPrintElements } from "./result-display/HiddenPrintElements";
import { useResultDisplayState } from "./result-display/hooks/useResultDisplayState";
import { usePrintHandlers } from "./result-display/hooks/usePrintHandlers";

interface ResultDisplayProps {
  data: RecipeData;
  onFinish: () => void;
}

interface ExtendedRecipeData extends RecipeData {
  generatedTitle?: string;
  generatedRecipe?: string;
  generatedIngredients?: string[];
  generatedDescription?: string;
  storedImageUrl?: string;
  selectedVideoFile?: string;
}

const ResultDisplay = ({ data, onFinish }: ResultDisplayProps) => {
  const {
    recipeTitle,
    shareableUrl,
    isLoading,
    poeticIngredients,
    cookingRecipe,
    memoryDescription,
    recipeId,
    imageUrl,
    handleTitleGenerated,
    handlePoeticIngredientsGenerated,
    handleCookingRecipeGenerated,
    handleMemoryDescriptionGenerated,
    handleImageGenerated,
    handleUrlGenerated,
  } = useResultDisplayState();

  const { handlePrintThermal, handlePrintA4 } = usePrintHandlers(recipeTitle);
  const [selectedVideoName, setSelectedVideoName] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [videoWindow, setVideoWindow] = useState<Window | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preloadReady, setPreloadReady] = useState(false);

  const generateQrUrl = () => {
    if (recipeTitle && cookingRecipe && poeticIngredients.length > 0 && memoryDescription) {
      const recipeData = {
        recipeTitle,
        cookingRecipe,
        videoName: selectedVideoName || "1-organic-a.mp4"
      };
      const encodedData = encodeURIComponent(JSON.stringify(recipeData));
      return `${window.location.origin}/qr-view/${recipeId}?data=${encodedData}`;
    }
    return `${window.location.origin}/qr-view/${recipeId}`;
  };

  const qrUrl = `${window.location.origin}/qr-view/${recipeId}`;

  useEffect(() => {
    if (
      recipeTitle &&
      cookingRecipe &&
      poeticIngredients.length > 0 &&
      memoryDescription
    ) {
      setPreloadReady(true);
    }
  }, [recipeTitle, cookingRecipe, poeticIngredients, memoryDescription]);

  const isRecipeComplete = () => preloadReady;

  const handlePlayVideo = () => {
    if (!isRecipeComplete() || isSubmitting) {
      console.warn("❌ La receta no está completa o estás enviando muy rápido.");
      return;
    }

    setIsSubmitting(true);

    const shapeValue = data.shape?.value || "surprise";
    const timeValue = data.serveTime?.toLowerCase() || "present";

    const isPastOrPresent = ["distant past", "recent past", "present"].includes(timeValue);

    const shapeMap: Record<string, number> = {
      organic: 1,
      bundle: 2,
      triangle: 3,
      oval: 4,
      star: 5,
      envelope: 6
    };

    const videoBank: Record<string, string[]> = {
      organic: ["a", "b", "c", "d"],
      bundle: ["a", "b", "c", "d"],
      triangle: ["a", "b"],
      oval: ["a", "b", "c", "d", "e", "f"],
      star: ["a", "b", "c", "d"],
      envelope: ["a", "b", "c", "d", "e", "f"]
    };

    const shapeNumber = shapeMap[shapeValue] || 1;
    const letterPool = videoBank[shapeValue] || ["a"];
    const randomLetter = letterPool[Math.floor(Math.random() * letterPool.length)];
    const prefix = isPastOrPresent ? `${shapeNumber}0` : `${shapeNumber}`;
    const selectedVideo = shapeValue === "surprise"
      ? `${Math.floor(Math.random() * 6) + 1}-${"organic"}-a`
      : `${prefix}-${shapeValue}-${randomLetter}`;

    setSelectedVideoName(`${selectedVideo}.mp4`);
    const storedImageUrl = `/images/${selectedVideo}.png`;

    const fullRecipe = {
      id: recipeId,
      title: recipeTitle,
      text: cookingRecipe,
      ingredients: poeticIngredients,
      description: memoryDescription,
      video: `${selectedVideo}.mp4`,
      image: storedImageUrl,
      url: qrUrl
    };

    localStorage.setItem(`recipe-${recipeId}`, JSON.stringify(fullRecipe));
    localStorage.setItem(recipeId, JSON.stringify({
      recipeTitle,
      cookingRecipe,
      videoName: `${selectedVideo}.mp4`
    }));

    setShowPreview(true);

    let popup = videoWindow;

    if (!popup || popup.closed) {
      popup = window.open("", "VideoWindow", `width=800,height=800`);
      setVideoWindow(popup);
    }
    
    if (popup) {
      popup.document.body.innerHTML = `
        <video 
          src="/videos/${selectedVideo}.mp4" 
          autoplay 
          loop 
          muted 
          style="margin:0;max-width:100%;max-height:100%;display:flex;justify-content:center;align-items:center;height:100vh;background:#000" 
        ></video>
      `;
      
    }

    setTimeout(() => setIsSubmitting(false), 3000);
  };

  const extendedData: ExtendedRecipeData = {
    ...data,
    generatedTitle: recipeTitle,
    generatedRecipe: cookingRecipe,
    generatedIngredients: poeticIngredients,
    generatedDescription: memoryDescription,
    storedImageUrl: selectedVideoName
      ? `/images/${selectedVideoName.replace(".mp4", ".png")}`
      : "",
    selectedVideoFile: selectedVideoName || ""
  };

  return (
    <div className="space-y-4 animate-fade-in max-w-6xl mx-auto text-white">
      <div className="text-center mb-6 no-print">
        <h2 className="font-display text-white text-5xl font-extrabold">Your Memory Recipe</h2>
        <p className="text-muted-foreground text-white/80 text-2xl font-extrabold">
          The recipe is ready, may its quiet voice be deeply felt.
        </p>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : (
        <>
          <ShareableUrlManager
            data={data}
            recipeTitle={recipeTitle}
            cookingRecipe={cookingRecipe}
            poeticIngredients={poeticIngredients}
            memoryDescription={memoryDescription}
            recipeId={recipeId}
            onUrlGenerated={handleUrlGenerated}
          />

          {showPreview && (
            <>
              <PrintPreviewLayout
                extendedData={extendedData}
                shareableUrl={qrUrl}
                recipeTitle={recipeTitle}
                cookingRecipe={cookingRecipe}
                memoryDescription={memoryDescription}
                imageUrl={extendedData.storedImageUrl || ""}
                selectedVideoName={selectedVideoName || ""}
              />

              <ActionButtons
                shareableUrl={qrUrl}
                recipeTitle={recipeTitle}
                onFinish={onFinish}
                onPrintThermal={handlePrintThermal}
                onPrintA4={handlePrintA4}
              />

              <HiddenPrintElements
                extendedData={extendedData}
                shareableUrl={qrUrl}
                recipeTitle={recipeTitle}
                cookingRecipe={cookingRecipe}
                memoryDescription={memoryDescription}
                imageUrl={extendedData.storedImageUrl || ""}
              />
            </>
          )}

          <div className="text-center no-print mt-8">
            {!preloadReady && !isSubmitting && (
              <div className="mb-2">
                <span className="text-xs text-white/80">Just a sec—your memory’s finding its form!</span>
              </div>
            )}
            <button
              onClick={handlePlayVideo}
              disabled={!isRecipeComplete() || isSubmitting}
              style={{
                backgroundColor: isRecipeComplete() ? "#D40018" : "#999",
                color: "white",
                fontWeight: "bold",
                fontSize: "16px",
                padding: "12px 24px",
                borderRadius: "8px",
                border: "none",
                cursor: isRecipeComplete() ? "pointer" : "not-allowed",
                opacity: isRecipeComplete() ? 1 : 0.5
              }}
            >
              {isSubmitting ? "Generating..." : preloadReady ? "·NOW Play Memory Video·" : "Preparing..."}
            </button>
          </div>

          <BackgroundContentGeneration
            data={data}
            recipeTitle={recipeTitle}
            shareableUrl={qrUrl}
            recipeId={recipeId}
            poeticIngredients={poeticIngredients}
            onTitleGenerated={handleTitleGenerated}
            onPoeticIngredientsGenerated={handlePoeticIngredientsGenerated}
            onCookingRecipeGenerated={handleCookingRecipeGenerated}
            onMemoryDescriptionGenerated={handleMemoryDescriptionGenerated}
            onImageGenerated={() => {}}
          />
        </>
      )}
    </div>
  );
};

export default ResultDisplay;
