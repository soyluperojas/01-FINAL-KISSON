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
        How intensely should this memory be experienced?
        <br />
        Drag the knobs to adjust cooking method, shape, and flavor approach.
      </p>
    </div>
  );
};

export default PauseAfterAdjusting;
