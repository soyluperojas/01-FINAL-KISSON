// src/components/wizard/CookingTransition.tsx

import { useEffect } from "react";

interface CookingTransitionProps {
  onContinue: () => void;
}

const CookingTransition = ({ onContinue }: CookingTransitionProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onContinue();
    }, 1000); // 3 segundos

    return () => clearTimeout(timer);
  }, [onContinue]);

  return (
    <div className="fixed inset-0 z-20 bg-[#DBA409] flex items-center justify-center">
      <img
        src="/images/cooking.svg"
        alt="Cooking"
        className="w-full max-w-2xl"
      />
    </div>
  );
};

export default CookingTransition;
