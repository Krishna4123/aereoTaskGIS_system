import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { aiService } from '../services/aiService';
import { AIMessage } from '../types/ai';
import { MOCK_COLLECTION } from '../services/mockData';
import { GeospatialMap } from '../components/map/GeospatialMap';

export const AIAnalystPage: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [highlightedFeatureId, setHighlightedFeatureId] = useState<string | null>('P-1043');

  useEffect(() => {
    setMessages(aiService.getInitialConversation());
  }, []);

  const handleSendPrompt = async (promptToSend?: string) => {
    const text = promptToSend || inputPrompt;
    if (!text.trim() || loading) return;

    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      authorName: 'Elena Rostova',
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' UTC',
      text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt('');
    setLoading(true);

    try {
      const res = await aiService.queryAI('ds-land-parcels-01', text);
      setMessages((prev) => [...prev, res.data]);

      if (res.data.structuredResults && res.data.structuredResults.length > 0) {
        setHighlightedFeatureId(res.data.structuredResults[0].featureId);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClearSession = () => {
    setMessages([]);
    setHighlightedFeatureId(null);
  };

  const handleExportDialogue = () => {
    const text = messages
      .map((m) => `[${m.timestamp}] ${m.authorName}: ${m.text}`)
      .join('\n\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai_analyst_session.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Sub-header Bar: Context, Badges, and Global Actions */}
      <div className="w-full bg-surface-container-lowest px-space-md py-space-sm flex flex-wrap items-center justify-between gap-space-sm border-b border-outline-variant/30 select-none">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-space-xs">
            <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight font-semibold">
              AI Analyst
            </h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-high text-primary font-label-sm text-label-sm font-medium">
              <span className="material-symbols-outlined text-[14px]">terminal</span>
              Deterministic GEOS Engine
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-secondary truncate">
            Explore and diagnose your geospatial data using calibrated natural language.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-space-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container text-on-surface-variant font-data-tabular text-data-tabular">
            <span className="w-2 h-2 rounded-full bg-primary-container" />
            <span className="font-medium text-on-surface">Active Dataset:</span>
            <span>land_parcels_traverse_survey.zip</span>
            <span className="text-secondary">(412 features, EPSG:4326)</span>
          </div>
          <button
            type="button"
            onClick={handleExportDialogue}
            className="h-8 px-2.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container-low text-secondary hover:text-on-surface font-label-md text-label-md flex items-center gap-1.5 transition-colors border border-outline-variant/30 shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">file_download</span>
            <span>Export Dialogue</span>
          </button>
          <button
            type="button"
            onClick={handleClearSession}
            className="h-8 px-2.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container-low text-secondary hover:text-error font-label-md text-label-md flex items-center gap-1.5 transition-colors border border-outline-variant/30 shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
            <span>Clear Session</span>
          </button>
        </div>
      </div>

      {/* Main Analysis Workspace: Split Panel */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-space-md p-space-md items-start">
        {/* LEFT PANEL: Query Execution & Conversational GIS Flow (col-span-7) */}
        <div className="lg:col-span-7 flex flex-col gap-space-md">
          {/* Quick Query Dispatcher Pills */}
          <div className="bg-surface-container-lowest p-space-sm rounded-xl flex flex-col gap-space-xs shadow-sm border border-outline-variant/20">
            <div className="flex items-center justify-between px-1">
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider flex items-center gap-1 font-semibold">
                <span className="material-symbols-outlined text-[14px] text-primary">psychology</span>
                Suggested Geospatial Queries
              </span>
              <span className="font-body-xs text-body-xs text-secondary">Click to inject</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { text: 'Find the five largest parcels', icon: 'filter_list' },
                { text: 'Summarize dataset topology', icon: 'schema' },
                { text: 'Find unusually small polygons (< 500 m²)', icon: 'warning' },
                { text: 'Explain data-quality issues', icon: 'verified' },
              ].map((pill) => (
                <button
                  key={pill.text}
                  type="button"
                  onClick={() => handleSendPrompt(pill.text)}
                  className="group flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container-low hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-[14px] text-primary group-hover:scale-110 transition-transform">
                    {pill.icon}
                  </span>
                  <span>{pill.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dialogue Timeline */}
          <div className="flex flex-col gap-space-md">
            {messages.map((msg) => (
              <div key={msg.id}>
                {msg.sender === 'user' ? (
                  /* User Message */
                  <div className="flex items-start gap-space-sm pl-4">
                    <div className="w-7 h-7 rounded-full bg-surface-container-highest flex items-center justify-center text-primary-container flex-shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[16px]">person</span>
                    </div>
                    <div className="flex flex-col min-w-0 max-w-[85%] bg-surface-container-lowest rounded-xl p-space-sm shadow-sm border border-outline-variant/20">
                      <div className="flex items-center justify-between gap-space-sm mb-1">
                        <span className="font-label-md text-label-md text-on-surface font-semibold">
                          {msg.authorName}
                        </span>
                        <span className="font-data-tabular text-data-tabular text-secondary">
                          {msg.timestamp}
                        </span>
                      </div>
                      <p className="font-body-md text-body-md text-on-surface">{msg.text}</p>
                    </div>
                  </div>
                ) : (
                  /* Assistant / Engine Response */
                  <div className="flex items-start gap-space-sm">
                    <div className="w-7 h-7 rounded-full bg-primary-container flex items-center justify-center text-on-primary flex-shrink-0 mt-0.5 shadow-sm">
                      <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                    </div>
                    <div className="flex flex-col min-w-0 flex-1 bg-surface-container-lowest rounded-xl p-space-md shadow-sm gap-space-md border border-outline-variant/20">
                      {/* Header explanation */}
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span className="font-label-md text-label-md text-primary flex items-center gap-1 font-semibold">
                            <span className="material-symbols-outlined text-[16px]">check_circle</span>
                            {msg.planId || 'GeoMeasure Spatial Execution Plan'}
                          </span>
                          <span className="font-data-tabular text-data-tabular text-secondary">
                            Latency: {msg.latencyMs || 140}ms
                          </span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          {msg.text}
                        </p>
                      </div>

                      {/* Structured Results Table if available */}
                      {msg.structuredResults && msg.structuredResults.length > 0 && (
                        <div className="w-full overflow-hidden rounded-lg bg-surface-container-low border border-outline-variant/20">
                          <div className="px-space-sm py-2 bg-surface-container flex items-center justify-between">
                            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold">
                              {msg.structuredResultsTitle || 'Extents by Metric'}
                            </span>
                            <span className="font-label-sm text-label-sm text-primary font-data-tabular">
                              {msg.structuredResultsMetricHeader || 'ST_Area(geography)'}
                            </span>
                          </div>
                          <div className="divide-y divide-surface-container">
                            {msg.structuredResults.map((item) => (
                              <div
                                key={item.featureId}
                                className={`px-space-sm py-2 flex items-center justify-between gap-space-sm transition-colors ${
                                  highlightedFeatureId === item.featureId
                                    ? 'bg-surface-container-high/60 border-l-2 border-primary'
                                    : 'bg-surface-container-lowest hover:bg-surface-container-high'
                                }`}
                              >
                                <div className="flex items-center gap-space-sm min-w-0">
                                  <span className="w-5 h-5 rounded-full bg-primary-container text-on-primary font-data-tabular text-data-tabular flex items-center justify-center flex-shrink-0 text-xs">
                                    {item.rank}
                                  </span>
                                  <div className="flex flex-col min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-label-md text-label-md text-on-surface font-semibold">
                                        Feature {item.featureId}
                                      </span>
                                      {item.zoning && (
                                        <span className="px-1.5 py-0.2 rounded bg-surface-container text-secondary font-label-sm text-label-sm">
                                          {item.zoning}
                                        </span>
                                      )}
                                    </div>
                                    <span className="font-body-xs text-body-xs text-secondary truncate">
                                      {item.notes || `Centroid: [${item.centroid?.[0]}, ${item.centroid?.[1]}]`}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-space-sm flex-shrink-0">
                                  <div className="text-right">
                                    <div className="font-data-tabular text-body-sm font-semibold text-on-surface">
                                      {item.areaHa !== undefined ? `${item.areaHa} ha` : `${item.lengthM} m`}
                                    </div>
                                    <div className="font-data-tabular text-body-xs text-secondary">
                                      {item.areaM2 ? `${item.areaM2.toLocaleString()} m²` : ''}
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setHighlightedFeatureId(item.featureId)}
                                    className="h-7 px-2 rounded bg-surface-container hover:bg-primary-container hover:text-on-primary text-secondary font-label-sm text-label-sm flex items-center gap-1 transition-colors"
                                  >
                                    <span className="material-symbols-outlined text-[14px]">pin_drop</span>
                                    <span>Highlight</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 p-4 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20">
                <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                <span className="font-body-sm text-secondary">Executing spatial geodetic query plan...</span>
              </div>
            )}
          </div>

          {/* User Input Bar */}
          <div className="sticky bottom-4 bg-surface-container-lowest p-2 rounded-xl shadow-md border border-outline-variant/30 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary ml-2 text-[20px]">
              terminal
            </span>
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt()}
              placeholder="Ask a natural language query (e.g. Find largest parcels, identify slivers)..."
              className="flex-1 h-9 px-2 bg-transparent text-body-sm text-on-surface placeholder:text-outline focus:outline-none"
            />
            <button
              type="button"
              disabled={loading || !inputPrompt.trim()}
              onClick={() => handleSendPrompt()}
              className="h-8 px-4 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md hover:bg-primary disabled:opacity-50 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>Execute</span>
              <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
            </button>
          </div>
        </div>

        {/* RIGHT PANEL: Live Geospatial Inspector & Synchronized Map (col-span-5) */}
        <div className="lg:col-span-5 flex flex-col gap-space-md sticky top-16">
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden flex flex-col">
            <div className="px-space-md py-2.5 bg-surface-container-low flex items-center justify-between border-b border-outline-variant/20">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[18px]">map</span>
                <span className="font-label-md text-label-md text-on-surface font-semibold">
                  Synchronized Map Viewport
                </span>
              </div>
              {highlightedFeatureId && (
                <span className="font-label-sm text-label-sm text-primary bg-surface-container px-2 py-0.5 rounded font-data-tabular">
                  Focused: {highlightedFeatureId}
                </span>
              )}
            </div>

            {/* Interactive Leaflet Map Viewport */}
            <div className="h-[420px] w-full relative">
              <GeospatialMap
                collection={MOCK_COLLECTION}
                selectedFeatureId={highlightedFeatureId}
                onSelectFeature={(id) => setHighlightedFeatureId(id)}
              />
            </div>

            {/* Selected Feature Card */}
            {highlightedFeatureId && (
              <div className="p-space-md border-t border-outline-variant/20 flex items-center justify-between">
                <div>
                  <span className="font-label-md text-label-md text-on-surface block font-semibold">
                    Target Feature #{highlightedFeatureId}
                  </span>
                  <span className="font-body-xs text-body-xs text-secondary">
                    Matched from natural language geospatial query
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => navigate(`/datasets/ds-land-parcels-01`)}
                  className="h-7 px-3 rounded bg-surface-container hover:bg-primary-container hover:text-on-primary text-primary font-label-sm text-label-sm transition-colors flex items-center gap-1"
                >
                  <span>Open in Workspace</span>
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
