import { useState } from "react";
import { RecipeData } from "../RecipeWizard";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { validateRecipeContent } from "@/utils/profanityFilter";

interface IngredientsSelectionProps {
  updateData: (data: Partial<RecipeData>) => void;
  data: RecipeData;
}

const emotions = [
  "Warmth", "Nostalgia", "Adventure", "Curiosity", "Bittersweet sadness", "Silence",
  "Love", "Anger", "Shame", "Lust", "Longing", "Fear"
];

const IngredientsSelection = ({
  updateData,
  data
}: IngredientsSelectionProps) => {
  const [selected, setSelected] = useState<string[]>(data.emotionalIngredients || []);
  const [customEmotion, setCustomEmotion] = useState<string>(data.emotionalIngredients?.find(e => !emotions.includes(e)) || "");
  const [error, setError] = useState<string>("");

  const handleSelectEmotion = (emotion: string) => {
    setSelected(prev => {
      const newSelected = prev.includes(emotion)
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion];
      updateData({ emotionalIngredients: newSelected });
      return newSelected;
    });
  };

  const handleCustomEmotionChange = (value: string) => {
    const validation = validateRecipeContent(value, 'ingredient');
    if (!validation.isValid) {
      setError(validation.message || "");
      return;
    }
    if (validation.severity === 'warning') {
      setError(validation.message || "");
    } else {
      setError("");
    }
    setCustomEmotion(value);

    const filteredSelected = selected.filter(e => emotions.includes(e));
    const newSelected = value.trim() !== ""
      ? [...filteredSelected, value.trim()]
      : filteredSelected;
    setSelected(newSelected);
    updateData({ emotionalIngredients: newSelected });
  };

  const firstRow = emotions.slice(0, 6);
  const secondRow = emotions.slice(6);

  return (
    <div className="space-y-8 animate-fade-in text-white">
      {/* Pregunta principal: 25pt Montserrat Bold centrada */}
      <div>
        <h3 className="text-[25pt] font-montserrat font-bold text-center mb-4 text-white">
          What emotional ingredients are in your dumpling?
        </h3>

        {/* Primera fila de emociones */}
        <div className="flex flex-wrap justify-center gap-3 mb-3">
          {firstRow.map(emotion => (
            <Badge
              key={emotion}
              variant={selected.includes(emotion) ? "default" : "outline"}
              className={cn(
                "cursor-pointer text-[15pt] font-montserrat font-bold py-3 px-4 transition-all duration-200 border-2 relative overflow-hidden backdrop-blur-sm",
                selected.includes(emotion)
                  ? "border-white bg-gradient-to-br from-white/30 to-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                  : "border-white/60 bg-black/50 text-white/70 hover:border-white hover:bg-white/10 hover:shadow-[0_0_10px_rgba(255,255,255,0.3)] hover:text-white"
              )}
              onClick={() => handleSelectEmotion(emotion)}
            >
              {emotion}
            </Badge>
          ))}
        </div>

        {/* Segunda fila de emociones */}
        <div className="flex flex-wrap justify-center gap-3">
          {secondRow.map(emotion => (
            <Badge
              key={emotion}
              variant={selected.includes(emotion) ? "default" : "outline"}
              className={cn(
                "cursor-pointer text-[15pt] font-montserrat font-bold py-3 px-4 transition-all duration-200 border-2 relative overflow-hidden backdrop-blur-sm",
                selected.includes(emotion)
                  ? "border-white bg-gradient-to-br from-white/30 to-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                  : "border-white/60 bg-black/50 text-white/70 hover:border-white hover:bg-white/10 hover:shadow-[0_0_10px_rgba(255,255,255,0.3)] hover:text-white"
              )}
              onClick={() => handleSelectEmotion(emotion)}
            >
              {emotion}
            </Badge>
          ))}
        </div>
      </div>

      <div className="pt-4">
        <Label htmlFor="custom-emotion" className="text-[15pt] font-montserrat font-bold mb-2 block text-white">
          Add your own emotional ingredient
        </Label>
        <Input
          id="custom-emotion"
          placeholder="Enter an emotion not listed above..."
          value={customEmotion}
          onChange={e => handleCustomEmotionChange(e.target.value)}
          className="max-w-md bg-black/50 border-white/60 focus:border-white focus:ring-2 focus:ring-white/30 placeholder:text-white/60 text-[15pt] font-montserrat font-bold text-white backdrop-blur-sm"
        />
        {error && (
          <p className={cn(
            "text-sm mt-1",
            error.includes("family-friendly") ? "text-yellow-400" : "text-red-400"
          )}>{error}</p>
        )}
      </div>
    </div>
  );
};

export default IngredientsSelection;
