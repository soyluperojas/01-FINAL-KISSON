
import { useState } from "react";
import { RecipeData, initialRecipeState } from "./types";

export const useWizardState = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [recipeData, setRecipeData] = useState<RecipeData>(initialRecipeState);

  const updateRecipeData = (data: Partial<RecipeData>) => {
    setRecipeData(prev => ({
      ...prev,
      ...data
    }));
  };

  const resetWizard = () => {
    console.log("Resetting wizard...");
    setRecipeData(initialRecipeState);
    setCurrentStep(0);
  };

  const jumpToStep = (step: number) => {
    console.log("Jumping to step:", step);
    setCurrentStep(step);
  };

  return {
    currentStep,
    setCurrentStep,
    recipeData,
    updateRecipeData,
    resetWizard,
    jumpToStep
  };
};
