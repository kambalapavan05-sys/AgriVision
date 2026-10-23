import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { formatProduction, formatYield } from '../../utils/formatters';
import { CloudRain, Info, AlertCircle } from 'lucide-react';

export const RainfallScatterChart = ({ data, isLoading = false }) => {
  const [metric, setMetric] = useState('yield'); // 'yield' or 'production'

  const points = data?.points || [];
  const pearsonR = data?.pearson_r;
  const sampleSize = data?.sample_size || points.length;
  const interpretation = data?.correlation_interpretation;
  const disclaimer = data?.disclaimer;

  if (isLoading) {
    return (
      <div className="agri-card rounded-2xl p-6 h-96 flex items-center justify-center">
        <div className="flex items-center gap-2 text-emerald-400">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
          <span>Modeling rainfall vs production scatter plot...</span>
        </div>
      </div>
    );
  }

  if (!points || points.length === 0) {
    return (
      <div className="agri-card rounded-2xl p-6 h-96 flex flex-col items-center justify-center text-slate-400">
        <CloudRain className="h-8 w-8 text-emerald-600/50 mb-2" />
        <p>No scatter data points available for the current filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="agri-card rounded-2xl p-5 shadow-lg space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <CloudRain className="h-5 w-5 text-sky-400" />
            <h3 className="text-base font-bold text-white">
              Precipitation vs Agronomic Output Correlation
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Observational scatter analysis across sample agricultural districts (n = {sampleSize})
          </p>
        </div>

        {/* Metric switch */}
        <div className="flex items-center rounded-xl bg-forest-950/80 p-1 border border-emerald-850/60 self-start sm:self-auto">
          <button
            onClick={() => setMetric('yield')}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
              metric === 'yield'
                ? 'bg-emerald-600 text-forest-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Yield (MT/Ha)
          </button>
          <button
            onClick={() => setMetric('production')}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
              metric === 'production'
                ? 'bg-emerald-600 text-forest-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Production (MT)
          </button>
        </div>
      </div>

      {/* Statistical correlation summary pill */}
      {pearsonR !== null && pearsonR !== undefined && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-sky-500/20 bg-sky-950/30 px-3.5 py-2 text-xs">
          <div className="flex items-center gap-1.5 text-sky-300 font-bold">
            <span>Pearson Correlation:</span>
            <span className="font-mono text-sm bg-sky-500/20 px-2 py-0.5 rounded border border-sky-500/30 text-white">
              r = {pearsonR > 0 ? `+${pearsonR.toFixed(3)}` : pearsonR.toFixed(3)}
            </span>
          </div>
          <p className="text-slate-300 text-[11px] flex-1">
            {interpretation}
          </p>
        </div>
      )}

      {/* Scatter Chart */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 15 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#064e3b" strokeOpacity={0.4} />
            <XAxis
              type="number"
              dataKey="rainfall_mm"
              name="Rainfall"
              unit=" mm"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              label={{
                value: 'Annual Precipitation (mm)',
                position: 'insideBottom',
                offset: -12,
                fill: '#94a3b8',
                fontSize: 12,
              }}
            />
            <YAxis
              type="number"
              dataKey={metric === 'yield' ? 'yield_tonnes_per_ha' : 'production_tonnes'}
              name={metric === 'yield' ? 'Yield' : 'Production'}
              unit={metric === 'yield' ? ' MT/Ha' : ' MT'}
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              tickFormatter={(val) =>
                metric === 'yield' ? `${val}` : formatProduction(val, true)
              }
              label={{
                value: metric === 'yield' ? 'Yield (MT/Ha)' : 'Production (MT)',
                angle: -90,
                position: 'insideLeft',
                offset: -2,
                fill: '#94a3b8',
                fontSize: 12,
              }}
            />
            <Tooltip content={<CustomScatterTooltip metric={metric} />} />
            <Scatter
              name="Agricultural Records"
              data={points}
              fill="#10b981"
              stroke="#34d399"
              strokeWidth={1}
              opacity={0.8}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Prominent Scientific Non-Causality Disclaimer Callout */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3.5 text-xs text-amber-200/90 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-amber-300 uppercase tracking-wide text-[11px]">
            Statistical & Agronomic Notice: Correlation ≠ Causation
          </span>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            {disclaimer ||
              'Rainfall represents observed seasonal precipitation. Actual agricultural yield is determined by multifactorial systems: canal/borewell irrigation infrastructure, soil nutrient stoichiometry (NPK/organic carbon), crop genetics, timely pest management, and localized heat/flood shocks. No causal relationship is claimed.'}
          </p>
        </div>
      </div>
    </div>
  );
};

const CustomScatterTooltip = ({ active, payload, metric }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-xl border border-emerald-700/60 bg-forest-950/95 p-3 shadow-xl backdrop-blur-md text-xs">
        <p className="font-bold text-white mb-1.5 border-b border-emerald-800/40 pb-1">
          {data.district}, {data.state} ({data.crop_year})
        </p>
        <div className="space-y-1">
          <div className="flex justify-between gap-4 text-emerald-300">
            <span>Crop:</span>
            <span className="font-semibold text-white">{data.crop}</span>
          </div>
          <div className="flex justify-between gap-4 text-sky-300">
            <span>Precipitation:</span>
            <span className="font-mono font-bold">{data.rainfall_mm} mm</span>
          </div>
          <div className="flex justify-between gap-4 text-teal-300">
            <span>Yield:</span>
            <span className="font-mono font-bold">{formatYield(data.yield_tonnes_per_ha)}</span>
          </div>
          <div className="flex justify-between gap-4 text-amber-300">
            <span>Production:</span>
            <span className="font-mono font-bold">{formatProduction(data.production_tonnes)}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default RainfallScatterChart;
