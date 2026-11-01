import React from 'react';
import {
  X,
  Printer,
  Download,
  FileText,
  Wheat,
  Layers,
  Calendar,
  MapPin,
  Trees,
  TrendingUp,
} from 'lucide-react';
import { api } from '../services/api';
import {
  formatProduction,
  formatArea,
  formatYield,
  formatRainfall,
} from '../utils/formatters';

export const ReportModal = ({
  isOpen,
  onClose,
  kpis,
  filters,
  metadata,
  stateComparisons = [],
  cropDistributions = [],
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const activeState = filters.state || 'All States';
  const activeCrop = filters.crop || 'All Crops';
  const startYear = filters.year_start || metadata?.min_year || 2000;
  const endYear = filters.year_end || metadata?.max_year || 2023;
  const activeSeason = filters.season || 'All Seasons';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl rounded-3xl border border-emerald-700/50 bg-forest-950 p-6 sm:p-8 shadow-2xl z-10 max-h-[92vh] overflow-y-auto print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Header (hidden in print) */}
        <div className="flex items-center justify-between border-b border-emerald-900/50 pb-4 mb-6 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-400 border border-emerald-500/20">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Agricultural Intelligence Executive Summary</h3>
              <p className="text-xs text-slate-400">
                Filtered crop production, land utilization, and aggregate yield report
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-forest-950 hover:bg-emerald-500 transition-colors shadow-sm"
            >
              <Printer className="h-4 w-4" />
              <span>Print / PDF</span>
            </button>
            <a
              href={api.getExportUrl('csv', filters)}
              download
              className="flex items-center gap-1.5 rounded-xl border border-emerald-700/50 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-forest-900 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>CSV</span>
            </a>
            <a
              href={api.getExportUrl('json', filters)}
              download
              className="flex items-center gap-1.5 rounded-xl border border-emerald-700/50 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-forest-900 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>JSON</span>
            </a>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-forest-900 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="space-y-6">
          {/* Document Title & Metadata */}
          <div className="border-b border-emerald-800/40 pb-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight">
                  AgriVision – Crop Production Analysis Report
                </h1>
                <p className="text-xs text-emerald-400 font-mono mt-1">
                  Generated: {new Date().toLocaleDateString()} | Scope: {activeState} • {activeCrop} • {startYear}–{endYear}
                </p>
              </div>
              <div className="text-right">
                <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300 border border-amber-500/20">
                  {kpis?.is_demo ? 'SYNTHETIC DEMO DATASET' : 'VERIFIED DATASET'}
                </span>
              </div>
            </div>

            {/* Scope Filter Tags */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="rounded-lg bg-forest-900/60 p-2 border border-emerald-900/40">
                <span className="text-slate-400 text-[10px] block">State Scope:</span>
                <span className="font-semibold text-slate-200">{activeState}</span>
              </div>
              <div className="rounded-lg bg-forest-900/60 p-2 border border-emerald-900/40">
                <span className="text-slate-400 text-[10px] block">Crop Scope:</span>
                <span className="font-semibold text-emerald-300">{activeCrop}</span>
              </div>
              <div className="rounded-lg bg-forest-900/60 p-2 border border-emerald-900/40">
                <span className="text-slate-400 text-[10px] block">Time Window:</span>
                <span className="font-semibold text-slate-200">{startYear} – {endYear}</span>
              </div>
              <div className="rounded-lg bg-forest-900/60 p-2 border border-emerald-900/40">
                <span className="text-slate-400 text-[10px] block">Cropping Season:</span>
                <span className="font-semibold text-slate-200">{activeSeason}</span>
              </div>
            </div>
          </div>

          {/* Key Executive Metrics */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-3">
              Executive Key Performance Indicators
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl border border-amber-500/20 bg-forest-900/50 p-3">
                <span className="text-[11px] text-slate-400 block">Total Production</span>
                <span className="text-lg font-bold font-mono text-amber-300">
                  {formatProduction(kpis?.total_production_tonnes)}
                </span>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-forest-900/50 p-3">
                <span className="text-[11px] text-slate-400 block">Cultivated Area</span>
                <span className="text-lg font-bold font-mono text-emerald-300">
                  {formatArea(kpis?.total_area_hectares)}
                </span>
              </div>
              <div className="rounded-xl border border-teal-500/20 bg-forest-900/50 p-3">
                <span className="text-[11px] text-slate-400 block">Aggregate Yield</span>
                <span className="text-lg font-bold font-mono text-teal-300">
                  {formatYield(kpis?.aggregate_yield)}
                </span>
              </div>
              <div className="rounded-xl border border-sky-500/20 bg-forest-900/50 p-3">
                <span className="text-[11px] text-slate-400 block">Mean Precipitation</span>
                <span className="text-lg font-bold font-mono text-sky-300">
                  {formatRainfall(kpis?.average_rainfall_mm)}
                </span>
              </div>
            </div>
          </div>

          {/* Top States Table */}
          {stateComparisons.length > 0 && (
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-2">
                Top Contributing States
              </h4>
              <div className="overflow-x-auto rounded-xl border border-emerald-900/40">
                <table className="w-full text-left text-xs">
                  <thead className="bg-forest-900/70 text-slate-300">
                    <tr>
                      <th className="px-3 py-2">Rank</th>
                      <th className="px-3 py-2">State</th>
                      <th className="px-3 py-2 text-right">Production (MT)</th>
                      <th className="px-3 py-2 text-right">Area (Ha)</th>
                      <th className="px-3 py-2 text-right">Aggregate Yield (MT/Ha)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-950 text-slate-200">
                    {stateComparisons.slice(0, 5).map((st, i) => (
                      <tr key={st.state}>
                        <td className="px-3 py-1.5 font-bold text-emerald-400">#{i + 1}</td>
                        <td className="px-3 py-1.5 font-medium">{st.state}</td>
                        <td className="px-3 py-1.5 text-right font-mono text-amber-300">
                          {formatProduction(st.production_tonnes)}
                        </td>
                        <td className="px-3 py-1.5 text-right font-mono text-slate-300">
                          {formatArea(st.area_hectares)}
                        </td>
                        <td className="px-3 py-1.5 text-right font-mono text-teal-300 font-bold">
                          {formatYield(st.aggregate_yield)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Methodological Notice */}
          <div className="rounded-xl border border-emerald-900/40 bg-forest-900/30 p-4 text-xs text-slate-400 space-y-1.5">
            <span className="font-bold text-slate-300 block">Methodological Standards:</span>
            <p>
              • Aggregate yield is calculated strictly as \(\sum \text{Production (MT)} \div \sum \text{Area (Ha)}\). Records with zero area are safeguarded against arithmetic division errors.
            </p>
            <p>
              • Observed rainfall data represents regional annual precipitation averages. Yield determinants in field agriculture include irrigation, fertilization, genetics, and pest control. No causal claims are asserted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
