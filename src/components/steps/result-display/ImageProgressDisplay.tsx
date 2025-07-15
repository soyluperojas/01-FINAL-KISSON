
import { Progress } from "@/components/ui/progress";

interface ImageProgressDisplayProps {
  progress: number;
  stage: string;
}

export const ImageProgressDisplay = ({ progress, stage }: ImageProgressDisplayProps) => {
  return (
    <div className="w-64 h-64 mx-auto bg-slate-100 rounded-lg overflow-hidden">
      <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-full space-y-4">
          {/* Animated cooking icon with white border */}
          <div className="mx-auto w-16 h-16 relative">
            <div className="absolute inset-0 rounded-full border-4 border-white/50"></div>
            <div className="absolute inset-0 rounded-full border-4 border-black border-t-transparent animate-spin"></div>
            <div className="absolute inset-2 flex items-center justify-center text-2xl">🥟</div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-center text-gray-600 font-medium">
              {stage}
            </p>
            <p className="text-xs text-center text-gray-500">
              {progress}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
