import React from 'react';
import { useNavigate } from 'react-router-dom';

interface AppHeaderProps {
  workspaceName?: string;
  crs?: string;
  onSearch?: (query: string) => void;
  isBackendOnline?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  workspaceName = 'land_parcels_traverse_survey.zip',
  crs = 'EPSG:4326 • WGS 84',
  onSearch,
  isBackendOnline = false,
}) => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-[230px] right-0 h-12 bg-surface-container-lowest border-b border-outline-variant/30 z-40 flex items-center justify-between px-space-md">
      {/* Workspace Context */}
      <div className="flex items-center gap-space-md min-w-0">
        <div className="flex items-center gap-space-xs font-body-sm text-body-sm text-secondary min-w-0">
          <span className="material-symbols-outlined text-[18px] text-secondary flex-shrink-0">
            folder_open
          </span>
          <span className="text-on-surface-variant truncate">Current Workspace:</span>
          <span className="font-label-md text-label-md text-on-surface truncate font-medium">
            {workspaceName}
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-container text-secondary font-data-tabular text-data-tabular border border-outline-variant/20 flex-shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span>{crs}</span>
        </div>

        {/* Backend mode status tag */}
        <div
          className={`hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border flex-shrink-0 ${
            isBackendOnline
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}
          title={isBackendOnline ? 'Connected to live API server' : 'Running in local verified dataset preview mode'}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isBackendOnline ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
          />
          <span>{isBackendOnline ? 'API Connected' : 'Dataset Preview Mode'}</span>
        </div>
      </div>

      {/* Global Actions */}
      <div className="flex items-center gap-space-sm flex-shrink-0">
        <div className="relative hidden md:flex items-center">
          <span className="material-symbols-outlined absolute left-2 text-[16px] text-secondary">
            search
          </span>
          <input
            type="text"
            placeholder="Search Feature ID or Layer..."
            onChange={(e) => onSearch?.(e.target.value)}
            className="h-8 pl-7 pr-3 bg-surface border border-outline-variant/40 rounded-lg font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary-container w-56 transition-all"
          />
        </div>

        <button
          type="button"
          aria-label="System notifications"
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/30 text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">notifications</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/upload')}
          className="h-8 px-3 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md hover:bg-primary transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>New Upload</span>
        </button>
      </div>
    </header>
  );
};
