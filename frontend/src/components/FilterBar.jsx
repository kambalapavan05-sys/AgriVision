import React from 'react';
import { Filter, RotateCcw, Calendar, MapPin, Wheat, Sun } from 'lucide-react';

export const FilterBar = ({
  metadata,
  filters,
  onChangeFilter,
  onResetFilters,
  isLoading = false,
}) => {
  const {
    states = [],
    districts_by_state = {},
    crops = [],
    seasons = [],
    years = [],
  } = metadata || {};

  // Compute available districts based on selected state
  const availableDistricts =
    filters.state && filters.state !== 'All'
      ? districts_by_state[filters.state] || []
      : [];

  // Check how many filters are currently active (non-default)
  const activeCount = [
    filters.state && filters.state !== 'All',
    filters.district && filters.district !== 'All',
    filters.crop && filters.crop !== 'All',
    filters.season && filters.season !== 'All',
    filters.year_start && filters.year_start !== (metadata?.min_year || 2000),
    filters.year_end && filters.year_end !== (metadata?.max_year || 2023),
  ].filter(Boolean).length;

  return (
    <div className="mb-6 rounded-2xl border border-emerald-800/40 bg-forest-900/60 p-4 shadow-lg backdrop-blur-md">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Title and active count badge */}
        <div className="flex items-center gap-2 text-emerald-400">
          <Filter className="h-5 w-5" />
          <span className="text-sm font-bold uppercase tracking-wider text-emerald-300">
            Analytics Filters
          </span>
          {activeCount > 0 && (
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
              {activeCount} active
            </span>
          )}
        </div>

        {/* Filters grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6 lg:flex lg:flex-wrap lg:items-center">
          {/* State selector */}
          <div className="flex flex-col">
            <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mb-1">
              <MapPin className="h-3 w-3 text-emerald-400" /> State
            </label>
            <select
              value={filters.state || 'All'}
              onChange={(e) => {
                const newState = e.target.value;
                onChangeFilter({
                  ...filters,
                  state: newState,
                  district: 'All', // Reset district whenever state changes
                });
              }}
              className="rounded-lg border border-emerald-850/60 bg-forest-950/80 px-2.5 py-1.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="All">All States</option>
              {states.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* District selector (cascading) */}
          <div className="flex flex-col">
            <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mb-1">
              <MapPin className="h-3 w-3 text-emerald-400" /> District
            </label>
            <select
              value={filters.district || 'All'}
              disabled={!filters.state || filters.state === 'All'}
              onChange={(e) => onChangeFilter({ ...filters, district: e.target.value })}
              className={`rounded-lg border px-2.5 py-1.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                !filters.state || filters.state === 'All'
                  ? 'border-emerald-950 bg-forest-950/40 text-slate-500 cursor-not-allowed'
                  : 'border-emerald-850/60 bg-forest-950/80'
              }`}
            >
              <option value="All">
                {!filters.state || filters.state === 'All' ? 'Select State First' : 'All Districts'}
              </option>
              {availableDistricts.map((dst) => (
                <option key={dst} value={dst}>
                  {dst}
                </option>
              ))}
            </select>
          </div>

          {/* Crop selector */}
          <div className="flex flex-col">
            <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mb-1">
              <Wheat className="h-3 w-3 text-emerald-400" /> Crop
            </label>
            <select
              value={filters.crop || 'All'}
              onChange={(e) => onChangeFilter({ ...filters, crop: e.target.value })}
              className="rounded-lg border border-emerald-850/60 bg-forest-950/80 px-2.5 py-1.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="All">All Crops</option>
              {crops.map((crp) => (
                <option key={crp} value={crp}>
                  {crp}
                </option>
              ))}
            </select>
          </div>

          {/* Season selector */}
          <div className="flex flex-col">
            <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mb-1">
              <Sun className="h-3 w-3 text-emerald-400" /> Season
            </label>
            <select
              value={filters.season || 'All'}
              onChange={(e) => onChangeFilter({ ...filters, season: e.target.value })}
              className="rounded-lg border border-emerald-850/60 bg-forest-950/80 px-2.5 py-1.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="All">All Seasons</option>
              {seasons.map((sn) => (
                <option key={sn} value={sn}>
                  {sn}
                </option>
              ))}
            </select>
          </div>

          {/* Start Year */}
          <div className="flex flex-col">
            <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mb-1">
              <Calendar className="h-3 w-3 text-emerald-400" /> Start Year
            </label>
            <select
              value={filters.year_start || metadata?.min_year || 2000}
              onChange={(e) =>
                onChangeFilter({ ...filters, year_start: parseInt(e.target.value, 10) })
              }
              className="rounded-lg border border-emerald-850/60 bg-forest-950/80 px-2.5 py-1.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {years.map((yr) => (
                <option key={`start-${yr}`} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>

          {/* End Year */}
          <div className="flex flex-col">
            <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mb-1">
              <Calendar className="h-3 w-3 text-emerald-400" /> End Year
            </label>
            <select
              value={filters.year_end || metadata?.max_year || 2023}
              onChange={(e) =>
                onChangeFilter({ ...filters, year_end: parseInt(e.target.value, 10) })
              }
              className="rounded-lg border border-emerald-850/60 bg-forest-950/80 px-2.5 py-1.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {years.map((yr) => (
                <option key={`end-${yr}`} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>

          {/* Reset button */}
          <div className="flex items-end col-span-2 sm:col-span-1">
            <button
              onClick={onResetFilters}
              disabled={isLoading || activeCount === 0}
              className={`flex w-full items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeCount > 0
                  ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                  : 'border-emerald-900/40 bg-forest-950/40 text-slate-500 cursor-not-allowed'
              }`}
              title="Reset all filters to defaults"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
