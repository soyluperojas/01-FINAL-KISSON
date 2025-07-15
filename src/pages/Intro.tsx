// src/pages/Intro.tsx
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Intro = () => {
  const navigate = useNavigate();
  const redVideoRef = useRef<HTMLVideoElement | null>(null);
  const [showLogo, setShowLogo] = useState(false);

  const handleStart = () => {
    if (redVideoRef.current) {
      redVideoRef.current.style.display = "block";
      redVideoRef.current.play();
      redVideoRef.current.onended = () => {
        navigate("/choosing");
      };
    } else {
      navigate("/choosing");
    }
  };

  useEffect(() => {
    // Espera un pequeño delay para mostrar el logo con animación
    const timer = setTimeout(() => {
      setShowLogo(true);
    }, 300); // puedes ajustar el delay si quieres

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
      {/* 🔥 Video de la estufa de fondo */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="/videos/stove.mp4"
        autoPlay
        muted
        playsInline
      />

      {/* 🔴 Video de red animation oculto inicialmente */}
      <video
        ref={redVideoRef}
        src="/videos/red-animation.mp4"
        className="absolute inset-0 w-full h-full object-cover z-20 hidden"
        playsInline
        muted
      />

      {/* 🎯 Logo con animación desde arriba */}
      <div
        className={`z-10 transition-all duration-1000 ease-out ${
          showLogo ? "translate-y-0 opacity-100" : "-translate-y-[200%] opacity-0"
        }`}
      >
        <img
          src="/images/logo.svg"
          alt="Logo"
          className="mx-auto mb-10 w-[700px]"
        />
      </div>

      {/* 🟡 Botón LET’S GO a 90px del fondo */}
      <div className="absolute bottom-[90px] left-1/2 transform -translate-x-1/2 z-10">
      <img
  src="/images/letsgo-button.svg"
  alt="Let's Go"
  className="cursor-pointer transition-transform duration-300 hover:scale-105"
  onClick={handleStart}
/>
      </div>
    </div>
  );
};

export default Intro;

