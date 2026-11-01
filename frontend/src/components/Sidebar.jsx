import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  BarChart3,
  CloudRain,
  Table,
  UploadCloud,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  Database,
  Calendar,
} from 'lucide-react';

export const Sidebar = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  totalRecords = 0,
  yearsRange = '2000 - 2023',
  onOpenUpload,
}) => {
  const navItems = [
    { id: 'overview', label: 'Overview Dashboard', icon: LayoutDashboard },
    { id: 'trends', label: 'Historical Trends', icon: TrendingUp },
    { id: 'comparisons', label: 'State & Crop Analysis', icon: BarChart3 },
    { id: 'rainfall', label: 'Rainfall & Agronomy', icon: CloudRain },
    { id: 'records', label: 'Dataset Explorer', icon: Table },
  ];

  const handleSelect = (id) => {
    setActiveTab(id);
    if (mobileOpen) setMobileOpen(false);
  };

  const content = (
    <div className="flex h-full flex-col justify-between p-3">
      <div className="space-y-4">
        {/* Navigation list */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-forest-950 font-semibold shadow-md shadow-emerald-950/30'
                    : 'text-slate-300 hover:bg-forest-900/80 hover:text-emerald-300'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={`h-5 w-5 shrink-0 ${
                    isActive ? 'text-forest-950' : 'text-emerald-400 group-hover:text-emerald-300'
                  }`}
                />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom status and dataset stats */}
      <div className="space-y-3 pt-4 border-t border-emerald-900/40">
        {!collapsed ? (
          <div className="rounded-xl border border-emerald-800/30 bg-forest-900/60 p-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1.5">
              <Database className="h-4 w-4" />
              <span>Dataset Summary</span>
            </div>
            <div className="space-y-1 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Records:</span>
                <span className="font-mono text-emerald-200">{Number(totalRecords).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Coverage:</span>
                <span className="font-mono text-emerald-200">{yearsRange}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center" title={`${totalRecords} records (${yearsRange})`}>
            <div className="h-2 w-2 rounded-full bg-emerald-400" />
          </div>
        )}

        {/* Desktop collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex w-full items-center justify-center rounded-lg p-2 text-slate-400 hover:bg-forest-900 hover:text-emerald-300 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 border-r border-emerald-800/40 bg-forest-950/80 backdrop-blur-md transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="sticky top-16 h-[calc(100vh-4rem)]">{content}</div>
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-forest-950 border-r border-emerald-800/50 shadow-2xl">
            <div className="flex h-16 items-center justify-between px-4 border-b border-emerald-900/50">
              <span className="font-bold text-white text-lg">AgriVision Menu</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-forest-900 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="h-[calc(100vh-4rem)] overflow-y-auto">{content}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
