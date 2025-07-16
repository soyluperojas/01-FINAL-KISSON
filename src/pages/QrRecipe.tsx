// src/pages/QrRecipe.tsx

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const QrRecipe = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<any>(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(`recipe-${id}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      setRecipe(parsed);

      // Enviar automáticamente a soyluperojas@gmail.com
      sendEmail("soyluperojas@gmail.com", parsed);
    }
  }, [id]);

  const sendEmail = (targetEmail: string, recipeData: any) => {
    console.log("📤 Email enviado a:", targetEmail);
    console.log("📝 Contenido:", recipeData);
    // Aquí puedes integrar EmailJS o un backend si deseas envío real.
  };

  if (!recipe) {
    return <div style={{ color: "white", padding: 32 }}>Loading...</div>;
  }

  return (
    <div
      style={{
        backgroundColor: "black",
        color: "white",
        minHeight: "100vh",
        padding: "1in",
        fontFamily: "Courier, monospace",
        textAlign: "left",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between"
      }}
    >
      <div>
        <h1 style={{ fontSize: "26px", marginBottom: "20px" }}>{recipe.title}</h1>
        <img
          src={`/images/${recipe.video?.replace(".mp4", ".png")}`}
          alt="Memory"
          style={{ maxWidth: "100%", marginBottom: "24px" }}
        />
        <pre style={{ whiteSpace: "pre-wrap", fontSize: "14px", marginBottom: "24px" }}>
          {recipe.text}
        </pre>
      </div>

      <div style={{ marginBottom: "40px" }}>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "none",
            width: "250px",
            marginBottom: "10px",
          }}
        />
        <br />
        <button
          onClick={() => sendEmail(email, recipe)}
          style={{
            padding: "10px 20px",
            backgroundColor: "white",
            color: "black",
            fontWeight: "bold",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Send Recipe
        </button>
      </div>

      <img
        src="/images/logo.svg"
        alt="Kisson Logo"
        style={{
          width: 150,
          height: "auto",
          marginBottom: "16px"
        }}
      />
    </div>
  );
};

export default QrRecipe;
