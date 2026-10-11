import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  iconName?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  iconName = 'inbox',
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-surface-container-lowest rounded-xl border border-outline-variant/30">
      <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-secondary mb-3">
        <span className="material-symbols-outlined text-[24px]">{iconName}</span>
      </div>
      <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">{title}</h3>
      <p className="font-body-sm text-body-sm text-secondary max-w-md mb-4">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="h-8 px-3 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md hover:bg-primary transition-colors flex items-center gap-1.5"
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};
