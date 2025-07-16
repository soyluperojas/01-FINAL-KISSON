import { useEffect } from "react";

interface PauseAfterAdjustingProps {
  onContinue: () => void;
}

const PauseAfterAdjusting = ({ onContinue }: PauseAfterAdjustingProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onContinue();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onContinue]);

  return (
    <div className="fixed inset-0 z-20 bg-[#63B21F] flex items-center justify-center p-[100px] text-center">
      <p className="text-white text-[25pt] font-montserrat leading-relaxed">
        Adjust how deeply this memory is felt set method, shape, and flavor.
      </p>
    </div>
  );
};

export default PauseAfterAdjusting;
