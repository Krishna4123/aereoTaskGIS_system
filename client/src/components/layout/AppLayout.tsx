import React, { useState, useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { checkBackendHealth } from '../../services/apiClient';

export const AppLayout: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isBackendOnline, setIsBackendOnline] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    checkBackendHealth().then((online) => {
      if (mounted) setIsBackendOnline(online);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-surface">
      <AppSidebar currentDatasetId={id || 'ds-land-parcels-01'} />
      <div className="pl-[230px]">
        <AppHeader
          workspaceName={
            id === 'ds-site-boundary-02'
              ? 'site_boundary_contour_v2.kml'
              : 'land_parcels_traverse_survey.zip'
          }
          isBackendOnline={isBackendOnline}
        />
        <main className="relative pt-12 min-h-screen bg-surface w-full">
          <Outlet context={{ isBackendOnline }} />
        </main>
      </div>
    </div>
  );
};
