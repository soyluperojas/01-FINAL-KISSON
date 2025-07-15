import { Button } from "@/components/ui/button";
import { ArrowRight, RefreshCcw } from "lucide-react";
import { RecipeData } from "./types";

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  recipeData: RecipeData;
  onPrevious: () => void;
  onNext: () => void;
  onReset: () => void;
}

export const NavigationButtons = ({
  currentStep,
  totalSteps,
  recipeData,
  onPrevious, // aunque no se use, lo dejamos por compatibilidad
  onNext,
  onReset
}: NavigationButtonsProps) => {
  const hasMemorySelected = recipeData.memoryType !== "";

  // ✅ 👉 Si estamos en el último paso, ya no renderizamos este componente
  if (currentStep === totalSteps) {
    return null;
  }

  return (
    <div className="flex justify-end mt-6 mb-12">
      <Button 
        variant="black-orange-glow"
        onClick={onNext} 
        className="flex items-center gap-2 font-bold"
      >
        Next <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
