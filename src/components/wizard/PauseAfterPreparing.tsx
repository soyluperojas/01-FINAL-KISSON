import { useEffect } from "react";

interface PauseAfterPreparingProps {
  onContinue: () => void;
}

const PauseAfterPreparing = ({ onContinue }: PauseAfterPreparingProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onContinue();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onContinue]);

  return (
    <div className="fixed inset-0 z-20 bg-[#F73E00] flex items-center justify-center p-[100px] text-center">
      <p className="text-white text-[25pt] font-montserrat leading-relaxed">
        You've chosen what we're going to cook together.
        <br />
        Now it's time to prepare the ingredients that will give your story its flavors.
      </p>
    </div>
  );
};

export default PauseAfterPreparing;
