// src/components/transitions/Step5Video.tsx
import { useEffect, useRef, useState } from "react";

interface Step5VideoProps {
  onContinue: () => void;
}

const Step5Video = ({ onContinue }: Step5VideoProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [showText, setShowText] = useState(true);

  useEffect(() => {
    const textTimeout = setTimeout(() => setShowText(false), 1000); // Oculta el texto tras 1 segundo
    const videoTimeout = setTimeout(() => onContinue(), 2000); // Pasa al siguiente paso tras 3 segundos

    const video = videoRef.current;
    const handleEnded = () => {
      clearTimeout(videoTimeout);
      onContinue();
    };

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
        src="/videos/step5.mp4"
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
            STEP 5 <span style={{ textTransform: 'lowercase' }}>completed</span>
          </span>
        </div>
      )}
    </div>
  );
};

export default Step5Video;
