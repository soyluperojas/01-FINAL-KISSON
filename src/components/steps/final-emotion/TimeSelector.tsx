import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import { timeMarkers } from "./timeMarkers";

interface TimeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const TimeSelector = ({ value, onChange }: TimeSelectorProps) => {
  const [timeIndex, setTimeIndex] = useState<number>(
    value ? timeMarkers.findIndex(t => t.value === value) : 2
  );
  const [hoveredTimeIndex, setHoveredTimeIndex] = useState<number | null>(null);

  const handleTimeChange = (newValue: number[]) => {
    const index = newValue[0];
    setTimeIndex(index);
    onChange(timeMarkers[index].value);
  };

  const handleTimeClick = (index: number) => {
    setTimeIndex(index);
    onChange(timeMarkers[index].value);
  };

  const handleExplanationClick = () => {
    if (hoveredTimeIndex !== null) {
      handleTimeClick(hoveredTimeIndex);
    }
  };

  const displayTimeIndex = hoveredTimeIndex !== null ? hoveredTimeIndex : timeIndex;
  const showDefaultMessage = hoveredTimeIndex === null && !value;

  return (
    <div className="pt-4">
      <Label className="block text-[25pt] font-bold text-center text-white mb-8">
        If this dish could be served in a specific time period, when would that be?
      </Label>

      <div className="px-4 py-8">
        <Slider 
          value={[timeIndex]} 
          min={0} 
          max={timeMarkers.length - 1} 
          step={1}
          onValueChange={handleTimeChange}
        />
        
        <div className="flex justify-between mt-4 text-sm gap-2">
          {timeMarkers.map((marker, i) => (
            <div 
              key={i}
              className={cn(
                "text-center transition-all relative cursor-pointer px-2 py-2 rounded-md flex-1 border min-w-0",
                timeIndex === i ? "text-white font-bold scale-105 bg-black border-white" : "text-white border-white/60 bg-black/50 hover:bg-white/10 hover:border-white"
              )}
              onMouseEnter={() => setHoveredTimeIndex(i)}
              onMouseLeave={() => setHoveredTimeIndex(null)}
              onClick={() => handleTimeClick(i)}
            >
              <span className="block text-[15pt] font-bold text-white whitespace-pre-line">{marker.label}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <div 
            className="p-4 bg-black/50 border border-white/60 rounded-md inline-flex items-center justify-center text-sm cursor-pointer transition-all hover:bg-white/10 hover:border-white"
            onClick={handleExplanationClick}
            style={{ 
              width: '100%', 
              maxWidth: '600px', 
              minHeight: '80px',
              height: '80px'
            }}
          >
            {!showDefaultMessage ? (
              <span className="font-medium text-white">{timeMarkers[displayTimeIndex].explanation}</span>
            ) : (
              <span className="flex items-center gap-2 text-white italic">
                <Info size={16} className="text-white" />
                Hover over time periods to see details (click to select)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeSelector;
