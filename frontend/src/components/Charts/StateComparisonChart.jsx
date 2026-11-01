import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { formatProduction, formatYield, formatArea } from '../../utils/formatters';
import { MapPin, Trophy } from 'lucide-react';

export const StateComparisonChart = ({ data = [], isLoading = false }) => {
  const [metric, setMetric] = useState('production'); // 'production' or 'yield'

  if (isLoading) {
    return (
      <div className="agri-card rounded-2xl p-6 h-80 flex items-center justify-center">
        <div className="flex items-center gap-2 text-emerald-400">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
          <span>Loading state comparisons...</span>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="agri-card rounded-2xl p-6 h-80 flex flex-col items-center justify-center text-slate-400">
        <MapPin className="h-8 w-8 text-emerald-600/50 mb-2" />
        <p>No state comparative data available for selected filter combination.</p>
      </div>
    );
  }

  // Sort according to active metric
  const sortedData = [...data].sort((a, b) => {
    if (metric === 'yield') {
      return b.aggregate_yield - a.aggregate_yield;
    }
    return b.production_tonnes - a.production_tonnes;
  });

  return (
    <div className="agri-card rounded-2xl p-5 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">State-Wise Agricultural Rankings</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Comparative performance across top contributing agricultural states
          </p>
        </div>

        {/* Metric switch */}
        <div className="flex items-center rounded-xl bg-forest-950/80 p-1 border border-emerald-850/60 self-start sm:self-auto">
          <button
            onClick={() => setMetric('production')}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
              metric === 'production'
                ? 'bg-emerald-600 text-forest-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            By Production (MT)
          </button>
          <button
            onClick={() => setMetric('yield')}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
              metric === 'yield'
                ? 'bg-emerald-600 text-forest-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            By Yield (MT/Ha)
          </button>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#064e3b" strokeOpacity={0.3} horizontal={false} />
            <XAxis
              type="number"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              tickFormatter={(val) =>
                metric === 'production' ? formatProduction(val, true) : `${val} MT/Ha`
              }
            />
            <YAxis
              type="category"
              dataKey="state"
              stroke="#cbd5e1"
              fontSize={12}
              tickLine={false}
              width={95}
            />
            <Tooltip content={<CustomTooltip metric={metric} />} />
            <Bar
              dataKey={metric === 'production' ? 'production_tonnes' : 'aggregate_yield'}
              radius={[0, 6, 6, 0]}
            >
              {sortedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    index === 0
                      ? '#10b981'
                      : index === 1
                      ? '#34d399'
                      : index === 2
                      ? '#059669'
                      : '#065f46'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload, metric }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="rounded-xl border border-emerald-700/60 bg-forest-950/95 p-3 shadow-xl backdrop-blur-md text-xs">
        <p className="font-bold text-white mb-1.5 border-b border-emerald-800/40 pb-1 flex items-center justify-between gap-4">
          <span>{d.state}</span>
          <span className="text-[10px] text-emerald-400 font-normal">
            {d.record_count} records
          </span>
        </p>
        <div className="space-y-1">
          <div className="flex justify-between gap-4 text-amber-300">
            <span>Production:</span>
            <span className="font-mono font-bold">{formatProduction(d.production_tonnes)}</span>
          </div>
          <div className="flex justify-between gap-4 text-emerald-300">
            <span>Cultivated Area:</span>
            <span className="font-mono font-bold">{formatArea(d.area_hectares)}</span>
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

export default StateComparisonChart;
