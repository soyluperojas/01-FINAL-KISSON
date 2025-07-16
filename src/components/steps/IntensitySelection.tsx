import React, { useState, useEffect, useCallback } from "react";
import { RecipeData } from "../RecipeWizard";
import { KnobControl } from "./intensity/KnobControl";
import { SpiceCondimentInput } from "./intensity/SpiceCondimentInput";
import { shapeOptions, getSelectedShape, getShapeColor } from "./intensity/shapeHelpers";
import { getIntensityLabel, getIntensityDescription } from "./intensity/intensityHelpers";
import { flavorOptions, getSelectedFlavor } from "./intensity/flavorHelpers";
import { Button } from "@/components/ui/button";

interface IntensitySelectionProps {
  updateData: (data: Partial<RecipeData>) => void;
  data: RecipeData;
  onSurpriseMe?: () => void;
}

const IntensitySelection = ({ updateData, data, onSurpriseMe }: IntensitySelectionProps) => {
  const [temperature, setTemperature] = useState(
    data.intensity === "cold" ? 0 :
    data.intensity === "gentle" ? 80 :
    data.intensity === "moderate" ? 160 :
    data.intensity === "intense" ? 240 : 160
  );

  const [shapeValue, setShapeValue] = useState(() => {
    const selectedShape = data.shape?.value || "";
    const index = shapeOptions.findIndex(shape => shape.value === selectedShape);
    return index >= 0 ? index * 40 : 0;
  });

  const [flavorValue, setFlavorValue] = useState(() => {
    const currentFlavor = data.flavorProfile || "balanced";
    const index = flavorOptions.findIndex(flavor => flavor.value === currentFlavor);
    return index >= 0 ? index * 120 : 120;
  });

  const [spiceOrCondiment, setSpiceOrCondiment] = useState<string>(data.spiceOrCondiment || "");
  const [isKnobInteracting, setIsKnobInteracting] = useState(false);
  const [isShapeKnobInteracting, setIsShapeKnobInteracting] = useState(false);
  const [isFlavorKnobInteracting, setIsFlavorKnobInteracting] = useState(false);
  const [isDragging, setIsDragging] = useState<'temperature' | 'shape' | 'flavor' | null>(null);

  const updateRecipeData = useCallback((newTemperature: number, newShapeValue: number, newFlavorValue: number) => {
    let intensity;
    if (newTemperature === 0) intensity = "cold";
    else if (newTemperature <= 80) intensity = "gentle";
    else if (newTemperature <= 160) intensity = "moderate";
    else intensity = "intense";

    const shapeIndex = Math.round(newShapeValue / 40);
    const selectedShapeData = shapeOptions[shapeIndex];

    const flavorIndex = Math.round(newFlavorValue / 120);
    const selectedFlavorData = flavorOptions[flavorIndex];

    updateData({
      intensity,
      shape: selectedShapeData ? {
        value: selectedShapeData.value,
        metaphor: selectedShapeData.metaphor,
        geometry: selectedShapeData.value,
        example: "",
        image: selectedShapeData.value
      } : null,
      flavorProfile: selectedFlavorData?.value || "balanced"
    });
  }, [updateData]);

  useEffect(() => {
    updateRecipeData(temperature, shapeValue, flavorValue);
  }, [temperature, shapeValue, flavorValue, updateRecipeData]);

  const handleSpiceOrCondimentChange = (value: string) => {
    setSpiceOrCondiment(value);
    updateData({ spiceOrCondiment: value });
  };

  const handleSurpriseMe = () => {
    const randomTemperature = Math.floor(Math.random() * 8) * 30;
    const randomShapeValue = Math.floor(Math.random() * 6) * 40;
    const randomFlavorValue = Math.floor(Math.random() * 3) * 120;

    const randomIngredients = [
      "mushrooms", "scallions", "ginger", "cabbage", "carrots", "spinach",
      "pork", "chicken", "shrimp", "tofu", "beef", "garlic", "chives"
    ];
    const randomSpices = [
      "soy sauce", "sesame oil", "rice wine", "white pepper", "chili oil",
      "oyster sauce", "black vinegar", "five-spice", "star anise"
    ];

    const randomIngredient = randomIngredients[Math.floor(Math.random() * randomIngredients.length)];
    const randomSpice = randomSpices[Math.floor(Math.random() * randomSpices.length)];

    const timePeriods = ["distant future", "near future", "present", "ancient china", "medieval times"];
    const randomTimePeriod = timePeriods[Math.floor(Math.random() * timePeriods.length)];

    const emotions = ["joy", "nostalgia", "comfort", "excitement", "serenity", "wonder", "gratitude"];
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];

    setTemperature(randomTemperature);
    setShapeValue(randomShapeValue);
    setFlavorValue(randomFlavorValue);
    setSpiceOrCondiment(randomSpice);

    let intensity;
    if (randomTemperature === 0) intensity = "cold";
    else if (randomTemperature <= 80) intensity = "gentle";
    else if (randomTemperature <= 160) intensity = "moderate";
    else intensity = "intense";

    const shapeIndex = Math.round(randomShapeValue / 40);
    const selectedShapeData = shapeOptions[shapeIndex];
    const flavorIndex = Math.round(randomFlavorValue / 120);
    const selectedFlavorData = flavorOptions[flavorIndex];

    updateData({
      intensity,
      shape: selectedShapeData ? {
        value: selectedShapeData.value,
        metaphor: selectedShapeData.metaphor,
        geometry: selectedShapeData.value,
        example: "",
        image: selectedShapeData.value
      } : null,
      flavorProfile: selectedFlavorData?.value || "balanced",
      spiceOrCondiment: randomSpice,
      actualIngredient: randomIngredient,
      serveTime: randomTimePeriod,
      finalEmotion: randomEmotion,
      memoryType: "Random AI Generation"
    });

    if (onSurpriseMe) {
      onSurpriseMe();
    }
  };

  const selectedShape = getSelectedShape(shapeValue);
  const selectedFlavor = getSelectedFlavor(flavorValue);

  return (
    <div className="space-y-6 animate-fade-in text-white">
      <div className="text-center mb-8">
        <p className="text-[25pt] font-bold">
          Adjust the knobs to set method, shape, and flavor.
        </p>
      </div>

      {/* Knobs */}
      <div className="flex flex-col lg:flex-row justify-center gap-6 mb-8">
        <KnobControl
          value={temperature}
          onChange={setTemperature}
          type="temperature"
          isInteracting={isKnobInteracting}
          onInteractionChange={setIsKnobInteracting}
          isDragging={isDragging === 'temperature'}
          onDragChange={(dragging) => setIsDragging(dragging ? 'temperature' : null)}
          gradient="from-[#D40018] to-[#D40018]"
          labels={["Cold", "Cool", "Gentle", "Warm", "Moderate", "Hot", "Intense", "Boiling"]}
          positions={[0, 45, 90, 135, 180, 225, 270, 315]}
        >
          <div className="text-center">
            <div className="text-xl font-bold font-display text-[#F73E00]">{temperature}°</div>
            <div className="text-sm font-medium transition-colors duration-300">
              {getIntensityLabel(temperature)}
            </div>
          </div>
        </KnobControl>

        <KnobControl
          value={shapeValue}
          onChange={setShapeValue}
          type="shape"
          isInteracting={isShapeKnobInteracting}
          onInteractionChange={setIsShapeKnobInteracting}
          isDragging={isDragging === 'shape'}
          onDragChange={(dragging) => setIsDragging(dragging ? 'shape' : null)}
          gradient="from-[#F73E00] to-[#F73E00]"
          labels={["Organic", "Star", "Triangle", "Oval", "Bundle", "Envelope"]}
          positions={[0, 60, 120, 180, 240, 300]}
        >
          <div className="text-center">
            <div className="mb-1">
              {selectedShape.icon && React.createElement(selectedShape.icon, {
                className: `h-6 w-6 mx-auto ${getShapeColor(shapeValue).replace('bg-', 'text-')}`
              })}
            </div>
            <div className="text-sm font-medium transition-colors duration-300">
              {selectedShape.value.charAt(0).toUpperCase() + selectedShape.value.slice(1)}
            </div>
          </div>
        </KnobControl>

        <KnobControl
          value={flavorValue}
          onChange={setFlavorValue}
          type="flavor"
          isInteracting={isFlavorKnobInteracting}
          onInteractionChange={setIsFlavorKnobInteracting}
          isDragging={isDragging === 'flavor'}
          onDragChange={(dragging) => setIsDragging(dragging ? 'flavor' : null)}
          gradient="from-[#EACF34] to-[#EACF34]"
          labels={["Sweet", "Balanced", "Savory"]}
          positions={[0, 120, 240]}
        >
          <div className="text-center">
            <div className="text-sm font-medium transition-colors duration-300">
              {selectedFlavor.value.charAt(0).toUpperCase() + selectedFlavor.value.slice(1)}
            </div>
            <div className="text-xs mt-1">Profile</div>
          </div>
        </KnobControl>
      </div>

      {/* Knob Descriptions */}
      <div className="flex flex-col lg:flex-row justify-center gap-6 mb-8">
        <div className="text-center w-56 mx-auto">
          <div className="text-sm animate-fade-in text-white/70">
            {getIntensityDescription(temperature)}
          </div>
        </div>
        <div className="text-center w-56 mx-auto">
          <div className="text-sm animate-fade-in text-white/70">
            {selectedShape.metaphor}
          </div>
        </div>
        <div className="text-center w-56 mx-auto">
          <div className="text-sm animate-fade-in text-white/70">
            {selectedFlavor.description}
          </div>
        </div>
      </div>

      {/* Surprise Me Button */}
      <div className="text-center mb-8">
        <Button
          onClick={handleSurpriseMe}
          className="bg-gradient-to-r from-[#F73E00] via-[#F73E00] to-[#F73E00] text-white font-bold py-4 px-7 rounded-full shadow-lg text-lg uppercase text-center scale-108"
        >
          Surprise Me!!
        </Button>
        <p className="text-sm mt-2 text-white/70">
          Let AI create a completely random recipe for you
        </p>
      </div>

      {/* Spice Selection */}
      <SpiceCondimentInput
        value={spiceOrCondiment}
        onChange={handleSpiceOrCondimentChange}
      />
    </div>
  );
};

export default IntensitySelection;
