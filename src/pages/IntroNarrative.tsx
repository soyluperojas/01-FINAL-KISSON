import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const IntroNarrative = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/intro");
    }, 4000); // ⏱️ ajusta la duración si quieres

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center p-[100px] text-center">
      <p className="text-white text-[22pt] font-montserrat leading-relaxed">
        TEXT introduction
      </p>
    </div>
  );
};

export default IntroNarrative;
