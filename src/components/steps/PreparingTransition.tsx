import { useEffect } from "react";

interface PreparingTransitionProps {
  onContinue: () => void;
}

const PreparingTransition = ({ onContinue }: PreparingTransitionProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onContinue();
    }, 2000); // 2 segundos

    return () => clearTimeout(timer);
  }, [onContinue]);

  return (
    <div className="fixed inset-0 z-50 bg-[#F73E00] flex items-center justify-center">
      <img
        src="/images/preparing.svg"
        alt="Preparing"
        className="w-full max-w-2xl px-[90px]"
      />
    </div>
  );
};

export default PreparingTransition;
