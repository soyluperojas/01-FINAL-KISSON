// src/components/transitions/Step1Video.tsx
import { useEffect, useRef } from "react";

interface Step1VideoProps {
  onContinue: () => void;
}

const Step1Video = ({ onContinue }: Step1VideoProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onContinue();
    }, 4000); // Fallback por si el video no termina

    const handleEnded = () => {
      clearTimeout(timeout);
      onContinue();
    };

    const video = videoRef.current;
    if (video) {
      video.addEventListener("ended", handleEnded);
      video.play().catch((err) => {
        console.warn("⚠️ Autoplay failed", err);
        onContinue(); // Fallback si no se puede reproducir
      });
    }

    return () => {
      clearTimeout(timeout);
      video?.removeEventListener("ended", handleEnded);
    };
  }, [onContinue]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <video
        ref={videoRef}
        src="/videos/step1.mp4"
        className="w-full h-full object-cover"
        autoPlay
        muted
        playsInline
      />
    </div>
  );
};

export default Step1Video;
