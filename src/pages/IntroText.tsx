// src/pages/IntroText.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const IntroText = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/index");
    }, 100); // espera de 4 segundos antes de redirigir

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="w-full h-screen bg-[#D40018] px-[150px] flex items-center justify-center text-white text-center text-xl font-semibold leading-snug">
      <div>
        <p className="mt-4">
    
        </p>
      </div>
    </div>
  );
};

export default IntroText;
