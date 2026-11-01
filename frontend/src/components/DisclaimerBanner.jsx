import React, { useState } from 'react';
import { AlertTriangle, Info, X, ShieldAlert } from 'lucide-react';

export const DisclaimerBanner = ({ isDemo = true }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative mb-6 rounded-xl border border-emerald-500/30 bg-forest-900/80 p-4 shadow-lg backdrop-blur-md">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-lg bg-emerald-500/20 p-2 text-emerald-400">
            <Info className="h-5 w-5" />
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-emerald-300">
                {isDemo ? 'DATA TRANSPARENCY: SYNTHETIC DEMO DATASET ACTIVE' : 'USER DATASET LOADED'}
              </span>
              {isDemo && (
                <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-semibold text-amber-300 border border-amber-500/30">
                  DEMO (2000–2023)
                </span>
              )}
            </div>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {isDemo
                ? 'This system is currently populated with high-fidelity simulated historical records across 11 Indian states and 8 staple crops for demonstration purposes. Use the CSV Upload feature to ingest authentic governmental or field datasets.'
                : 'Showing user-uploaded crop production dataset.'}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-emerald-400/90 border-t border-emerald-800/40 pt-2">
              <span>
                • <strong className="text-emerald-200">Aggregate Yield Formula:</strong> Calculated as Total Production (MT) ÷ Total Cultivated Area (Ha).
              </span>
              <span>
                • <strong className="text-emerald-200">Agronomic Disclaimer:</strong> Rainfall and production reflect observational correlations. No direct causality is claimed without localized soil, irrigation, and agronomic verification.
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="self-start rounded-lg p-1 text-slate-400 hover:bg-forest-800 hover:text-slate-200 transition-colors"
          title="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default DisclaimerBanner;
