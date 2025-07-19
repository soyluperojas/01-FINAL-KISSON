// src/pages/QrView.tsx
import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

interface RecipeQRData {
  recipeTitle: string;
  cookingRecipe: string;
  videoName: string;
}

const QrRecipe = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<RecipeQRData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (id) {
      // Primero intentar obtener datos de la URL
      const encodedData = searchParams.get('data');
      
      if (encodedData) {
        try {
          const decodedData = JSON.parse(decodeURIComponent(encodedData)) as RecipeQRData;
          setData(decodedData);
          setIsLoading(false);
          return;
        } catch (err) {
          console.error("Error decoding URL data:", err);
        }
      }

      // Fallback: intentar localStorage (solo para el mismo dispositivo)
      try {
      const stored = localStorage.getItem(id);
      if (stored) {
        const parsed = JSON.parse(stored) as RecipeQRData;
        setData(parsed);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.error("Error reading from localStorage:", err);
      }

      // Si no hay datos, mostrar error
      setError("Recipe not found. This recipe may have expired or is not available on this device.");
      setIsLoading(false);
    }
  }, [id, searchParams]);

  if (isLoading) {
    return (
      <div style={{ background: "black", color: "white", height: "100vh", padding: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ 
            width: "40px", 
            height: "40px", 
            border: "4px solid #f97316", 
            borderTop: "4px solid transparent", 
            borderRadius: "50%", 
            animation: "spin 1s linear infinite",
            margin: "0 auto 20px"
          }}></div>
          <h1 style={{ fontFamily: "Courier", fontSize: 24, marginBottom: 10 }}>
          Loading recipe...
        </h1>
          <p style={{ fontSize: 14, opacity: 0.7 }}>
            This may take a few seconds
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ background: "black", color: "white", height: "100vh", padding: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: "400px" }}>
          <h1 style={{ fontFamily: "Courier", fontSize: 24, marginBottom: 20 }}>
            Recipe Not Found
          </h1>
          <p style={{ fontSize: 16, opacity: 0.8, lineHeight: 1.5 }}>
            {error || "This recipe is not available or has expired."}
          </p>
          <p style={{ fontSize: 14, opacity: 0.6, marginTop: 20 }}>
            Try scanning the QR code again or contact the recipe creator.
          </p>
        </div>
      </div>
    );
  }

  const imageSrc = `/images/${data.videoName.replace(".mp4", ".png")}`;

  return (
    <div style={{
      background: "black",
      color: "white",
      minHeight: "100vh",
      padding: "20px",
      fontFamily: "Courier, monospace"
    }}>
      <h1 style={{ textAlign: "center", fontSize: 24, marginBottom: 20 }}>{data.recipeTitle}</h1>
      <img src={imageSrc} alt="Recipe" style={{ width: "100%", maxWidth: 600, display: "block", margin: "0 auto 20px" }} />
      <pre style={{ whiteSpace: "pre-wrap", fontSize: 14 }}>{data.cookingRecipe}</pre>

      <div style={{ marginTop: 30 }}>
        <label>Leave your email to receive this recipe:</label>
        <input
          type="email"
          placeholder="Your email"
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 4,
            border: "none",
            marginTop: 10
          }}
        />
      </div>
    </div>
  );
};

export default QrRecipe;
