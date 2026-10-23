import React from 'react';
import { Sprout, RotateCcw } from 'lucide-react';

export const EmptyState = ({ onReset }) => {
  return (
    <div className="agri-card rounded-2xl p-10 text-center space-y-4 my-8">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        <Sprout className="h-8 w-8 stroke-[1.5]" />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-white">No Matching Agricultural Records</h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          The selected combination of state, district, crop, and year returned zero results in the database.
          Try broadening your filters or resetting to view all crops.
        </p>
      </div>
      {onReset && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-forest-950 hover:bg-emerald-500 transition-colors shadow-md shadow-emerald-950/40"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Reset All Filters</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;
