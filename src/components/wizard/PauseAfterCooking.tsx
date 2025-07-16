import { useEffect } from "react";

interface PauseAfterCookingProps {
  onContinue: () => void;
}

const PauseAfterCooking = ({ onContinue }: PauseAfterCookingProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onContinue();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onContinue]);

  return (
    <div className="fixed inset-0 z-20 bg-[#DBA409] flex items-center justify-center p-[100px] text-center">
      <p className="text-white text-[25pt] font-montserrat leading-relaxed">
        Now mix and season with care each gesture honors who you’re sharing it with.
      </p>
    </div>
  );
};

export default PauseAfterCooking;
