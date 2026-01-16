import React from 'react';

interface Step {
  number: number;
  label: string;
  isActive: boolean;
  isComplete: boolean;
}

interface StepIndicatorProps {
  steps: Step[];
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ steps }) => {
  return (
    <div className="flex items-center justify-center gap-2 md:gap-4">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div className="flex flex-col items-center">
            <div
              className={`
                step-circle transition-all duration-300
                ${step.isActive ? 'step-circle-active scale-110' : ''}
                ${step.isComplete ? 'bg-ink text-paper' : ''}
              `}
            >
              {step.isComplete ? '✓' : step.number}
            </div>
            <span className={`
              mt-2 text-sm font-hand hidden md:block
              ${step.isActive ? 'text-ink font-bold' : 'text-muted-foreground'}
            `}>
              {step.label}
            </span>
          </div>
          
          {index < steps.length - 1 && (
            <div className="flex-1 max-w-16 relative h-0.5 mx-1">
              <div className="absolute inset-0 border-t-2 border-dashed border-ink/30" />
              {step.isComplete && (
                <div className="absolute inset-0 border-t-2 border-ink transition-all duration-500" />
              )}
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;
