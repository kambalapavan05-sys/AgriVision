import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { FilterBar } from './components/FilterBar';
import { KpiCards } from './components/KpiCards';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { ProductionTrendChart } from './components/Charts/ProductionTrendChart';
import { StateComparisonChart } from './components/Charts/StateComparisonChart';
import { CropDistributionChart } from './components/Charts/CropDistributionChart';
import { RainfallScatterChart } from './components/Charts/RainfallScatterChart';
import { SeasonYieldChart } from './components/Charts/SeasonYieldChart';
import { RecordTable } from './components/DataTable/RecordTable';
import { UploadModal } from './components/UploadModal';
import { ReportModal } from './components/ReportModal';
import { EmptyState } from './components/EmptyState';
import { api } from './services/api';

export function App() {
  // Navigation & UI States
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Metadata & Filters
  const [metadata, setMetadata] = useState(null);
  const [filters, setFilters] = useState({
    state: 'All',
    district: 'All',
    crop: 'All',
    season: 'All',
    year_start: 2000,
    year_end: 2023,
  });

  // Analytics Data States
  const [kpis, setKpis] = useState(null);
  const [trends, setTrends] = useState([]);
  const [stateComparisons, setStateComparisons] = useState([]);
  const [cropDistributions, setCropDistributions] = useState([]);
  const [seasonalStats, setSeasonalStats] = useState([]);
  const [rainfallScatter, setRainfallScatter] = useState(null);

  // Table Data State
  const [tableData, setTableData] = useState({ items: [], total: 0, page: 1, total_pages: 1 });
  const [searchQuery, setSearchQuery] = useState('');
  const [tablePage, setTablePage] = useState(1);
  const [tablePageSize, setTablePageSize] = useState(15);
  const [sortBy, setSortBy] = useState('crop_year');
  const [sortOrder, setSortOrder] = useState('desc');

  // Loading flags
  const [loadingKpis, setLoadingKpis] = useState(true);
  const [loadingCharts, setLoadingCharts] = useState(true);
  const [loadingTable, setLoadingTable] = useState(true);

  // Initial load: Fetch metadata
  const loadMetadata = async () => {
    try {
      const data = await api.getMetadata();
      setMetadata(data);
      setFilters((prev) => ({
        ...prev,
        year_start: data.min_year || 2000,
        year_end: data.max_year || 2023,
      }));
    } catch (err) {
      console.error('Failed to load metadata:', err);
    }
  };

  useEffect(() => {
    loadMetadata();
  }, []);

  // Fetch KPI statistics and visual analytics
  const fetchAnalytics = useCallback(async () => {
    setLoadingKpis(true);
    setLoadingCharts(true);
    try {
      const [kpiRes, trendRes, stateRes, cropRes, seasonRes, scatterRes] = await Promise.all([
        api.getKpis(filters),
        api.getTrends(filters),
        api.getStateComparison(filters, 10),
        api.getCropDistribution(filters),
        api.getSeasonalStats(filters),
        api.getRainfallScatter(filters, 300),
      ]);
      setKpis(kpiRes);
      setTrends(trendRes);
      setStateComparisons(stateRes);
      setCropDistributions(cropRes);
      setSeasonalStats(seasonRes);
      setRainfallScatter(scatterRes);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoadingKpis(false);
      setLoadingCharts(false);
    }
  }, [filters]);

  // Fetch paginated table records
  const fetchTableRecords = useCallback(async () => {
    setLoadingTable(true);
    try {
      const res = await api.getRecords({
        ...filters,
        search: searchQuery,
        page: tablePage,
        page_size: tablePageSize,
        sort_by: sortBy,
        sort_order: sortOrder,
      });
      setTableData(res);
    } catch (err) {
      console.error('Failed to fetch table records:', err);
    } finally {
      setLoadingTable(false);
    }
  }, [filters, searchQuery, tablePage, tablePageSize, sortBy, sortOrder]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  useEffect(() => {
    fetchTableRecords();
  }, [fetchTableRecords]);

  // Reset all filters to default
  const handleResetFilters = () => {
    setFilters({
      state: 'All',
      district: 'All',
      crop: 'All',
      season: 'All',
      year_start: metadata?.min_year || 2000,
      year_end: metadata?.max_year || 2023,
    });
    setSearchQuery('');
    setTablePage(1);
  };

  const handleUploadSuccess = () => {
    loadMetadata();
    fetchAnalytics();
    fetchTableRecords();
  };

  const hasZeroResults = kpis && kpis.record_count === 0 && !loadingKpis;

  return (
    <div className="min-h-screen bg-forest-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenReport={() => setIsReportOpen(true)}
        isDemo={metadata?.dataset_is_demo ?? true}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Main Dashboard Layout */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          mobileOpen={mobileMenuOpen}
          setMobileOpen={setMobileMenuOpen}
          totalRecords={metadata?.total_records || 0}
          yearsRange={`${metadata?.min_year || 2000} - ${metadata?.max_year || 2023}`}
          onOpenUpload={() => setIsUploadOpen(true)}
        />

        {/* Central Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {/* Data Provenance & Scientific Disclaimer Banner */}
          <DisclaimerBanner isDemo={metadata?.dataset_is_demo ?? true} />

          {/* Interactive Cascading Filter Bar */}
          <FilterBar
            metadata={metadata}
            filters={filters}
            onChangeFilter={(newFilters) => {
              setFilters(newFilters);
              setTablePage(1); // reset table to page 1 on filter alteration
            }}
            onResetFilters={handleResetFilters}
            isLoading={loadingKpis}
          />

          {/* KPI Summary Cards */}
          <KpiCards kpis={kpis} isLoading={loadingKpis} />

          {/* Zero Results Feedback */}
          {hasZeroResults ? (
            <EmptyState onReset={handleResetFilters} />
          ) : (
            <>
              {/* Tab 1: Overview Dashboard */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Trends & State Comparison Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-7">
                      <ProductionTrendChart data={trends} isLoading={loadingCharts} />
                    </div>
                    <div className="lg:col-span-5">
                      <StateComparisonChart data={stateComparisons} isLoading={loadingCharts} />
                    </div>
                  </div>

                  {/* Crop Distribution & Seasonal Metrics Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-6">
                      <CropDistributionChart data={cropDistributions} isLoading={loadingCharts} />
                    </div>
                    <div className="lg:col-span-6">
                      <SeasonYieldChart data={seasonalStats} isLoading={loadingCharts} />
                    </div>
                  </div>

                  {/* Rainfall vs Production Preview */}
                  <div>
                    <RainfallScatterChart data={rainfallScatter} isLoading={loadingCharts} />
                  </div>
                </div>
              )}

              {/* Tab 2: Historical Trends */}
              {activeTab === 'trends' && (
                <div className="space-y-6">
                  <ProductionTrendChart data={trends} isLoading={loadingCharts} />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <SeasonYieldChart data={seasonalStats} isLoading={loadingCharts} />
                    <CropDistributionChart data={cropDistributions} isLoading={loadingCharts} />
                  </div>
                </div>
              )}

              {/* Tab 3: Regional & Crop Comparisons */}
              {activeTab === 'comparisons' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <StateComparisonChart data={stateComparisons} isLoading={loadingCharts} />
                    <CropDistributionChart data={cropDistributions} isLoading={loadingCharts} />
                  </div>
                  <SeasonYieldChart data={seasonalStats} isLoading={loadingCharts} />
                </div>
              )}

              {/* Tab 4: Rainfall & Agronomy */}
              {activeTab === 'rainfall' && (
                <div className="space-y-6">
                  <RainfallScatterChart data={rainfallScatter} isLoading={loadingCharts} />
                  <ProductionTrendChart data={trends} isLoading={loadingCharts} />
                </div>
              )}

              {/* Tab 5: Dataset Explorer Table */}
              {activeTab === 'records' && (
                <RecordTable
                  data={tableData}
                  isLoading={loadingTable}
                  searchQuery={searchQuery}
                  onSearchChange={(q) => {
                    setSearchQuery(q);
                    setTablePage(1);
                  }}
                  page={tablePage}
                  pageSize={tablePageSize}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSortChange={(col, order) => {
                    setSortBy(col);
                    setSortOrder(order);
                  }}
                  onPageChange={setTablePage}
                  onPageSizeChange={(sz) => {
                    setTablePageSize(sz);
                    setTablePage(1);
                  }}
                  onExportCsv={() => {
                    window.location.href = api.getExportUrl('csv', filters);
                  }}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Upload Dataset Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={handleUploadSuccess}
      />

      {/* Filtered Report Modal */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        kpis={kpis}
        filters={filters}
        metadata={metadata}
        stateComparisons={stateComparisons}
        cropDistributions={cropDistributions}
      />
    </div>
  );
}

export default App;
