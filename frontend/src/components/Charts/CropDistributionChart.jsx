import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { formatProduction, formatYield, formatPercent } from '../../utils/formatters';
import { PieChart as PieIcon } from 'lucide-react';

const CROP_COLORS = [
  '#10b981', // Emerald (Rice)
  '#f59e0b', // Amber (Wheat)
  '#06b6d4', // Cyan (Cotton)
  '#84cc16', // Lime (Sugarcane)
  '#f97316', // Orange (Maize)
  '#8b5cf6', // Purple (Pulses)
  '#14b8a6', // Teal (Groundnut)
  '#ec4899', // Pink (Soybean)
  '#6366f1', // Indigo
  '#eab308', // Yellow
];

export const CropDistributionChart = ({ data = [], isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="agri-card rounded-2xl p-6 h-80 flex items-center justify-center">
        <div className="flex items-center gap-2 text-emerald-400">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
          <span>Loading crop distribution...</span>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="agri-card rounded-2xl p-6 h-80 flex flex-col items-center justify-center text-slate-400">
        <PieIcon className="h-8 w-8 text-emerald-600/50 mb-2" />
        <p>No crop production data for current filters.</p>
      </div>
    );
  }

  return (
    <div className="agri-card rounded-2xl p-5 shadow-lg">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <PieIcon className="h-5 w-5 text-emerald-400" />
          <h3 className="text-base font-bold text-white">Crop Production Share & Yields</h3>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Distribution of aggregate harvest volumes across staple crops
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Donut Chart */}
        <div className="h-56 md:col-span-5 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={data}
                dataKey="production_tonnes"
                nameKey="crop"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CROP_COLORS[index % CROP_COLORS.length]}
                    stroke="#042718"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Breakdown List */}
        <div className="md:col-span-7 space-y-2 max-h-56 overflow-y-auto pr-2">
          {data.map((item, idx) => (
            <div
              key={item.crop}
              className="flex items-center justify-between rounded-xl border border-emerald-900/30 bg-forest-950/60 px-3 py-2 text-xs hover:border-emerald-700/50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="h-3 w-3 rounded-full shrink-0"
                  style={{ backgroundColor: CROP_COLORS[idx % CROP_COLORS.length] }}
                />
                <span className="font-semibold text-slate-200">{item.crop}</span>
              </div>

              <div className="flex items-center gap-4 text-right">
                <div>
                  <span className="font-mono text-emerald-300 font-bold">
                    {formatPercent(item.percentage_share)}
                  </span>
                  <div className="text-[10px] text-slate-400">
                    {formatProduction(item.production_tonnes, true)}
                  </div>
                </div>
                <div className="w-16 text-right">
                  <span className="font-mono text-teal-300 font-semibold">
                    {formatYield(item.aggregate_yield)}
                  </span>
                  <div className="text-[10px] text-slate-400">Yield</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="rounded-xl border border-emerald-700/60 bg-forest-950/95 p-3 shadow-xl backdrop-blur-md text-xs">
        <p className="font-bold text-white mb-1.5 border-b border-emerald-800/40 pb-1 flex justify-between gap-4">
          <span>{d.crop}</span>
          <span className="text-emerald-400 font-mono">{formatPercent(d.percentage_share)}</span>
        </p>
        <div className="space-y-1">
          <div className="flex justify-between gap-4 text-amber-300">
            <span>Production:</span>
            <span className="font-mono font-bold">{formatProduction(d.production_tonnes)}</span>
          </div>
          <div className="flex justify-between gap-4 text-teal-300">
            <span>Aggregate Yield:</span>
            <span className="font-mono font-bold">{formatYield(d.aggregate_yield)}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default CropDistributionChart;
