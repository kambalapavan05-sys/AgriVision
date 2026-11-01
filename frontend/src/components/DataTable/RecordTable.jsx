import React, { useState } from 'react';
import {
  Table as TableIcon,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
  Filter,
} from 'lucide-react';
import { TablePagination } from './TablePagination';
import {
  formatProduction,
  formatArea,
  formatYield,
  formatRainfall,
} from '../../utils/formatters';

export const RecordTable = ({
  data,
  isLoading = false,
  searchQuery = '',
  onSearchChange,
  page = 1,
  pageSize = 15,
  sortBy = 'crop_year',
  sortOrder = 'desc',
  onSortChange,
  onPageChange,
  onPageSizeChange,
  onExportCsv,
}) => {
  const items = data?.items || [];
  const total = data?.total || 0;
  const totalPages = data?.total_pages || 1;

  const handleSort = (column) => {
    if (sortBy === column) {
      onSortChange(column, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      onSortChange(column, 'desc');
    }
  };

  const renderSortIcon = (column) => {
    if (sortBy !== column) {
      return <ArrowUpDown className="h-3 w-3 text-slate-500 opacity-60" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="h-3 w-3 text-emerald-400" />
    ) : (
      <ArrowDown className="h-3 w-3 text-emerald-400" />
    );
  };

  return (
    <div className="agri-card rounded-2xl p-5 shadow-lg space-y-4">
      {/* Table controls header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <TableIcon className="h-5 w-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Dataset Records Explorer</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Detailed agricultural microdata with column sorting and search
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Live text search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search district, crop, state..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-56 sm:w-64 rounded-xl border border-emerald-850/60 bg-forest-950/80 pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Quick export CSV */}
          <button
            onClick={onExportCsv}
            className="flex items-center gap-1.5 rounded-xl border border-emerald-600/40 bg-forest-900/80 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-800/40 transition-colors shrink-0"
            title="Export filtered records to CSV"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table container with horizontal scroll */}
      <div className="overflow-x-auto rounded-xl border border-emerald-900/40 bg-forest-950/40">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-emerald-850/60 bg-forest-900/70 text-slate-300 uppercase tracking-wider text-[11px]">
            <tr>
              <th
                onClick={() => handleSort('state')}
                className="cursor-pointer px-4 py-3 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>State</span>
                  {renderSortIcon('state')}
                </div>
              </th>
              <th
                onClick={() => handleSort('district')}
                className="cursor-pointer px-4 py-3 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>District</span>
                  {renderSortIcon('district')}
                </div>
              </th>
              <th
                onClick={() => handleSort('crop')}
                className="cursor-pointer px-4 py-3 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Crop</span>
                  {renderSortIcon('crop')}
                </div>
              </th>
              <th
                onClick={() => handleSort('crop_year')}
                className="cursor-pointer px-4 py-3 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Year</span>
                  {renderSortIcon('crop_year')}
                </div>
              </th>
              <th
                onClick={() => handleSort('season')}
                className="cursor-pointer px-4 py-3 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Season</span>
                  {renderSortIcon('season')}
                </div>
              </th>
              <th
                onClick={() => handleSort('area_hectares')}
                className="cursor-pointer px-4 py-3 text-right hover:text-white transition-colors"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Area (Ha)</span>
                  {renderSortIcon('area_hectares')}
                </div>
              </th>
              <th
                onClick={() => handleSort('production_tonnes')}
                className="cursor-pointer px-4 py-3 text-right hover:text-white transition-colors"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Production (MT)</span>
                  {renderSortIcon('production_tonnes')}
                </div>
              </th>
              <th
                onClick={() => handleSort('yield')}
                className="cursor-pointer px-4 py-3 text-right hover:text-white transition-colors"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Yield (MT/Ha)</span>
                  {renderSortIcon('yield')}
                </div>
              </th>
              <th
                onClick={() => handleSort('rainfall_mm')}
                className="cursor-pointer px-4 py-3 text-right hover:text-white transition-colors"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Rainfall</span>
                  {renderSortIcon('rainfall_mm')}
                </div>
              </th>
              <th className="px-4 py-3 text-center">Data Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-950/80 text-slate-200">
            {isLoading ? (
              <tr>
                <td colSpan={10} className="px-4 py-10 text-center text-slate-400">
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
                    <span>Loading agricultural records...</span>
                  </div>
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-10 text-center text-slate-400">
                  No agricultural records matched your search query or filter selection.
                </td>
              </tr>
            ) : (
              items.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-forest-900/50 transition-colors font-sans"
                >
                  <td className="px-4 py-2.5 font-medium text-white">{row.state}</td>
                  <td className="px-4 py-2.5 text-slate-300">{row.district}</td>
                  <td className="px-4 py-2.5 font-semibold text-emerald-300">{row.crop}</td>
                  <td className="px-4 py-2.5 font-mono text-slate-300">{row.crop_year}</td>
                  <td className="px-4 py-2.5">
                    <span className="rounded-md bg-forest-900 px-2 py-0.5 text-[11px] text-slate-300 border border-emerald-850/50">
                      {row.season}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-slate-300">
                    {formatArea(row.area_hectares)}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono font-semibold text-amber-300">
                    {formatProduction(row.production_tonnes)}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono font-bold text-teal-300">
                    {formatYield(row.yield_tonnes_per_ha)}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-sky-300">
                    {formatRainfall(row.rainfall_mm)}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    {row.is_demo ? (
                      <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400 border border-amber-500/20">
                        DEMO
                      </span>
                    ) : (
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-500/20">
                        Uploaded
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination component */}
      <TablePagination
        page={page}
        pageSize={pageSize}
        total={total}
        totalPages={totalPages}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
};

export default RecordTable;
