
// Calculate angle from center point and mouse position
export const getAngleFromCenter = (centerX: number, centerY: number, mouseX: number, mouseY: number) => {
  const deltaX = mouseX - centerX;
  const deltaY = mouseY - centerY;
  let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
  // Normalize to 0-360 degrees and adjust for our knob starting position (top = 0)
  angle = (angle + 90 + 360) % 360;
  return angle;
};

// Convert angle to value for temperature (0-240) - now using full 360 degrees
export const angleToTemperature = (angle: number) => {
  // Map full 360 degrees of rotation to 0-240 range
  return Math.round((angle / 360) * 240);
};

// Convert angle to value for shape (0-240, but snapped to 60-degree intervals for 6 positions)
export const angleToShape = (angle: number) => {
  const rawValue = (angle / 360) * 240;
  // Snap to nearest 40-unit interval (6 positions: 0, 40, 80, 120, 160, 200, 240)
  return Math.round(rawValue / 40) * 40;
};

// Convert angle to value for flavor (3 positions at 0°, 120°, 240°)
export const angleToFlavor = (angle: number) => {
  // For 3 positions, we need to snap to 120-degree intervals
  // Position 0: 0° (sweet), Position 1: 120° (balanced), Position 2: 240° (savory)
  const snappedAngle = Math.round(angle / 120) * 120;
  // Convert the snapped angle back to our 0-240 value system
  // 0° -> 0, 120° -> 120, 240° -> 240
  return snappedAngle === 360 ? 0 : snappedAngle;
};
