import { useState } from "react";
import { RecipeData } from "../RecipeWizard";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validateRecipeContent } from "@/utils/profanityFilter";

interface DedicationSelectionProps {
  updateData: (data: Partial<RecipeData>) => void;
  data: RecipeData;
}

const dedications = [
  "To my grandmother",
  "To a love that is no longer here",
  "To my past self",
  "To someone I haven't met yet",
  "To myself",
  "To whoever comes next"
];

const DedicationSelection = ({ updateData, data }: DedicationSelectionProps) => {
  const [selected, setSelected] = useState<string>(data.dedication || "");
  const [dedicationRecipient, setDedicationRecipient] = useState<string>(data.dedicationRecipient || "");
  const [error, setError] = useState<string>("");

  const handleSelect = (dedication: string) => {
    setSelected(dedication);
    updateData({
      dedication,
      secretIngredient: getSecretIngredient(dedication)
    });
  };

  const handleDedicationRecipientChange = (value: string) => {
    const validation = validateRecipeContent(value, 'dedication');
    if (!validation.isValid) {
      setError(validation.message || "");
      return;
    }
    if (validation.severity === 'warning') {
      setError(validation.message || "");
    } else {
      setError("");
    }
    setDedicationRecipient(value);
    updateData({ dedicationRecipient: value });
  };

  const getSecretIngredient = (dedication: string): string => {
    switch (dedication) {
      case "To my grandmother":
        return "a warm hug";
      case "To a love that is no longer here":
        return "a teardrop of bittersweet memory";
      case "To my past self":
        return "a sprinkle of forgiveness";
      case "To someone I haven't met yet":
        return "a dash of anticipation";
      case "To myself":
        return "a handful of self-acceptance";
      case "To whoever comes next":
        return "a pinch of hope";
      default:
        return "a touch of kindness";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-white">
      {/* Pregunta principal: 25pt Montserrat Bold centrada */}
      <div>
        <h3 className="text-[25pt] font-montserrat font-bold text-center mb-4 text-white">
          Who would you like to dedicate this recipe to?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {dedications.map((dedication) => (
            <Card
              key={dedication}
              className={cn(
                "p-4 cursor-pointer transition-all duration-300 flex items-center justify-center border-2 backdrop-blur-sm",
                selected === dedication
                  ? "bg-gray-600 text-white shadow-[0_0_20px_rgba(255,255,255,0.8)]"
                  : "bg-black text-white hover:bg-gray-800 hover:shadow-[0_0_15px_rgba(255,255,255,0.6)] active:bg-gray-600"
              )}
              onClick={() => handleSelect(dedication)}
            >
              <p className="text-[15pt] font-montserrat font-bold text-white">
                {dedication}
              </p>
            </Card>
          ))}
        </div>
      </div>

      <div className="pt-6 mt-4 border-t border-white/20">
        <Label
          htmlFor="dedication-recipient"
          className="text-[15pt] font-montserrat font-bold mb-2 block text-white"
        >
          Is there anyone specific you would like to dedicate the recipe to?
        </Label>
        <Input
          id="dedication-recipient"
          placeholder="A name, pet, or someone special..."
          value={dedicationRecipient}
          onChange={(e) => handleDedicationRecipientChange(e.target.value)}
          className="max-w-md bg-black/50 border-white/60 focus:border-white focus:ring-2 focus:ring-white/30 placeholder:text-white/60 text-[15pt] font-montserrat font-bold text-white backdrop-blur-sm"
        />
        {error && (
          <p className={cn(
            "text-sm mt-1",
            error.includes("family-friendly") ? "text-yellow-400" : "text-red-400"
          )}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default DedicationSelection;
