import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { formatProduction, formatArea, formatYield } from '../../utils/formatters';
import { TrendingUp, BarChart2 } from 'lucide-react';

export const ProductionTrendChart = ({ data = [], isLoading = false }) => {
  const [viewMode, setViewMode] = useState('both'); // 'both', 'yield', 'rainfall'

  if (isLoading) {
    return (
      <div className="agri-card rounded-2xl p-6 h-96 flex items-center justify-center">
        <div className="flex items-center gap-2 text-emerald-400">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
          <span>Loading historical trend models...</span>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="agri-card rounded-2xl p-6 h-96 flex flex-col items-center justify-center text-slate-400">
        <BarChart2 className="h-10 w-10 text-emerald-600/50 mb-2" />
        <p>No historical production trend data available for selected filters.</p>
      </div>
    );
  }

  return (
    <div className="agri-card rounded-2xl p-5 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Historical Production & Acreage Trends</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Annual agricultural trajectory and aggregated yield progression (2000–2023)
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center rounded-xl bg-forest-950/80 p-1 border border-emerald-850/60 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('both')}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
              viewMode === 'both'
                ? 'bg-emerald-600 text-forest-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Production & Area
          </button>
          <button
            onClick={() => setViewMode('yield')}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
              viewMode === 'yield'
                ? 'bg-emerald-600 text-forest-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Aggregate Yield
          </button>
          <button
            onClick={() => setViewMode('rainfall')}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
              viewMode === 'rainfall'
                ? 'bg-emerald-600 text-forest-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Rainfall Overlay
          </button>
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#064e3b" strokeOpacity={0.4} />
            <XAxis
              dataKey="year"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              tick={{ fill: '#94a3b8' }}
            />

            {viewMode === 'both' && (
              <>
                <YAxis
                  yAxisId="left"
                  stroke="#f59e0b"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => formatProduction(val, true)}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#10b981"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => formatArea(val, true)}
                />
                <Tooltip content={<CustomTooltipBoth />} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ paddingBottom: '10px', fontSize: '12px' }}
                />
                <Bar
                  yAxisId="left"
                  dataKey="production_tonnes"
                  name="Production (MT)"
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                  opacity={0.85}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="area_hectares"
                  name="Cultivated Area (Ha)"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#10b981' }}
                  activeDot={{ r: 5 }}
                />
              </>
            )}

            {viewMode === 'yield' && (
              <>
                <YAxis
                  stroke="#38bdf8"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `${val} MT/Ha`}
                />
                <Tooltip content={<CustomTooltipYield />} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ paddingBottom: '10px', fontSize: '12px' }}
                />
                <Line
                  type="monotone"
                  dataKey="aggregate_yield"
                  name="Aggregate Yield (MT/Ha)"
                  stroke="#38bdf8"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#38bdf8' }}
                  activeDot={{ r: 6 }}
                />
              </>
            )}

            {viewMode === 'rainfall' && (
              <>
                <YAxis
                  yAxisId="left"
                  stroke="#f59e0b"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => formatProduction(val, true)}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#38bdf8"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `${val} mm`}
                />
                <Tooltip content={<CustomTooltipRainfall />} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ paddingBottom: '10px', fontSize: '12px' }}
                />
                <Bar
                  yAxisId="left"
                  dataKey="production_tonnes"
                  name="Production (MT)"
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                  opacity={0.7}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="rainfall_mm"
                  name="Mean Rainfall (mm)"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 3, fill: '#38bdf8' }}
                />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Custom tooltips
const CustomTooltipBoth = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-xl border border-emerald-700/60 bg-forest-950/95 p-3 shadow-xl backdrop-blur-md text-xs">
        <p className="font-bold text-white mb-1.5 border-b border-emerald-800/40 pb-1">
          Harvest Year: {label}
        </p>
        <div className="space-y-1">
          <div className="flex justify-between gap-4 text-amber-300">
            <span>Production:</span>
            <span className="font-mono font-bold">{formatProduction(data.production_tonnes)}</span>
          </div>
          <div className="flex justify-between gap-4 text-emerald-300">
            <span>Cultivated Area:</span>
            <span className="font-mono font-bold">{formatArea(data.area_hectares)}</span>
          </div>
          <div className="flex justify-between gap-4 text-teal-300">
            <span>Aggregate Yield:</span>
            <span className="font-mono font-bold">{formatYield(data.aggregate_yield)}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const CustomTooltipYield = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-xl border border-sky-700/60 bg-forest-950/95 p-3 shadow-xl backdrop-blur-md text-xs">
        <p className="font-bold text-white mb-1.5 border-b border-sky-800/40 pb-1">Year: {label}</p>
        <div className="flex justify-between gap-4 text-sky-300">
          <span>Aggregate Yield:</span>
          <span className="font-mono font-bold">{formatYield(data.aggregate_yield)}</span>
        </div>
        <p className="text-[10px] text-slate-400 mt-1">Computed as: Σ Production ÷ Σ Area</p>
      </div>
    );
  }
  return null;
};

const CustomTooltipRainfall = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-xl border border-emerald-700/60 bg-forest-950/95 p-3 shadow-xl backdrop-blur-md text-xs">
        <p className="font-bold text-white mb-1.5 border-b border-emerald-800/40 pb-1">Year: {label}</p>
        <div className="space-y-1">
          <div className="flex justify-between gap-4 text-amber-300">
            <span>Production:</span>
            <span className="font-mono font-bold">{formatProduction(data.production_tonnes)}</span>
          </div>
          <div className="flex justify-between gap-4 text-sky-300">
            <span>Precipitation:</span>
            <span className="font-mono font-bold">{data.rainfall_mm} mm</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default ProductionTrendChart;
