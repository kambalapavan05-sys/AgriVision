import React from 'react';
import { Sprout, Upload, Download, Menu, X, Database } from 'lucide-react';

export const Navbar = ({
  onOpenUpload,
  onOpenReport,
  isDemo = true,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-800/40 bg-forest-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-300 hover:bg-forest-900 lg:hidden"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-forest-950 shadow-md shadow-emerald-900/50">
              <Sprout className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-white">
                  Agri<span className="text-emerald-400">Vision</span>
                </span>
                <span className="hidden sm:inline-block rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-300 border border-emerald-500/20">
                  v1.0
                </span>
              </div>
              <p className="hidden text-xs text-slate-400 sm:block">
                Agricultural Crop Production Analysis System
              </p>
            </div>
          </div>
        </div>

        {/* Dataset state indicator and action buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isDemo && (
            <div className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="hidden md:inline">DEMO DATASET</span>
              <span className="md:hidden">DEMO</span>
            </div>
          )}

          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 rounded-lg border border-emerald-600/40 bg-forest-900/80 px-3 py-1.5 text-xs sm:text-sm font-semibold text-emerald-300 hover:bg-emerald-800/40 hover:text-emerald-200 transition-colors shadow-sm"
          >
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Upload CSV</span>
            <span className="sm:hidden">Upload</span>
          </button>

          <button
            onClick={onOpenReport}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs sm:text-sm font-semibold text-forest-950 hover:bg-emerald-500 transition-colors shadow-sm shadow-emerald-950/40 font-medium"
          >
            <Download className="h-4 w-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Export Report</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
