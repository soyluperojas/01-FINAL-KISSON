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
        Your ingredients are ready. Now it's time to combine, season, and transform.
        <br />
        This step is not just about following instructions. It's about temperature,
        time, intention, and most importantly, who you choose to share it with.
        <br />
        Every gesture in this mixture carries the essence of that special person,
        pet, or soul who will receive this creation.
      </p>
    </div>
  );
};

export default PauseAfterCooking;
