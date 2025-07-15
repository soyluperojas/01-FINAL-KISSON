// ✅ Choosing.tsx actualizado con fondo HEX #8A0000 y SVG centrado
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Choosing() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/intro-text");
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="fixed inset-0 z-200 bg-[#8A0000] flex items-center justify-center">
      <img 
        src="/images/choosing-the-memory.svg" 
        alt="Choosing the Memory"
        className="w-full max-w-2xl px-[90px]"
      />
    </div>
  );
}
