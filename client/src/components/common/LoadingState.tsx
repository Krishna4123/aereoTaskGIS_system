import React from 'react';

interface LoadingStateProps {
  message?: string;
  subtext?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Processing spatial telemetry...',
  subtext = 'Calibrating geodetic coordinate frames',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-9 h-9 rounded-full border-3 border-primary-container border-t-transparent animate-spin mb-4" />
      <span className="font-label-md text-label-md text-on-surface">{message}</span>
      <span className="font-body-xs text-body-xs text-secondary mt-1">{subtext}</span>
    </div>
  );
};
