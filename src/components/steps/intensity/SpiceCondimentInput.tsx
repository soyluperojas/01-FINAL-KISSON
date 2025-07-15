import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { validateInput } from "@/utils/profanityFilter";

interface SpiceCondimentInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const SpiceCondimentInput = ({ value, onChange }: SpiceCondimentInputProps) => {
  const [error, setError] = useState<string>("");

  const handleInputChange = (inputValue: string) => {
    const validation = validateInput(inputValue);

    if (!validation.isValid) {
      setError(validation.message || "");
      return;
    }

    setError("");
    onChange(inputValue);
  };

  return (
    <div className="pt-6 mt-4 border-t border-white/20">
      <div className="max-w-md mx-auto">
        <Label
          htmlFor="spice-condiment"
          className="text-[15pt] font-bold text-white mb-2 block"
        >
          What spice or condiment would enhance this experience?
        </Label>
        <Input
          id="spice-condiment"
          placeholder="Salt, pepper, cinnamon, honey..."
          value={value || ""}
          onChange={(e) => handleInputChange(e.target.value)}
          className="bg-black border-2 border-white text-white placeholder:text-white/60 focus:bg-gray-800 focus:shadow-[0_0_15px_rgba(255,255,255,0.6)] transition-all duration-300"
        />
        {error && (
          <p className="text-red-400 text-sm mt-1">{error}</p>
        )}
        <p className="text-sm text-white/75 mt-1">
          This will add the final touch of flavor to your memory recipe
        </p>
      </div>
    </div>
  );
};
