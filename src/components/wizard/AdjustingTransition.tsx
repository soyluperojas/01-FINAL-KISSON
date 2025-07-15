import { useEffect } from "react";

interface AdjustingTransitionProps {
  onContinue: () => void;
}

const AdjustingTransition = ({ onContinue }: AdjustingTransitionProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onContinue();
    }, 1000); // 2 segundos

    return () => clearTimeout(timer);
  }, [onContinue]);

  return (
    <div className="fixed inset-0 z-50 bg-[#3A7A08] flex items-center justify-center">
      <img
        src="/images/adjusting.svg"
        alt="Adjusting"
        className="w-full max-w-2xl"
      />
    </div>
  );
};

export default AdjustingTransition;
