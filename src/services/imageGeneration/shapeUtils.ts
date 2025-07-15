
import { SHAPE_DESCRIPTIONS } from "./constants";

export function getShapeDescription(shape: string): string {
  return SHAPE_DESCRIPTIONS[shape.toLowerCase()] || "traditional dumpling shape";
}
