// src/components/wizard/PresentationTransition.tsx
import { useEffect } from "react";

interface PresentationTransitionProps {
  onContinue: () => void;
}

const PresentationTransition = ({ onContinue }: PresentationTransitionProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onContinue(); // Avanza después de 4 segundos
    }, 1000);

    return () => clearTimeout(timer);
  }, [onContinue]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <img
        src="/images/presentation.svg"
        alt="Presentation"
        className="w-full max-w-2xl"
      />
    </div>
  );
};

export default PresentationTransition;
