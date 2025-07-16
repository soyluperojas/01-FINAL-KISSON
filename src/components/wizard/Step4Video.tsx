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
    }, 2000);

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
            STEP 4 <span style={{ textTransform: 'lowercase' }}>completed</span>
          </span>
        </div>
      )}
    </div>
  );
};

export default Step4Video;
