import React, { useState } from "react";

// Componentes de cada paso
import MemorySelection from "../steps/MemorySelection";
import IngredientsSelection from "../steps/IngredientsSelection";
import DedicationSelection from "../steps/DedicationSelection";
import IntensitySelection from "../steps/IntensitySelection";
import FinalEmotionSelection from "../steps/FinalEmotionSelection";
import ResultDisplay from "../steps/ResultDisplay";

// Transiciones visuales
import Step1Video from "./Step1Video";
import PreparingTransition from "./PreparingTransition";
import Step2Video from "./Step2Video";
import CookingTransition from "./CookingTransition";
import Step3Video from "./Step3Video";
import AdjustingTransition from "./AdjustingTransition";
import Step4Video from "./Step4Video";
import PresentationTransition from "./PresentationTransition";
import Step5Video from "./Step5Video";

// Pausas intermedias personalizadas
import PauseTransition from "./PauseTransition";
import PauseAfterPreparing from "./PauseAfterPreparing";
import PauseAfterCooking from "./PauseAfterCooking";
import PauseAfterAdjusting from "./PauseAfterAdjusting";
import PauseAfterPresentation from "./PauseAfterPresentation";

// Tipado de props
interface StepRendererProps {
  currentStep: number;
  recipeData: any;
  updateData: (data: Partial<any>) => void;
  onFinish: () => void;
  onSurpriseMe?: () => void;
}

export const StepRenderer = ({
  currentStep,
  recipeData,
  updateData,
  onFinish,
  onSurpriseMe,
}: StepRendererProps) => {
  const [hasShownPauseBeforeMemory, setHasShownPauseBeforeMemory] = useState(false);
  const [hasShownStep1Video, setHasShownStep1Video] = useState(false);
  const [hasShownPreparing, setHasShownPreparing] = useState(false);
  const [hasShownStep2Video, setHasShownStep2Video] = useState(false);
  const [hasShownPauseAfterPreparing, setHasShownPauseAfterPreparing] = useState(false);
  const [hasShownStep3Video, setHasShownStep3Video] = useState(false);
  const [hasShownCooking, setHasShownCooking] = useState(false);
  const [hasShownStep4Video, setHasShownStep4Video] = useState(false)
  const [hasShownPauseAfterCooking, setHasShownPauseAfterCooking] = useState(false);
  const [hasShownStep5Video, setHasShownStep5Video] = useState(false);
  const [hasShownAdjusting, setHasShownAdjusting] = useState(false);
  const [hasShownPauseAfterAdjusting, setHasShownPauseAfterAdjusting] = useState(false);
  const [hasShownPresentation, setHasShownPresentation] = useState(false);
  const [hasShownPauseAfterPresentation, setHasShownPauseAfterPresentation] = useState(false);

  // Paso -1: Pausa antes de elegir memoria
  if (currentStep === 0 && !hasShownPauseBeforeMemory) {
    return <PauseTransition onContinue={() => setHasShownPauseBeforeMemory(true)} />;
  }

  // Paso 0: Selección de memoria
  if (currentStep === 0) {
    return <MemorySelection updateData={updateData} data={recipeData} />;
  }

  // Paso 1: Ingredientes
  if (currentStep === 1) {
    if (!hasShownStep1Video) {
      return <Step1Video onContinue={() => setHasShownStep1Video(true)} />;
    }
    if (!hasShownPreparing) {
      return <PreparingTransition onContinue={() => setHasShownPreparing(true)} />;
    }
    if (!hasShownPauseAfterPreparing) {
      return <PauseAfterPreparing onContinue={() => setHasShownPauseAfterPreparing(true)} />;
    }
    return <IngredientsSelection updateData={updateData} data={recipeData} />;
  }

  // Paso 2: Dedicación
  if (currentStep === 2) {
  if (!hasShownStep2Video) {
    return <Step2Video onContinue={() => setHasShownStep2Video(true)} />;
  }
  if (!hasShownCooking) {
    return <CookingTransition onContinue={() => setHasShownCooking(true)} />;
  }
  if (!hasShownPauseAfterCooking) {
    return <PauseAfterCooking onContinue={() => setHasShownPauseAfterCooking(true)} />;
  }
  return <DedicationSelection updateData={updateData} data={recipeData} />;
}

  // Paso 3: Intensidad
  if (currentStep === 3) {
  if (!hasShownStep3Video) {
    return <Step3Video onContinue={() => setHasShownStep3Video(true)} />;
  }
  if (!hasShownAdjusting) {
    return <AdjustingTransition onContinue={() => setHasShownAdjusting(true)} />;
  }
  if (!hasShownPauseAfterAdjusting) {
    return <PauseAfterAdjusting onContinue={() => setHasShownPauseAfterAdjusting(true)} />;
  }
  return (
    <IntensitySelection
      updateData={updateData}
      data={recipeData}
      onSurpriseMe={onSurpriseMe}
    />
  );
}

  // Paso 4: Emoción final
  if (currentStep === 4) {
  if (!hasShownStep4Video) {
    return <Step4Video onContinue={() => setHasShownStep4Video(true)} />;
  }
  if (!hasShownPresentation) {
    return <PresentationTransition onContinue={() => setHasShownPresentation(true)} />;
  }
  if (!hasShownPauseAfterPresentation) {
    return <PauseAfterPresentation onContinue={() => setHasShownPauseAfterPresentation(true)} />;
  }
  return <FinalEmotionSelection updateData={updateData} data={recipeData} />;
}

  // Paso 5: Resultado final
  if (currentStep === 5) {
  if (!hasShownStep5Video) {
    return <Step5Video onContinue={() => setHasShownStep5Video(true)} />;
  }
  return <ResultDisplay data={recipeData} onFinish={onFinish} />;
}

  return null;
};
