import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const IntroNarrative = () => {
  const navigate = useNavigate();
  const [showFirst, setShowFirst] = useState(true);

  useEffect(() => {
    const firstTimeout = setTimeout(() => {
      setShowFirst(false);
    }, 4000);
    const secondTimeout = setTimeout(() => {
      navigate("/intro");
    }, 7000);

    return () => {
      clearTimeout(firstTimeout);
      clearTimeout(secondTimeout);
    };
  }, [navigate]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center p-[100px] text-center">
      {showFirst ? (
        <p className="text-white text-[22pt] font-montserrat leading-relaxed">
          Share a feeling or memory, our AI turns it into a unique recipe
          <br />
          you can create and taste, bringing emotion to life.
        </p>
      ) : (
        <div>
          <p className="text-white text-[22pt] font-montserrat leading-relaxed mb-4">
            "EVERY DUMPLING IS A PORTAL, EVERY BITE A TIME MACHINE"
          </p>
          <p className="text-white text-[16pt] font-montserrat italic">– KissOn</p>
        </div>
      )}
    </div>
  );
};

export default IntroNarrative;
