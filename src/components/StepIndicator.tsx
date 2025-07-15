
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
}

const StepIndicator = ({ currentStep, totalSteps, stepTitles }: StepIndicatorProps) => {
  console.log("StepIndicator - currentStep:", currentStep, "totalSteps:", totalSteps);
  
  return (
    <div className="relative mb-8">
      <div className="flex justify-between relative">
        {stepTitles.map((title, index) => {
          const isOnResultsPage = currentStep >= totalSteps;
          const isCompleted = isOnResultsPage || index < currentStep;
          const isCurrent = !isOnResultsPage && index === currentStep;
          
          console.log(`Step ${index + 1}: isCompleted=${isCompleted}, isCurrent=${isCurrent}, currentStep=${currentStep}`);
          
          return (
            <div key={index} className="flex flex-col items-center">
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2 mb-2 relative z-10",
                  isCompleted && "bg-white border-white shadow-[0_0_20px_rgba(255,255,255,0.8)]",
                  isCurrent && "bg-black border-white shadow-[0_0_25px_rgba(255,255,255,1)] scale-110",
                  !isCompleted && !isCurrent && "bg-transparent border-white/30"
                )}
              >
                <span
                  className="step-number-text"
                  style={{
                    color: '#ffffff',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    lineHeight: '1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    visibility: 'visible',
                    opacity: '1',
                    zIndex: '999'
                  }}
                >
                  {index + 1}
                </span>
              </div>
              <span 
                className={cn(
                  "text-xs mt-2 font-medium text-center max-w-[80px] transition-all duration-300",
                  (isCurrent || isCompleted) && "text-white font-bold",
                  !isCompleted && !isCurrent && "text-white/40"
                )}
              >
                {title}
              </span>
            </div>
          );
        })}
      </div>
      
      <style 
        dangerouslySetInnerHTML={{
          __html: `
            .step-number-text {
              color: #ffffff !important;
              font-weight: bold !important;
              font-size: 14px !important;
              line-height: 1 !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              width: 100% !important;
              height: 100% !important;
              visibility: visible !important;
              opacity: 1 !important;
              z-index: 999 !important;
              text-align: center !important;
              background: none !important;
              background-image: none !important;
              -webkit-text-fill-color: #ffffff !important;
              text-fill-color: #ffffff !important;
            }
            
            html body .step-number-text,
            html body.step-0-text .step-number-text,
            html body.step-1-text .step-number-text,
            html body.step-2-text .step-number-text,
            html body.step-3-text .step-number-text,
            html body.step-4-text .step-number-text,
            html body.step-5-text .step-number-text {
              color: #ffffff !important;
              font-weight: bold !important;
              background: none !important;
              background-image: none !important;
              -webkit-text-fill-color: #ffffff !important;
              text-fill-color: #ffffff !important;
            }
          `
        }}
      />
    </div>
  );
};

export default StepIndicator;
