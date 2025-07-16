// src/components/wizard/PauseTransition.tsx

import { useEffect } from "react";

interface PauseTransitionProps {
  onContinue: () => void;
}

const PauseTransition = ({ onContinue }: PauseTransitionProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onContinue();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onContinue]);

  return (
    <div className="fixed inset-0 z-20 bg-[#D40018] flex items-center justify-center p-[100px] text-center">
      <p className="text-white text-[25pt] font-montserrat leading-relaxed">
        Before cooking, pause and imagine an empty table. 
        <br />
        You can choose any dumpling and any emotion.
      </p>
    </div>
  );
};

export default PauseTransition;
