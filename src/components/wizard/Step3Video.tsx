// src/components/transitions/Step3Video.tsx
import { useEffect, useRef, useState } from "react";

interface Step3VideoProps {
  onContinue: () => void;
}

const Step3Video = ({ onContinue }: Step3VideoProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [showStepText, setShowStepText] = useState(true);

  useEffect(() => {
    // Mostrar el texto solo durante 1 segundo
    const textTimeout = setTimeout(() => setShowStepText(false), 1000);
    const timeout = setTimeout(() => {
      onContinue();
    }, 2000); // Fallback de 3 segundos

    const handleEnded = () => {
      clearTimeout(timeout);
      onContinue();
    };

    const video = videoRef.current;
    if (video) {
      video.addEventListener("ended", handleEnded);
      video.play().catch(() => {
        console.warn("⚠️ Autoplay falló");
        onContinue();
      });
    }

    return () => {
      clearTimeout(textTimeout);
      clearTimeout(timeout);
      video?.removeEventListener("ended", handleEnded);
    };
  }, [onContinue]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <video
        ref={videoRef}
        src="/videos/step3.mp4"
        className="w-full h-full object-cover"
        autoPlay
        muted
        playsInline
      />
      {showStepText && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            zIndex: 10
          }}
        >
          <span
            style={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: '35pt',
              textAlign: 'center',
              fontFamily: 'Montserrat, sans-serif',
              textTransform: 'none',
            }}
          >
            STEP 3 <span style={{ textTransform: 'lowercase' }}>completed</span>
          </span>
        </div>
      )}
    </div>
  );
};

export default Step3Video;
