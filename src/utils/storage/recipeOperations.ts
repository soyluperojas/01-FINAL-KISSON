import { supabase } from "@/integrations/supabase/client";
import { SecurityAuditLogger } from "@/utils/securityAudit";
import { InputSanitizer } from "@/utils/inputSanitizer";
import { ExtendedRecipeData } from "./types";
import { validateImageUrl } from "./validation";
import { getStoredRecipes, saveRecipesToStorage } from "./localStorage";

// 🔗 Conexión con Vercel KV
const KV_URL = import.meta.env.VITE_KV_REST_API_URL || import.meta.env.KV_REST_API_URL;
const KV_TOKEN = import.meta.env.VITE_KV_REST_API_TOKEN || import.meta.env.KV_REST_API_TOKEN;

// Debug variables de entorno
console.log("🔧 KV_URL disponible:", !!KV_URL);
console.log("🔧 KV_TOKEN disponible:", !!KV_TOKEN);
console.log("🔧 VITE_KV_REST_API_URL:", import.meta.env.VITE_KV_REST_API_URL);
console.log("🔧 KV_REST_API_URL:", import.meta.env.KV_REST_API_URL);

async function saveToKV(id: string, recipe: ExtendedRecipeData) {
  try {
    console.log("🔄 Intentando guardar en KV con URL:", KV_URL);
    const response = await fetch(`${KV_URL}/set/recipe-${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${KV_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recipe),
    });
    
    if (response.ok) {
      console.log("✅ Guardado en KV exitosamente");
    } else {
      console.error("❌ Error en respuesta KV:", response.status, response.statusText);
    }
  } catch (err) {
    console.error("❌ Error guardando en KV:", err);
  }
}

async function getFromKV(id: string): Promise<ExtendedRecipeData | null> {
  try {
    console.log("🔄 Intentando leer desde KV con URL:", KV_URL);
    const res = await fetch(`${KV_URL}/get/recipe-${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${KV_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    
    if (!res.ok) {
      console.error("❌ Error en respuesta KV:", res.status, res.statusText);
      return null;
    }
    
    const json = await res.json();
    if (json.result) {
      console.log("✅ Obtenido desde KV exitosamente");
      return JSON.parse(json.result);
    } else {
      console.log("⚠️ No se encontró resultado en KV");
    }
  } catch (err) {
    console.error("❌ Error leyendo desde KV:", err);
  }
  return null;
}

export const generateRecipeId = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const storeRecipe = async (
  recipeData: ExtendedRecipeData,
  imageUrl?: string,
  providedId?: string
): Promise<string> => {
  const id = providedId || generateRecipeId();
  console.log("=== STORE RECIPE DEBUG (PUBLIC MODE) ===");
  console.log("Storing recipe with ID:", id);
  console.log("Raw image URL:", imageUrl);

  const sanitizedRecipeData = InputSanitizer.sanitizeRecipeData(recipeData);
  const cleanImageUrl = validateImageUrl(imageUrl);
  if (cleanImageUrl) {
    sanitizedRecipeData.storedImageUrl = cleanImageUrl;
  }

  try {
    // 1. Guardar localmente
    const recipes = getStoredRecipes();
    recipes.set(id, sanitizedRecipeData);
    saveRecipesToStorage(recipes);
    console.log("✅ Guardado en localStorage");

    // 2. Guardar en KV
    await saveToKV(id, sanitizedRecipeData);

    // 3. Auditar
    await SecurityAuditLogger.logRecipeAction('create', id);
  } catch (error) {
    console.error("❌ Error con almacenamiento:", error);
  }

  return id;
};

export const getRecipe = async (id: string): Promise<ExtendedRecipeData | null> => {
  console.log("=== GET RECIPE DEBUG (PUBLIC MODE) ===");
  console.log("Retrieving recipe with ID:", id);

  if (!id || typeof id !== 'string' || id.length > 100) {
    console.error("❌ ID inválido");
    return null;
  }

  try {
    // 1. LocalStorage
    const recipes = getStoredRecipes();
    const localRecipe = recipes.get(id);
    if (localRecipe) {
      console.log("✅ Encontrada en localStorage");
      await SecurityAuditLogger.logRecipeAction('view', id);
      return localRecipe;
    }

    // 2. Supabase
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single();

    if (!error && data) {
      console.log("✅ Encontrada en Supabase");
      const recipeData = InputSanitizer.sanitizeRecipeData(data.recipe_data);
      if (data.image_url) recipeData.storedImageUrl = data.image_url;
      const sanitized = InputSanitizer.sanitizeRecipeData(recipeData);
      await SecurityAuditLogger.logRecipeAction('view', id);
      return sanitized;
    }

    // 3. Vercel KV
    const kvRecipe = await getFromKV(id);
    if (kvRecipe) {
      console.log("✅ Encontrada en KV");
      await SecurityAuditLogger.logRecipeAction('view', id);
      return InputSanitizer.sanitizeRecipeData(kvRecipe);
    }

    console.warn("⚠️ Receta no encontrada");
  } catch (error) {
    console.error("❌ Error al obtener receta:", error);
  }

  return null;
};

export const updateRecipeImage = async (id: string, imageUrl: string): Promise<boolean> => {
  console.log("=== UPDATE RECIPE IMAGE DEBUG (PUBLIC MODE) ===");
  console.log("Updating recipe image for ID:", id);
  console.log("New image URL:", imageUrl);

  const cleanImageUrl = validateImageUrl(imageUrl);
  if (!cleanImageUrl) {
    console.error("❌ URL de imagen inválida:", imageUrl);
    return false;
  }

  try {
    const recipes = getStoredRecipes();
    const recipe = recipes.get(id);
    if (recipe) {
      recipe.storedImageUrl = cleanImageUrl;
      recipes.set(id, recipe);
      saveRecipesToStorage(recipes);
      console.log("✅ Imagen actualizada en localStorage");
      await SecurityAuditLogger.logRecipeAction('update', id);
      return true;
    }
  } catch (error) {
    console.error("❌ Error actualizando imagen:", error);
  }

  return false;
};

export const getRecipeWithFallback = async (id: string, encodedData?: string): Promise<ExtendedRecipeData | null> => {
  let recipe = await getRecipe(id);

  if (!recipe && encodedData) {
    console.log("🔍 Intentando decodificar receta desde URL");
    try {
      const jsonString = decodeURIComponent(escape(atob(encodedData)));
      const rawRecipe = JSON.parse(jsonString);
      recipe = InputSanitizer.sanitizeRecipeData(rawRecipe);
      if (recipe) {
        const recipes = getStoredRecipes();
        recipes.set(id, recipe);
        saveRecipesToStorage(recipes);
        await SecurityAuditLogger.logRecipeAction('create', id);
        console.log("✅ Receta decodificada y guardada desde fallback");
      }
    } catch (error) {
      console.error("❌ Error al decodificar receta desde fallback:", error);
    }
  }

  return recipe;
};
