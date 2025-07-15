import { Card } from "@/components/ui/card";
import StepIndicator from "./StepIndicator";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { useWizardState } from "./wizard/useWizardState";
import { useStepTransitions } from "./wizard/useStepTransitions";
import { useBodyClasses } from "./wizard/useBodyClasses";
import { WizardHeader } from "./wizard/WizardHeader";
import { NavigationButtons } from "./wizard/NavigationButtons";
import { StepRenderer } from "./wizard/StepRenderer";
import { steps } from "./wizard/types";

// Re-export types for backward compatibility
export type { RecipeData, UserPreferences } from "./wizard/types";

const RecipeWizard = () => {
  const {
    currentStep,
    setCurrentStep,
    recipeData,
    updateRecipeData,
    resetWizard,
    jumpToStep
  } = useWizardState();

  const {
    direction,
    setDirection,
    animateStepChange,
    getTransitionClass
  } = useStepTransitions();

  useBodyClasses(currentStep);

  const nextStep = () => {
    if (currentStep < steps.length) {
      setDirection("forward");
      animateStepChange(() => {
        setCurrentStep(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setDirection("backward");
      animateStepChange(() => {
        setCurrentStep(prev => prev - 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  };

  const handleResetWizard = () => {
    setDirection("forward");
    animateStepChange(() => {
      resetWizard();
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.success("Recipe wizard has been reset", {
        position: "top-center",
        duration: 3000
      });
    });
  };

  const handleSurpriseMe = () => {
    setDirection("forward");
    animateStepChange(() => {
      jumpToStep(5); // Jump directly to ResultDisplay (step 5)
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.success("Surprise recipe generated!", {
        position: "top-center",
        duration: 3000
      });
    });
  };

  return (
    <div
      className="mx-auto py-8 min-h-screen flex flex-col relative transition-colors duration-300"
      style={{
        backgroundColor: "#000000",
        paddingLeft: "180px",
        paddingRight: "180px"
      }}
    >
      {/* Background grid pattern */}
      <div className="absolute inset-0 pointer-events-none grid-bg opacity-30 -z-10"></div>

      {/* Header with logo - CENTERED */}
      <div className="w-full flex justify-center items-center mb-8">
        <WizardHeader />
      </div>

      <div className="main-content flex-grow" style={{ backgroundColor: "transparent" }}>
        <StepIndicator currentStep={currentStep} totalSteps={steps.length} stepTitles={steps} />

        <Card className={cn("p-6 my-8 bg-transparent shadow-none border-none", getTransitionClass())}>
          <StepRenderer 
            currentStep={currentStep}
            recipeData={recipeData}
            updateData={updateRecipeData}
            onFinish={handleResetWizard}
            onSurpriseMe={handleSurpriseMe}
          />
        </Card>

        <NavigationButtons
          currentStep={currentStep}
          totalSteps={steps.length}
          recipeData={recipeData}
          onPrevious={prevStep}
          onNext={nextStep}
          onReset={handleResetWizard}
        />
      </div>
    </div>
  );
};

export default RecipeWizard;
