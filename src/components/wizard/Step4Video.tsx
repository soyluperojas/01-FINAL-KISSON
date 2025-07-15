// src/components/transitions/Step4Video.tsx
import { useEffect, useRef, useState } from "react";

interface Step4VideoProps {
  onContinue: () => void;
}

const Step4Video = ({ onContinue }: Step4VideoProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [showText, setShowText] = useState(true);

  useEffect(() => {
    const textTimeout = setTimeout(() => {
      setShowText(false); // Oculta texto después de 1 segundo
    }, 1000);

    const videoTimeout = setTimeout(() => {
      onContinue(); // Pasa después de 3 segundos
    }, 3000);

    const handleEnded = () => {
      clearTimeout(videoTimeout);
      onContinue();
    };

    const video = videoRef.current;
    if (video) {
      video.addEventListener("ended", handleEnded);
      video.play().catch(() => onContinue());
    }

    return () => {
      clearTimeout(videoTimeout);
      clearTimeout(textTimeout);
      video?.removeEventListener("ended", handleEnded);
    };
  }, [onContinue]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <video
        ref={videoRef}
        src="/videos/step4.mp4"
        className="w-full h-full object-cover"
        autoPlay
        muted
        playsInline
      />
      {showText && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <p
            className="text-white text-[25pt] font-bold uppercase font-sans text-center"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            STEP 4 COMPLETED
          </p>
        </div>
      )}
    </div>
  );
};

export default Step4Video;
