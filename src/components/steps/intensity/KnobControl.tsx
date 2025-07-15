
import React, { useRef, useEffect } from "react";
import { getAngleFromCenter, angleToTemperature, angleToShape, angleToFlavor } from "./knobUtils";

interface KnobControlProps {
  value: number;
  onChange: (value: number) => void;
  type: 'temperature' | 'shape' | 'flavor';
  isInteracting: boolean;
  onInteractionChange: (interacting: boolean) => void;
  isDragging: boolean;
  onDragChange: (dragging: boolean) => void;
  gradient: string;
  children: React.ReactNode;
  labels?: string[];
  positions?: number[];
}

export const KnobControl = ({
  value,
  onChange,
  type,
  isInteracting,
  onInteractionChange,
  isDragging,
  onDragChange,
  gradient,
  children,
  labels = [],
  positions = []
}: KnobControlProps) => {
  const knobRef = useRef<HTMLDivElement>(null);

  const handlePointerStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    onDragChange(true);
    onInteractionChange(true);
  };

  const getClientCoordinates = (e: MouseEvent | TouchEvent) => {
    if ('touches' in e && e.touches.length > 0) {
      return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
    }
    return { clientX: (e as MouseEvent).clientX, clientY: (e as MouseEvent).clientY };
  };

  useEffect(() => {
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !knobRef.current) return;

      e.preventDefault(); // Prevent scrolling on touch devices
      
      const rect = knobRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const { clientX, clientY } = getClientCoordinates(e);
      const angle = getAngleFromCenter(centerX, centerY, clientX, clientY);
      
      if (type === 'temperature') {
        const newValue = angleToTemperature(angle);
        onChange(newValue);
      } else if (type === 'shape') {
        const newValue = angleToShape(angle);
        onChange(newValue);
      } else if (type === 'flavor') {
        const newValue = angleToFlavor(angle);
        onChange(newValue);
      }
    };

    const handlePointerEnd = () => {
      onDragChange(false);
      onInteractionChange(false);
    };

    if (isDragging) {
      // Add both mouse and touch event listeners
      document.addEventListener('mousemove', handlePointerMove);
      document.addEventListener('mouseup', handlePointerEnd);
      document.addEventListener('touchmove', handlePointerMove, { passive: false });
      document.addEventListener('touchend', handlePointerEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handlePointerMove);
      document.removeEventListener('mouseup', handlePointerEnd);
      document.removeEventListener('touchmove', handlePointerMove);
      document.removeEventListener('touchend', handlePointerEnd);
    };
  }, [isDragging, type, onChange, onDragChange, onInteractionChange]);

  // Helper function to calculate label position inside the circle
  const getLabelPosition = (angle: number) => {
    // Position labels inside the dial with smaller radius
    const radius = 80; // Smaller radius to fit inside the circle
    const radian = (angle - 90) * (Math.PI / 180); // Convert to radians, adjust for top being 0°
    const x = Math.cos(radian) * radius;
    const y = Math.sin(radian) * radius;
    
    return {
      left: `calc(50% + ${x}px)`,
      top: `calc(50% + ${y}px)`,
      transform: 'translate(-50%, -50%)'
    };
  };

  // Calculate the correct rotation angle for the knob indicator
  const getKnobRotation = () => {
    if (type === 'flavor') {
      // For flavor knob, directly use the value as the angle (0, 120, 240)
      return value;
    } else {
      // For temperature and shape, map the 0-240 value to 360 degrees
      return (value / 240) * 360;
    }
  };

  return (
    <div className="relative mx-auto w-64 h-64 group" ref={knobRef}>
      {/* White glow around the dial */}
      <div className="absolute inset-4 rounded-full opacity-40 transition-all duration-500 blur-lg bg-white"></div>
           
      <div className="absolute inset-4 bg-black rounded-full border-2 border-white shadow-inner backdrop-blur-sm hover:bg-gray-800 hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] transition-all duration-300">
        {/* Marks distributed around full circle */}
        {positions.map((degree, index) => (
          <div 
            key={degree} 
            className="absolute w-1 h-3 bg-white transition-all group-hover:scale-y-110" 
            style={{
              left: '50%',
              top: '50%',
              transformOrigin: 'bottom center',
              transform: `translate(-50%, -100%) rotate(${degree}deg) translateY(-3.5rem)`
            }} 
          />
        ))}
        
        {/* Labels positioned inside the circle */}
        {labels.map((label, index) => {
          const position = positions[index];
          const labelStyle = getLabelPosition(position);
          
          return (
            <div 
              key={label} 
              className="absolute text-xs font-semibold transition-all hover:scale-110 hover:text-white whitespace-nowrap text-center text-white"
              style={labelStyle}
            >
              {label}
            </div>
          );
        })}
      </div>
      
      {/* DRAGGABLE KNOB INDICATOR - Enhanced for touch */}
      <div 
        className="absolute inset-4 flex items-center justify-center cursor-pointer select-none z-20 touch-none" 
        style={{ transform: `rotate(${getKnobRotation()}deg)` }}
        onMouseDown={handlePointerStart}
        onTouchStart={handlePointerStart}
      >
        <div className={`w-8 h-8 bg-black rounded-full -translate-y-[3.5rem] border-2 border-white transition-all duration-300 cursor-grab active:cursor-grabbing touch-manipulation ${
          isInteracting 
            ? 'scale-150 bg-gray-600 shadow-[0_0_20px_rgba(255,255,255,0.8)]' 
            : 'scale-110 hover:scale-125 hover:bg-gray-800 hover:shadow-[0_0_15px_rgba(255,255,255,0.6)]'
        }`} />
      </div>
      
      {/* Knob center - consistent styling */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-black rounded-full z-10 transition-all duration-300 border-2 border-white hover:bg-gray-800 hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] flex items-center justify-center pointer-events-none">
        {children}
      </div>
    </div>
  );
};
