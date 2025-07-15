import { useEffect } from "react";

interface PauseAfterPresentationProps {
  onContinue: () => void;
}

const PauseAfterPresentation = ({ onContinue }: PauseAfterPresentationProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onContinue();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onContinue]);

  return (
    <div className="fixed inset-0 z-20 bg-[#000000] flex items-center justify-center p-[100px] text-center">
      <p className="text-white text-[25pt] font-montserrat leading-relaxed">
        Your dish is almost ready.
        <br />
        It has been created with memory, emotion, and care.
      </p>
    </div>
  );
};

export default PauseAfterPresentation;
