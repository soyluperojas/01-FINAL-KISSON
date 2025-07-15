// src/pages/SplashScreen.tsx (o Intro.tsx si lo renombraste)

import { useNavigate } from "react-router-dom";

const SplashScreen = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/narrative"); // O la siguiente ruta
  };

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Video de fondo de la estufa */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="/videos/stove-intro.mp4"
        autoPlay
        muted
        playsInline
      />

      {/* Botón START centrado horizontal y 90px del fondo */}
      <div className="absolute bottom-[90px] left-1/2 transform -translate-x-1/2 z-10">
        <img
          src="/images/start-button.svg"
          alt="Start"
            className="cursor-pointer transition-transform duration-300 hover:scale-105"
          onClick={handleStart}
        />
      </div>
    </div>
  );
};

export default SplashScreen;
