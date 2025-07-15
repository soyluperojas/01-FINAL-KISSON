import { useEffect, useRef } from "react";

const WhiteTransition = ({ onEnd }: { onEnd: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play();
      video.onended = () => {
        onEnd();
      };
    }
  }, [onEnd]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "black",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        width: "100vw",
        height: "100vh",
      }}
    >
      <video
        ref={videoRef}
        src="/videos/white-animation.mp4"
        autoPlay
        playsInline
        muted
        style={{
          width: "100vw",
          height: "100vh",
          objectFit: "cover",
        }}
      />
    </div>
  );
};

export default WhiteTransition;
