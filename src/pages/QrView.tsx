// src/pages/QrRecipe.tsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

interface RecipeQRData {
  recipeTitle: string;
  cookingRecipe: string;
  videoName: string;
}

const QrRecipe = () => {
  const { id } = useParams();
  const [data, setData] = useState<RecipeQRData | null>(null);

  useEffect(() => {
    if (id) {
      const stored = localStorage.getItem(id);
      if (stored) {
        const parsed = JSON.parse(stored) as RecipeQRData;
        setData(parsed);
      }
    }
  }, [id]);

  if (!data) {
    return (
      <div style={{ background: "black", color: "white", height: "100vh", padding: 40 }}>
        <h1 style={{ textAlign: "center", fontFamily: "Courier", fontSize: 24 }}>
          Loading recipe...
        </h1>
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
