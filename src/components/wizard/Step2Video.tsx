// src/components/transitions/Step2Video.tsx
import { useEffect, useRef } from "react";

interface Step2VideoProps {
  onContinue: () => void;
}

const Step2Video = ({ onContinue }: Step2VideoProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onContinue();
    }, 3000); // 3 segundos

    const handleEnded = () => {
      clearTimeout(timeout);
      onContinue();
    };

    const video = videoRef.current;
    if (video) {
      video.addEventListener("ended", handleEnded);
      video.play().catch(() => {
        console.warn("⚠️ Autoplay falló, continuando por timeout");
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
        src="/videos/step2.mp4"
        className="w-full h-full object-cover"
        autoPlay
        muted
        playsInline
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <p className="text-white text-[25pt] font-normal uppercase font-sans text-center" style={{ fontFamily: "Montserrat, sans-serif" }}>
          STEP 2 COMPLETED
        </p>
      </div>
    </div>
  );
};

export default Step2Video;
