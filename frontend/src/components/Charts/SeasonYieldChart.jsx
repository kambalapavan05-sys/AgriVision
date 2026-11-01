import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { formatProduction, formatYield } from '../../utils/formatters';
import { SunMedium } from 'lucide-react';

export const SeasonYieldChart = ({ data = [], isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="agri-card rounded-2xl p-6 h-80 flex items-center justify-center">
        <div className="flex items-center gap-2 text-emerald-400">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
          <span>Loading seasonal statistics...</span>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="agri-card rounded-2xl p-6 h-80 flex flex-col items-center justify-center text-slate-400">
        <SunMedium className="h-8 w-8 text-emerald-600/50 mb-2" />
        <p>No seasonal data available for current filters.</p>
      </div>
    );
  }

  return (
    <div className="agri-card rounded-2xl p-5 shadow-lg">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <SunMedium className="h-5 w-5 text-amber-400" />
          <h3 className="text-base font-bold text-white">Cropping Season Breakdown</h3>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Agricultural volumes and productivity across Kharif, Rabi, Zaid, and Whole Year seasons
        </p>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#064e3b" strokeOpacity={0.4} />
            <XAxis dataKey="season" stroke="#64748b" fontSize={12} tickLine={false} />
            <YAxis
              yAxisId="prod"
              stroke="#f59e0b"
              fontSize={11}
              tickLine={false}
              tickFormatter={(val) => formatProduction(val, true)}
            />
            <YAxis
              yAxisId="yield"
              orientation="right"
              stroke="#10b981"
              fontSize={11}
              tickLine={false}
              tickFormatter={(val) => `${val} MT/Ha`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: '10px', fontSize: '12px' }}
            />
            <Bar
              yAxisId="prod"
              dataKey="production_tonnes"
              name="Production (MT)"
              fill="#f59e0b"
              radius={[4, 4, 0, 0]}
              opacity={0.85}
            />
            <Bar
              yAxisId="yield"
              dataKey="aggregate_yield"
              name="Aggregate Yield (MT/Ha)"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
              opacity={0.9}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="rounded-xl border border-emerald-700/60 bg-forest-950/95 p-3 shadow-xl backdrop-blur-md text-xs">
        <p className="font-bold text-white mb-1.5 border-b border-emerald-800/40 pb-1">
          Season: {label}
        </p>
        <div className="space-y-1">
          <div className="flex justify-between gap-4 text-amber-300">
            <span>Production:</span>
            <span className="font-mono font-bold">{formatProduction(d.production_tonnes)}</span>
          </div>
          <div className="flex justify-between gap-4 text-emerald-300">
            <span>Aggregate Yield:</span>
            <span className="font-mono font-bold">{formatYield(d.aggregate_yield)}</span>
          </div>
          <div className="flex justify-between gap-4 text-slate-300">
            <span>Cultivated Area:</span>
            <span className="font-mono font-bold">{formatProduction(d.area_hectares).replace('MT', 'Ha')}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default SeasonYieldChart;
