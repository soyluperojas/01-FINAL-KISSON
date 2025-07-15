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
        Before we start cooking, let's pause for a moment.
        <br />
        Imagine you're standing in front of an empty table. You can choose any
        type of dumpling and any emotional connection.
      </p>
    </div>
  );
};

export default PauseTransition;
