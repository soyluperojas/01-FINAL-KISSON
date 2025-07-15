export async function generateImage(
  prompt: string,
  shape?: string,
  ingredients?: string,
  intensity?: string
): Promise<{ imageUrl: string | null; error?: string }> {
  console.warn("🛑 DALL·E generation disabled. Returning placeholder.");

  return {
    imageUrl: "/images/placeholder.png", // o null o "" si prefieres que no aparezca nada
  };
}
