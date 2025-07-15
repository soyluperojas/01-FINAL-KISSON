import { RecipeData } from "../RecipeWizard";
import TimeSelector from "./final-emotion/TimeSelector";

interface FinalEmotionSelectionProps {
  updateData: (data: Partial<RecipeData>) => void;
  data: RecipeData;
}

const FinalEmotionSelection = ({
  updateData,
  data
}: FinalEmotionSelectionProps) => {
  const handleTimeChange = (serveTime: string) => {
    updateData({
      serveTime
    });
  };

  return (
    <div className="space-y-8 animate-fade-in text-white">
      <TimeSelector value={data.serveTime} onChange={handleTimeChange} />
    </div>
  );
};

export default FinalEmotionSelection;
