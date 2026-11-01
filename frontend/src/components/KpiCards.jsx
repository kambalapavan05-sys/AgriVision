import React from 'react';
import {
  Wheat,
  Trees,
  TrendingUp,
  CloudRain,
  Layers,
  HelpCircle,
} from 'lucide-react';
import {
  formatProduction,
  formatArea,
  formatYield,
  formatRainfall,
  formatNumber,
} from '../utils/formatters';

export const KpiCards = ({ kpis, isLoading = false }) => {
  const {
    total_production_tonnes = 0,
    total_area_hectares = 0,
    aggregate_yield = 0,
    average_rainfall_mm = 0,
    record_count = 0,
  } = kpis || {};

  const cards = [
    {
      title: 'Total Production',
      value: formatProduction(total_production_tonnes, true),
      fullValue: formatProduction(total_production_tonnes, false),
      unit: 'Metric Tonnes (MT)',
      icon: Wheat,
      color: 'text-amber-400',
      badgeBg: 'bg-amber-400/10 border-amber-400/20 text-amber-300',
      borderColor: 'border-amber-500/20',
      description: 'Gross agricultural output across selected filter criteria.',
    },
    {
      title: 'Cultivated Area',
      value: formatArea(total_area_hectares, true),
      fullValue: formatArea(total_area_hectares, false),
      unit: 'Hectares (Ha)',
      icon: Trees,
      color: 'text-emerald-400',
      badgeBg: 'bg-emerald-400/10 border-emerald-400/20 text-emerald-300',
      borderColor: 'border-emerald-500/20',
      description: 'Total land area under crop cultivation.',
    },
    {
      title: 'Aggregate Yield',
      value: formatYield(aggregate_yield),
      fullValue: `${aggregate_yield.toFixed(3)} MT/Ha`,
      unit: 'MT / Hectare',
      icon: TrendingUp,
      color: 'text-teal-300',
      badgeBg: 'bg-teal-400/10 border-teal-400/20 text-teal-300',
      borderColor: 'border-teal-500/20',
      description: 'Calculated strictly as Total Production ÷ Total Cultivated Area.',
      formula: 'Σ Production / Σ Area',
    },
    {
      title: 'Mean Rainfall',
      value: formatRainfall(average_rainfall_mm),
      fullValue: `${average_rainfall_mm.toFixed(1)} mm`,
      unit: 'Millimeters (mm)',
      icon: CloudRain,
      color: 'text-sky-400',
      badgeBg: 'bg-sky-400/10 border-sky-400/20 text-sky-300',
      borderColor: 'border-sky-500/20',
      description: 'Observed annual precipitation (non-causal baseline indicator).',
    },
  ];

  return (
    <div className="mb-6 space-y-3">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`agri-card agri-card-hover rounded-2xl p-4 sm:p-5 transition-all ${
                card.borderColor
              } ${isLoading ? 'opacity-70 animate-pulse' : ''}`}
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {card.title}
                </span>
                <div className={`rounded-xl border p-2 ${card.badgeBg}`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </div>

              <div className="mt-3">
                <div
                  className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono"
                  title={card.fullValue}
                >
                  {isLoading ? '...' : card.value}
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
                  <span>{card.unit}</span>
                  {card.formula && (
                    <span className="font-mono text-[11px] text-teal-400/80 bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/20">
                      {card.formula}
                    </span>
                  )}
                </div>
              </div>

              <p className="mt-3 text-[11px] text-slate-400 border-t border-emerald-900/40 pt-2 line-clamp-1">
                {card.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Record Counter pill */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <div className="flex items-center gap-1.5">
          <Layers className="h-3.5 w-3.5 text-emerald-400" />
          <span>
            Aggregating <strong className="text-emerald-300 font-mono">{formatNumber(record_count)}</strong> matching agricultural records
          </span>
        </div>
        <span className="text-[11px] text-slate-500 hidden sm:inline">
          Standard Units: MT (Tonnes), Ha (Hectares), mm (Millimeters)
        </span>
      </div>
    </div>
  );
};

export default KpiCards;
