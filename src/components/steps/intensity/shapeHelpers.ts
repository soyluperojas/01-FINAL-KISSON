
import { Circle, Star, Triangle, Sparkles, Layers } from "lucide-react";

export const shapeOptions = [{
  value: "organic",
  metaphor: "Like a soft blanket",
  icon: Sparkles
}, {
  value: "star",
  metaphor: "Like a blooming flower",
  icon: Star
}, {
  value: "triangle",
  metaphor: "Like a fragile leaf",
  icon: Triangle
}, {
  value: "oval",
  metaphor: "Like a wet stone",
  icon: Circle
}, {
  value: "bundle",
  metaphor: "Like a knot that won't undo",
  icon: Layers
}, {
  value: "envelope",
  metaphor: "Like a folded letter",
  icon: Layers
}];

export const getSelectedShape = (shapeValue: number) => {
  const shapeIndex = Math.round(shapeValue / 40); // 40 is 240/6
  return shapeOptions[shapeIndex] || shapeOptions[0];
};

export const getShapeColor = (shapeValue: number) => {
  const shapeIndex = Math.round(shapeValue / 40);
  switch (shapeIndex) {
    case 0: return "bg-cyan-400";
    case 1: return "bg-blue-400";
    case 2: return "bg-purple-400";
    case 3: return "bg-pink-400";
    case 4: return "bg-yellow-400";
    default: return "bg-orange-400";
  }
};

export const getShapeGradient = (shapeValue: number) => {
  const shapeIndex = Math.round(shapeValue / 40);
  switch (shapeIndex) {
    case 0: return "from-cyan-200 to-cyan-600";
    case 1: return "from-blue-200 to-blue-600";
    case 2: return "from-purple-200 to-purple-600";
    case 3: return "from-pink-200 to-pink-600";
    case 4: return "from-yellow-200 to-yellow-600";
    default: return "from-orange-200 to-orange-600";
  }
};
