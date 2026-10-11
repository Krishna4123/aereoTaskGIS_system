import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

interface AppSidebarProps {
  currentDatasetId?: string;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  currentDatasetId = 'ds-land-parcels-01',
}) => {
  const location = useLocation();

  const navItems = [
    {
      to: '/',
      label: 'Overview',
      icon: 'dashboard',
      exact: true,
    },
    {
      to: '/upload',
      label: 'Upload Dataset',
      icon: 'cloud_upload',
    },
    {
      to: `/datasets/${currentDatasetId}`,
      label: 'Analysis Workspace',
      icon: 'layers',
    },
    {
      to: '/ai-analyst',
      label: 'AI Analyst',
      icon: 'auto_awesome',
    },
    {
      to: `/datasets/${currentDatasetId}/quality`,
      label: 'Data Quality',
      icon: 'verified',
    },
    {
      to: `/datasets/${currentDatasetId}/report`,
      label: 'Report Preview',
      icon: 'description',
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-[230px] bg-surface-container-lowest border-r border-outline-variant/30 z-50 flex flex-col justify-between select-none">
      <div className="flex flex-col">
        {/* Brand / Logo */}
        <div className="h-12 px-space-md border-b border-outline-variant/30 flex items-center justify-between gap-space-xs">
          <NavLink to="/" className="flex items-center gap-space-xs min-w-0">
            <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center font-bold text-sm tracking-tighter flex-shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[19px]">explore</span>
            </div>
            <span className="font-label-md text-label-md text-on-surface truncate tracking-tight font-semibold">
              GeoMeasure AI
            </span>
          </NavLink>
          <span className="font-label-sm text-label-sm text-secondary bg-surface-container px-1.5 py-0.5 rounded flex-shrink-0">
            GIS v1.4
          </span>
        </div>

        {/* Navigation Category */}
        <div className="px-space-md pt-space-md pb-space-xs">
          <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">
            Navigation
          </span>
        </div>

        {/* Primary Navigation Links */}
        <nav className="flex flex-col gap-0.5 px-space-xs">
          {navItems.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex items-center gap-space-sm px-2.5 py-1.5 rounded-lg transition-colors font-body-sm text-body-sm ${
                  isActive
                    ? 'bg-surface-container-high text-primary font-medium'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* System Category & Profile Footer */}
      <div className="flex flex-col">
        <div className="px-space-md pb-space-xs">
          <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">
            System
          </span>
        </div>
        <nav className="flex flex-col gap-0.5 px-space-xs mb-space-xs">
          <a
            href="#settings"
            onClick={(e) => e.preventDefault()}
            className="flex items-center gap-space-sm px-2.5 py-1.5 rounded-lg font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            <span>Settings</span>
          </a>
          <a
            href="#docs"
            onClick={(e) => e.preventDefault()}
            className="flex items-center gap-space-sm px-2.5 py-1.5 rounded-lg font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">terminal</span>
            <span>Documentation / API</span>
          </a>
        </nav>

        {/* User Card */}
        <div className="border-t border-outline-variant/30 p-space-sm">
          <div className="flex items-center justify-between gap-space-xs p-1.5 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer">
            <div className="flex items-center gap-space-xs min-w-0">
              <div className="relative flex-shrink-0">
                <div className="w-7 h-7 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-xs">
                  ER
                </div>
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-primary ring-1 ring-surface-container-lowest" />
              </div>
              <div className="flex flex-col min-w-0 leading-tight">
                <span className="font-label-md text-label-md text-on-surface truncate">
                  Elena Rostova
                </span>
                <span className="font-body-xs text-body-xs text-secondary truncate">
                  Lead GIS Analyst
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-secondary text-[18px]">unfold_more</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
