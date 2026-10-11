import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { datasetService } from '../services/datasetService';
import { measurementService } from '../services/measurementService';
import { Dataset } from '../types/dataset';
import { GeoFeatureCollection } from '../types/geometry';
import { LoadingState } from '../components/common/LoadingState';

export const ReportPreviewPage: React.FC = () => {
  const { id = 'ds-land-parcels-01' } = useParams<{ id: string }>();
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [collection, setCollection] = useState<GeoFeatureCollection | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      datasetService.getDatasetById(id),
      measurementService.getFeatures(id),
    ]).then(([dsRes, featRes]) => {
      if (!mounted) return;
      setDataset(dsRes.data);
      setCollection(featRes.data);
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading || !collection) {
    return <LoadingState message="Generating formal survey docket..." subtext="Compiling geodesic metrics and certified audit" />;
  }

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    measurementService.exportCSVBlob(collection.features, `formal_audit_${id}.csv`);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Sticky Sub-Action Toolbar */}
      <div className="sticky top-12 z-30 bg-surface-container-lowest/95 backdrop-blur-sm px-space-xl py-space-sm shadow-sm flex flex-wrap items-center justify-between gap-space-md border-b border-outline-variant/30 print:hidden select-none">
        <div className="flex items-center gap-space-md min-w-0">
          <div className="flex items-center gap-space-xs font-body-sm text-body-sm text-secondary">
            <Link
              to={`/datasets/${id}`}
              className="hover:text-primary transition-colors flex items-center gap-1 font-medium"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Workspace</span>
            </Link>
            <span>/</span>
            <span className="font-data-tabular text-data-tabular text-on-surface-variant font-medium">
              GMA-2024-REP-0842
            </span>
          </div>
          <div className="h-4 w-px bg-outline-variant/40 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-container-high text-primary font-label-sm text-label-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-container" />
              <span>Certified Report</span>
            </span>
            <span className="text-secondary font-body-xs text-body-xs hidden md:inline">
              Ready for print & export
            </span>
          </div>
        </div>

        {/* Actions Right */}
        <div className="flex items-center gap-space-xs">
          <button
            type="button"
            onClick={handlePrint}
            className="h-8 px-3 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            <span>Print Document</span>
          </button>
          <button
            type="button"
            onClick={handleExportCSV}
            className="h-8 px-3 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">table_chart</span>
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="h-8 px-3.5 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md hover:bg-primary transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Document Canvas Frame matching Stitch design */}
      <div className="px-space-md sm:px-space-xl py-space-xl flex justify-center">
        <article className="w-full max-w-4xl bg-surface-container-lowest rounded-xl shadow-md p-6 sm:p-12 md:p-14 text-on-surface flex flex-col gap-10 border border-outline-variant/20 print:shadow-none print:border-none">
          {/* Header Banner / Document Meta */}
          <header className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-outline-variant/30">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0 text-primary">
                  <span className="material-symbols-outlined text-[26px]">grid_4x4</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-headline-sm text-headline-sm tracking-tight text-on-surface font-semibold">
                      GeoMeasure AI
                    </span>
                    <span className="font-label-sm text-label-sm px-1.5 py-0.2 rounded bg-surface-container text-secondary">
                      Cartographic Suite
                    </span>
                  </div>
                  <p className="font-body-xs text-body-xs text-secondary mt-0.5">
                    High-Precision Geodesic Metric & Cadastral Verification Engine
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:items-end font-data-tabular text-data-tabular text-secondary leading-snug">
                <div className="flex items-center gap-2">
                  <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
                    Report Ref:
                  </span>
                  <span className="font-semibold text-on-surface">GMA-2024-REP-0842</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
                    Issue Date:
                  </span>
                  <span className="text-on-surface">October 24, 2024 • 14:32:08 UTC</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
                    Status:
                  </span>
                  <span className="text-primary font-medium">Formal Survey Audit</span>
                </div>
              </div>
            </div>

            {/* Title & Executive Subline */}
            <div className="flex flex-col gap-1.5 pt-2">
              <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest font-semibold">
                Official Measurement Docket
              </span>
              <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                Cadastral Spatial Analysis & Measurement Report
              </h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-3xl leading-relaxed">
                Automated geometry validation, geodesic perimeter and parcel area computation, topology
                intersection analysis, and projection datum verification prepared for client review and legal filing.
              </p>
            </div>

            {/* Metadata Strip Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-surface-container-low rounded-lg font-body-sm text-body-sm">
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-secondary uppercase font-semibold">
                  Dataset & Source
                </span>
                <span className="font-label-md text-label-md text-on-surface font-medium truncate mt-0.5">
                  {dataset?.name || 'land_parcels_traverse_survey.zip'}
                </span>
                <span className="font-body-xs text-body-xs text-on-surface-variant">
                  ESRI Shapefile ({collection.features.length} Feat)
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-secondary uppercase font-semibold">
                  Spatial Reference (CRS)
                </span>
                <span className="font-label-md text-label-md text-on-surface font-medium truncate mt-0.5">
                  {dataset?.crs || 'EPSG:4326'} (WGS 84)
                </span>
                <span className="font-body-xs text-body-xs text-on-surface-variant">
                  Ellipsoid GRS 80 / Karney Geodesic
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-secondary uppercase font-semibold">
                  Auditor / Lead Analyst
                </span>
                <span className="font-label-md text-label-md text-on-surface font-medium truncate mt-0.5">
                  Elena Rostova
                </span>
                <span className="font-body-xs text-body-xs text-on-surface-variant">
                  Lead GIS Analyst (GeoMeasure Core)
                </span>
              </div>
            </div>
          </header>

          {/* Section 1: Executive Summary & Dataset Overview */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-surface-container flex items-center justify-center font-data-tabular text-data-tabular text-primary font-semibold">
                  01
                </span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  Executive Summary & Dataset Overview
                </h2>
              </div>
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold">
                Metrics Overview
              </span>
            </div>

            {/* 4 Key Metadata Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-lg bg-surface-container-low flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <span className="font-label-sm text-label-sm text-secondary uppercase font-semibold">
                    Features Processed
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-primary">data_object</span>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-headline-lg text-headline-lg text-on-surface font-bold font-data-tabular">
                    412
                  </span>
                  <span className="font-body-xs text-body-xs text-secondary">vector entities</span>
                </div>
                <span className="font-body-xs text-body-xs text-on-surface-variant mt-1">
                  100% parsed without geometry corruption
                </span>
              </div>

              <div className="p-4 rounded-lg bg-surface-container-low flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <span className="font-label-sm text-label-sm text-secondary uppercase font-semibold">
                    Total Surface Coverage
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-primary">square_foot</span>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-headline-lg text-headline-lg text-on-surface font-bold font-data-tabular">
                    342.60 <span className="text-headline-sm font-normal">ha</span>
                  </span>
                  <span className="font-data-tabular text-data-tabular text-secondary">
                    (846.59 acres)
                  </span>
                </div>
                <span className="font-data-tabular text-data-tabular text-on-surface-variant mt-1">
                  3,426,000.00 m² combined parcel area
                </span>
              </div>

              <div className="p-4 rounded-lg bg-surface-container-low flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <span className="font-label-sm text-label-sm text-secondary uppercase font-semibold">
                    Linear Traversals
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-primary">linear_scale</span>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-headline-lg text-headline-lg text-on-surface font-bold font-data-tabular">
                    48.90 <span className="text-headline-sm font-normal">km</span>
                  </span>
                  <span className="font-body-xs text-body-xs text-secondary">total centerlines</span>
                </div>
                <span className="font-body-xs text-body-xs text-on-surface-variant mt-1">
                  68 boundary & easement polylines
                </span>
              </div>

              <div className="p-4 rounded-lg bg-surface-container-low flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <span className="font-label-sm text-label-sm text-secondary uppercase font-semibold">
                    Geographic Bounding Envelope
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-primary">crop_free</span>
                </div>
                <div className="mt-3 flex flex-col font-data-tabular text-data-tabular">
                  <span className="text-on-surface font-medium">[37.7420° N, -122.4412° W]</span>
                  <span className="text-secondary">[37.7850° N, -122.3890° W]</span>
                </div>
                <span className="font-body-xs text-body-xs text-on-surface-variant mt-1">
                  Karney Ellipsoidal Geodesic Calculation Method
                </span>
              </div>
            </div>
          </section>

          {/* Section 2: Largest Extents by Area */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-surface-container flex items-center justify-center font-data-tabular text-data-tabular text-primary font-semibold">
                  02
                </span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  Top Parcel Extents by Geodesic Area
                </h2>
              </div>
            </div>
            <div className="overflow-x-auto rounded-lg border border-outline-variant/30">
              <table className="w-full text-left text-body-sm font-body-sm">
                <thead className="bg-surface-container-low text-secondary font-label-sm text-label-sm uppercase">
                  <tr>
                    <th className="p-3">Rank</th>
                    <th className="p-3">Feature ID</th>
                    <th className="p-3">Zoning</th>
                    <th className="p-3 text-right">Area (ha)</th>
                    <th className="p-3 text-right">Area (m²)</th>
                    <th className="p-3 text-right">Perimeter (m)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20 font-data-tabular text-data-tabular">
                  <tr>
                    <td className="p-3 font-semibold text-primary">1</td>
                    <td className="p-3 font-bold text-on-surface">P-1043</td>
                    <td className="p-3 text-secondary">Mixed-Use MU-1</td>
                    <td className="p-3 text-right font-bold text-on-surface">24.50</td>
                    <td className="p-3 text-right text-secondary">245,000</td>
                    <td className="p-3 text-right text-secondary">2,110.8</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-primary">2</td>
                    <td className="p-3 font-bold text-on-surface">P-1044</td>
                    <td className="p-3 text-secondary">Commercial C-2</td>
                    <td className="p-3 text-right font-bold text-on-surface">19.30</td>
                    <td className="p-3 text-right text-secondary">193,000</td>
                    <td className="p-3 text-right text-secondary">1,760.5</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-primary">3</td>
                    <td className="p-3 font-bold text-on-surface">P-1040</td>
                    <td className="p-3 text-secondary">Industrial M-1</td>
                    <td className="p-3 text-right font-bold text-on-surface">18.22</td>
                    <td className="p-3 text-right text-secondary">182,200</td>
                    <td className="p-3 text-right text-secondary">1,820.4</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-primary">4</td>
                    <td className="p-3 font-bold text-on-surface">P-1039</td>
                    <td className="p-3 text-secondary">Industrial M-1</td>
                    <td className="p-3 text-right font-bold text-on-surface">16.80</td>
                    <td className="p-3 text-right text-secondary">168,000</td>
                    <td className="p-3 text-right text-secondary">1,690.0</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-primary">5</td>
                    <td className="p-3 font-bold text-on-surface">P-1042</td>
                    <td className="p-3 text-secondary">Commercial C-2</td>
                    <td className="p-3 text-right font-bold text-on-surface">12.48</td>
                    <td className="p-3 text-right text-secondary">124,800</td>
                    <td className="p-3 text-right text-secondary">1,482.6</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 3: Data Quality Findings */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-surface-container flex items-center justify-center font-data-tabular text-data-tabular text-primary font-semibold">
                  03
                </span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  Data Quality & Topological Compliance Audit
                </h2>
              </div>
            </div>
            <div className="p-4 bg-surface-container-low rounded-lg text-body-sm space-y-2">
              <div className="flex items-center gap-2 text-primary font-medium">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>99.5% Geometric Pass Rate (410 of 412 features compliant)</span>
              </div>
              <p className="font-body-xs text-on-surface-variant leading-relaxed">
                1 self-intersection defect identified on feature <code>P-0914</code> requiring polygon splitting or outer-ring vertex reconstruction. 1 sliver polygon flagged on feature <code>P-0772</code> with unusual aspect ratio.
              </p>
            </div>
          </section>

          {/* Official Signoff Block */}
          <footer className="pt-6 border-t border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">verified_user</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface font-bold">
                  Certified Digital Docket
                </span>
                <span className="font-body-xs text-body-xs text-secondary">
                  Digitally signed by GeoMeasure Core v1.4 Engine
                </span>
              </div>
            </div>
            <div className="text-right font-data-tabular text-data-tabular text-secondary text-xs">
              Docket Hash: SHA-256: 4f8b2d...91e3
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
};
