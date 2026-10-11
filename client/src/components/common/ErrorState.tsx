import React from 'react';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'GIS Pipeline Error',
  message,
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-error-container/20 border border-error/20 rounded-xl">
      <div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center text-error mb-3">
        <span className="material-symbols-outlined text-[20px]">error_outline</span>
      </div>
      <h3 className="font-label-md text-label-md text-error font-semibold mb-1">{title}</h3>
      <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="h-7 px-3 rounded bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-sm text-label-sm border border-outline-variant/40 flex items-center gap-1.5 transition-colors"
          type="button"
        >
          <span className="material-symbols-outlined text-[14px]">refresh</span>
          <span>Retry Operation</span>
        </button>
      )}
    </div>
  );
};
