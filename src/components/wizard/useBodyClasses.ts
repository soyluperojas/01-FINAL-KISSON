
import { useEffect } from "react";

export const useBodyClasses = (currentStep: number) => {
  // Apply step classes to body element
  useEffect(() => {
    const body = document.body;

    // Remove all existing step classes
    body.classList.remove('step-0-bg', 'step-1-bg', 'step-2-bg', 'step-3-bg', 'step-0-text', 'step-1-text', 'step-2-text', 'step-3-text');

    // Apply current step classes if within steps 0-3
    if (currentStep >= 0 && currentStep <= 3) {
      body.classList.add(`step-${currentStep}-bg`, `step-${currentStep}-text`);
      console.log(`Applied classes: step-${currentStep}-bg, step-${currentStep}-text`);
    }

    // Cleanup function to remove classes when component unmounts
    return () => {
      body.classList.remove('step-0-bg', 'step-1-bg', 'step-2-bg', 'step-3-bg', 'step-0-text', 'step-1-text', 'step-2-text', 'step-3-text');
    };
  }, [currentStep]);
};
