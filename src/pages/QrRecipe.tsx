import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRecipe } from "@/utils/recipeStorage"; // usa Supabase o KV si no hay localStorage

const QrRecipe = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<any>(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const loadRecipe = async () => {
      if (!id) return;

      console.log("🧭 Buscando receta con ID:", id);
      const loaded = await getRecipe(id); // esto sí busca en KV y Supabase
      if (loaded) {
        setRecipe(loaded);
        console.log("✅ Receta cargada:", loaded);

        // También enviar automáticamente a correo si quieres
        sendEmail("soyluperojas@gmail.com", loaded);
      } else {
        console.error("❌ No se encontró receta");
      }
    };

    loadRecipe();
  }, [id]);

  const sendEmail = (targetEmail: string, recipeData: any) => {
    console.log("📤 Email enviado a:", targetEmail);
    console.log("📝 Contenido:", recipeData);
    // Aquí podrías usar EmailJS si quieres
  };

  if (!recipe) {
    return <div style={{ color: "white", padding: 32 }}>Loading recipe...</div>;
  }

  return (
    <div
      style={{
        backgroundColor: "black",
        color: "white",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <h1 style={{ fontSize: 32, marginBottom: 16 }}>{recipe.generatedTitle}</h1>
      <p style={{ marginBottom: 24 }}>{recipe.generatedDescription}</p>

      <h2>Ingredients:</h2>
      <ul>
        {recipe.generatedIngredients?.map((ing: string, i: number) => (
          <li key={i}>{ing}</li>
        ))}
      </ul>

      <h2 style={{ marginTop: 24 }}>Instructions:</h2>
      <p>{recipe.generatedRecipe}</p>
    </div>
  );
};

export default QrRecipe;
