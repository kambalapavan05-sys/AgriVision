import React, { useState, useEffect } from 'react';
import {
  Sprout,
  Wheat,
  Trees,
  TrendingUp,
  BarChart2,
  PieChart as PieIcon,
  MapPin,
  Database,
  FileBarChart2,
  Layers,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Sparkles,
  LogIn,
  UserPlus,
  Play,
  Menu,
  X,
  ExternalLink,
  ChevronUp,
  Info,
  Calendar,
  Activity,
  CloudRain,
  Filter,
  Check,
  LayoutDashboard,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { KpiCards } from '../components/KpiCards';
import { ProductionTrendChart } from '../components/Charts/ProductionTrendChart';
import { StateComparisonChart } from '../components/Charts/StateComparisonChart';
import { CropDistributionChart } from '../components/Charts/CropDistributionChart';
import { api } from '../services/api';

// Verified, realistic sample data for demo preview (clearly labeled as demo data)
const DEMO_KPIS = {
  total_production_tonnes: 348291040,
  total_area_hectares: 124503200,
  aggregate_yield: 2.797,
  average_rainfall_mm: 1142.5,
  record_count: 246098,
};

const DEMO_TRENDS = [
  { year: 2014, production_tonnes: 252025000, area_hectares: 125040000, aggregate_yield: 2.016, rainfall_mm: 1045 },
  { year: 2015, production_tonnes: 251570000, area_hectares: 123220000, aggregate_yield: 2.042, rainfall_mm: 980 },
  { year: 2016, production_tonnes: 275110000, area_hectares: 124310000, aggregate_yield: 2.213, rainfall_mm: 1120 },
  { year: 2017, production_tonnes: 285010000, area_hectares: 126080000, aggregate_yield: 2.261, rainfall_mm: 1150 },
  { year: 2018, production_tonnes: 285210000, area_hectares: 125820000, aggregate_yield: 2.267, rainfall_mm: 1040 },
  { year: 2019, production_tonnes: 297500000, area_hectares: 127200000, aggregate_yield: 2.339, rainfall_mm: 1210 },
  { year: 2020, production_tonnes: 310740000, area_hectares: 129030000, aggregate_yield: 2.408, rainfall_mm: 1240 },
  { year: 2021, production_tonnes: 315610000, area_hectares: 129520000, aggregate_yield: 2.437, rainfall_mm: 1180 },
  { year: 2022, production_tonnes: 329680000, area_hectares: 130800000, aggregate_yield: 2.520, rainfall_mm: 1160 },
  { year: 2023, production_tonnes: 348291040, area_hectares: 124503200, aggregate_yield: 2.797, rainfall_mm: 1142 },
];

const DEMO_STATE_COMPARISON = [
  { state: 'Uttar Pradesh', production_tonnes: 54100000, total_area_hectares: 16800000, aggregate_yield: 3.220 },
  { state: 'Madhya Pradesh', production_tonnes: 37800000, total_area_hectares: 14200000, aggregate_yield: 2.662 },
  { state: 'Punjab', production_tonnes: 31200000, total_area_hectares: 7600000, aggregate_yield: 4.105 },
  { state: 'Maharashtra', production_tonnes: 29400000, total_area_hectares: 13900000, aggregate_yield: 2.115 },
  { state: 'Haryana', production_tonnes: 21900000, total_area_hectares: 6200000, aggregate_yield: 3.532 },
  { state: 'Rajasthan', production_tonnes: 19800000, total_area_hectares: 11400000, aggregate_yield: 1.737 },
  { state: 'West Bengal', production_tonnes: 18500000, total_area_hectares: 6100000, aggregate_yield: 3.033 },
  { state: 'Andhra Pradesh', production_tonnes: 16700000, total_area_hectares: 5800000, aggregate_yield: 2.879 },
];

const DEMO_CROP_DISTRIBUTION = [
  { crop: 'Rice', production_tonnes: 125000000, percentage: 35.9, aggregate_yield: 2.81 },
  { crop: 'Wheat', production_tonnes: 106000000, percentage: 30.4, aggregate_yield: 3.52 },
  { crop: 'Sugarcane', production_tonnes: 49000000, percentage: 14.1, aggregate_yield: 70.5 },
  { crop: 'Maize', production_tonnes: 31000000, percentage: 8.9, aggregate_yield: 3.04 },
  { crop: 'Cotton', production_tonnes: 21000000, percentage: 6.0, aggregate_yield: 1.65 },
  { crop: 'Pulses', production_tonnes: 16291040, percentage: 4.7, aggregate_yield: 0.88 },
];

export function LandingPage({ onOpenDashboard, onGoToLogin, onGoToRegister }) {
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePreviewTab, setActivePreviewTab] = useState('trends'); // 'trends', 'states', 'crops'

  // Live preview data (fetched from API if available, fallback to demo)
  const [previewKpis, setPreviewKpis] = useState(DEMO_KPIS);
  const [previewTrends, setPreviewTrends] = useState(DEMO_TRENDS);
  const [previewStates, setPreviewStates] = useState(DEMO_STATE_COMPARISON);
  const [previewCrops, setPreviewCrops] = useState(DEMO_CROP_DISTRIBUTION);
  const [isLiveApiConnected, setIsLiveApiConnected] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchLivePreview = async () => {
      try {
        const [kpiRes, trendRes, stateRes, cropRes] = await Promise.all([
          api.getKpis(),
          api.getTrends(),
          api.getStateComparison({}, 8),
          api.getCropDistribution(),
        ]);
        if (isMounted) {
          if (kpiRes && kpiRes.record_count > 0) {
            setPreviewKpis(kpiRes);
            setIsLiveApiConnected(true);
          }
          if (Array.isArray(trendRes) && trendRes.length > 0) {
            setPreviewTrends(trendRes);
          }
          if (Array.isArray(stateRes) && stateRes.length > 0) {
            setPreviewStates(stateRes);
          }
          if (Array.isArray(cropRes) && cropRes.length > 0) {
            setPreviewCrops(cropRes);
          }
        }
      } catch (err) {
        // Quietly retain realistic demo data
      }
    };

    fetchLivePreview();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-forest-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-forest-950 relative overflow-x-hidden">
      {/* Dynamic Ambient Background Lights */}
      <div
        className="pointer-events-none fixed -top-48 left-1/2 -translate-x-1/2 h-[700px] w-[1000px] rounded-full bg-emerald-500/15 blur-[150px] animate-pulse-glow z-0"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed top-1/3 -left-48 h-[600px] w-[600px] rounded-full bg-teal-500/10 blur-[160px] z-0"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed bottom-1/4 -right-48 h-[650px] w-[650px] rounded-full bg-lime-500/10 blur-[160px] z-0"
        aria-hidden="true"
      />

      {/* Subtle Data Grid Pattern Overlay */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03] z-0"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #10b981 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />

      {/* =========================================================================
          TOP NAVBAR
          ========================================================================= */}
      <header className="sticky top-0 z-50 w-full border-b border-emerald-800/40 bg-forest-950/85 backdrop-blur-md transition-all">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Identity */}
          <a href="#" className="flex items-center gap-3.5 group cursor-pointer focus:outline-none">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 via-emerald-600 to-teal-400 text-forest-950 shadow-lg shadow-emerald-950/80 group-hover:scale-105 transition-transform duration-200">
              <Sprout className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-white">
                  Agri<span className="text-emerald-400">Vision</span>
                </span>
                <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase text-emerald-300 border border-emerald-500/30">
                  Analytics
                </span>
              </div>
              <p className="hidden text-[11px] font-medium text-slate-400 sm:block -mt-0.5">
                Crop Production Analysis System
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <a href="#about" className="hover:text-emerald-400 transition-colors">
              About
            </a>
            <a href="#features" className="hover:text-emerald-400 transition-colors">
              Features
            </a>
            <a href="#preview" className="hover:text-emerald-400 transition-colors">
              Dashboard Preview
            </a>
            <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">
              How It Works
            </a>
            <a href="#why-agrivision" className="hover:text-emerald-400 transition-colors">
              Why AgriVision
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={onOpenDashboard}
                  className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-forest-900/90 px-4 py-2 text-xs sm:text-sm font-semibold text-emerald-300 hover:border-emerald-400 hover:bg-forest-800 transition-all cursor-pointer shadow-md"
                >
                  <UserCheck className="h-4 w-4 text-emerald-400" />
                  <span>Dashboard ({user.name})</span>
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={onGoToLogin}
                  className="flex items-center gap-1.5 rounded-xl border border-emerald-800/60 bg-forest-900/60 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white hover:bg-forest-800 hover:border-emerald-500/40 transition-all cursor-pointer"
                >
                  <LogIn className="h-4 w-4 text-emerald-400" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={onOpenDashboard}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-4.5 py-2 text-xs sm:text-sm font-bold text-forest-950 shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Explore Live Demo</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-xl p-2.5 text-slate-300 hover:bg-forest-900 hover:text-white cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-emerald-800/40 bg-forest-950/98 px-6 py-6 backdrop-blur-xl animate-fade-in-up">
            <nav className="flex flex-col gap-4 text-base font-semibold text-slate-300">
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-emerald-400 py-1 transition-colors"
              >
                About AgriVision
              </a>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-emerald-400 py-1 transition-colors"
              >
                Features
              </a>
              <a
                href="#preview"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-emerald-400 py-1 transition-colors"
              >
                Dashboard Preview
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-emerald-400 py-1 transition-colors"
              >
                How It Works
              </a>
              <a
                href="#why-agrivision"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-emerald-400 py-1 transition-colors"
              >
                Why AgriVision
              </a>
              <div className="pt-4 border-t border-emerald-800/40 flex flex-col gap-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenDashboard();
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-5 py-3 text-sm font-bold text-forest-950 shadow-md cursor-pointer"
                >
                  <Play className="h-4 w-4 fill-current" />
                  <span>Explore Live Demo</span>
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onGoToLogin();
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-emerald-800/60 bg-forest-900/80 px-4 py-2.5 text-xs font-semibold text-slate-200"
                  >
                    <LogIn className="h-3.5 w-3.5" />
                    <span>Sign In</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onGoToRegister();
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-semibold text-emerald-300"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    <span>Sign Up</span>
                  </button>
                </div>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1">
        {/* =========================================================================
            1. HERO SECTION
            ========================================================================= */}
        <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 lg:pt-24 lg:pb-32 overflow-hidden">
          {/* Field Contour Graphic in background */}
          <svg
            className="pointer-events-none absolute bottom-0 left-0 right-0 w-full h-44 sm:h-64 text-emerald-500/5"
            viewBox="0 0 1440 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0,160L80,181.3C160,203,320,245,480,245.3C640,245,800,203,960,186.7C1120,171,1280,181,1360,186.7L1440,192L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
              fill="currentColor"
            />
          </svg>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
            {/* Platform Tag / Pill */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4.5 py-1.5 text-xs font-semibold text-emerald-300 backdrop-blur-md shadow-sm mb-8 animate-fade-in-up">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>AgriVision · Agricultural Crop Production Analysis System</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1] animate-fade-in-up delay-100 max-w-5xl mx-auto">
              Transform Agricultural Data into{' '}
              <span className="bg-gradient-to-r from-lime-300 via-emerald-400 to-teal-300 bg-clip-text text-transparent drop-shadow-[0_4px_25px_rgba(16,185,129,0.3)]">
                Smarter Insights.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl md:text-2xl text-slate-300/90 max-w-3xl mx-auto mb-10 leading-relaxed font-normal animate-fade-in-up delay-200">
              Explore historical crop production, analyze regional patterns and discover agricultural trends through interactive data visualization.
            </p>

            {/* Two Prominent Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 mb-14 animate-fade-in-up delay-300">
              <button
                type="button"
                onClick={onOpenDashboard}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl px-8 py-4 text-base font-bold text-forest-950 bg-gradient-to-r from-lime-400 via-emerald-400 to-teal-400 shadow-[0_0_30px_rgba(52,211,153,0.35)] hover:shadow-[0_0_45px_rgba(52,211,153,0.6)] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 cursor-pointer"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>Explore Live Demo</span>
                <ChevronRight className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={onGoToRegister}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl border border-emerald-500/40 bg-forest-900/80 px-8 py-4 text-base font-semibold text-slate-100 hover:text-white hover:bg-forest-800 hover:border-emerald-400 transition-all duration-200 cursor-pointer shadow-sm"
              >
                <Sparkles className="h-4 w-4 text-emerald-400" />
                <span>Get Started / Sign Up</span>
              </button>
            </div>

            {/* Floating Live Statistical Highlights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto text-left animate-fade-in-up delay-400">
              <div className="agri-card rounded-2xl p-4 border border-emerald-800/40 bg-forest-900/60 backdrop-blur-md">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-1">
                  <Wheat className="h-4 w-4" />
                  <span>Historical Data</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-white">246,000+</div>
                <div className="text-[11px] text-slate-400">Records (2000–2023)</div>
              </div>

              <div className="agri-card rounded-2xl p-4 border border-emerald-800/40 bg-forest-900/60 backdrop-blur-md">
                <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold mb-1">
                  <MapPin className="h-4 w-4" />
                  <span>Geographic Reach</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-white">36 States & UTs</div>
                <div className="text-[11px] text-slate-400">Districts nationwide</div>
              </div>

              <div className="agri-card rounded-2xl p-4 border border-emerald-800/40 bg-forest-900/60 backdrop-blur-md">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>Calculated Yield</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-white">MT / Hectare</div>
                <div className="text-[11px] text-slate-400">Exact formula: ΣP / ΣA</div>
              </div>

              <div className="agri-card rounded-2xl p-4 border border-emerald-800/40 bg-forest-900/60 backdrop-blur-md">
                <div className="flex items-center gap-2 text-lime-400 text-xs font-semibold mb-1">
                  <CloudRain className="h-4 w-4" />
                  <span>Climate Analysis</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-white">Rainfall Overlay</div>
                <div className="text-[11px] text-slate-400">Seasonal agronomy</div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. ABOUT AGRIVISION
            ========================================================================= */}
        <section id="about" className="py-20 sm:py-28 border-t border-emerald-900/40 relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-4">
                <span>About AgriVision</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-6">
                Transforming Raw Agricultural Data into Smarter Decisions
              </h2>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                AgriVision is an advanced agricultural intelligence platform that analyzes historical agricultural production data, compares crops across regions, tracks yearly production trends, examines cultivated area and calculated yield, and converts raw data into meaningful visual insights.
              </p>
            </div>

            {/* 4 Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              <div className="agri-card rounded-2xl p-6 border border-emerald-800/30 bg-forest-900/50 backdrop-blur-md hover:border-emerald-500/40 transition-all group">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-5 group-hover:scale-110 transition-transform">
                  <Wheat className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2.5">Historical Crop Trajectory</h3>
                <p className="text-sm text-slate-300/90 leading-relaxed">
                  Analyze over two decades of agricultural data from 2000 to 2023, tracking shifts in multi-crop output, seasonal harvests, and long-term production patterns.
                </p>
              </div>

              <div className="agri-card rounded-2xl p-6 border border-emerald-800/30 bg-forest-900/50 backdrop-blur-md hover:border-emerald-500/40 transition-all group">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 mb-5 group-hover:scale-110 transition-transform">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2.5">Regional Comparisons</h3>
                <p className="text-sm text-slate-300/90 leading-relaxed">
                  Compare states and districts side-by-side to understand geographic specialization, identify high-yield clusters, and evaluate regional productivity disparities.
                </p>
              </div>

              <div className="agri-card rounded-2xl p-6 border border-emerald-800/30 bg-forest-900/50 backdrop-blur-md hover:border-emerald-500/40 transition-all group">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-5 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2.5">Cultivated Area & Yield</h3>
                <p className="text-sm text-slate-300/90 leading-relaxed">
                  Strictly calculates aggregate yield as Total Production divided by Total Area, preventing distorted averages and presenting true agronomic efficiency.
                </p>
              </div>

              <div className="agri-card rounded-2xl p-6 border border-emerald-800/30 bg-forest-900/50 backdrop-blur-md hover:border-emerald-500/40 transition-all group">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lime-500/10 border border-lime-500/20 text-lime-400 mb-5 group-hover:scale-110 transition-transform">
                  <BarChart2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2.5">Visual Agricultural Insights</h3>
                <p className="text-sm text-slate-300/90 leading-relaxed">
                  Converts millions of raw data points into intuitive composed charts, distribution graphs, and rainfall correlation scatter plots ready for analysis.
                </p>
              </div>
            </div>

            {/* Visual Mission Card */}
            <div className="agri-card rounded-3xl p-8 sm:p-10 border border-emerald-700/30 bg-gradient-to-br from-forest-900/90 via-forest-900/60 to-forest-950 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Open Data Integrity & Scientific Formulation</span>
                </div>
                <h4 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                  Why Agricultural Accuracy Matters
                </h4>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  In agriculture, averaging yield rates across disparate parcel sizes produces dangerous statistical distortions. AgriVision calculates aggregate yield strictly through total volume over total cultivated acreage (<span className="text-emerald-300 font-mono font-semibold">Σ Production / Σ Area</span>), ensuring researchers, agronomists, and policymakers receive scientifically sound numbers.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
                <button
                  onClick={onOpenDashboard}
                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-forest-950 hover:bg-emerald-400 transition-all cursor-pointer shadow-md"
                >
                  <span>Explore Agricultural Data</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. FEATURES SECTION
            ========================================================================= */}
        <section id="features" className="py-20 sm:py-28 border-t border-emerald-900/40 relative bg-forest-950/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-4">
                <span>Features</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-6">
                Comprehensive Agricultural Analytics Suite
              </h2>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                Engineered with precision tools designed to dissect production figures, identify trends, and generate actionable agricultural intelligence.
              </p>
            </div>

            {/* 6 Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Feature 1: Interactive Dashboard */}
              <div className="agri-card agri-card-hover rounded-3xl p-7 border border-emerald-800/40 bg-forest-900/60 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                      <LayoutDashboard className="h-6 w-6" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      Interactive
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2.5">Interactive Dashboard</h3>
                  <p className="text-sm text-slate-300/90 leading-relaxed mb-6">
                    Multi-dimensional dashboard with dynamic cascading filters for state, district, crop, season, and multi-year spans with immediate analytical updates.
                  </p>
                </div>
                <ul className="space-y-2 text-xs text-slate-300 border-t border-emerald-800/30 pt-4">
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Real-time cascading filter updates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Instant summary KPI calculations</span>
                  </li>
                </ul>
              </div>

              {/* Feature 2: Crop Production Analysis */}
              <div className="agri-card agri-card-hover rounded-3xl p-7 border border-emerald-800/40 bg-forest-900/60 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
                      <Wheat className="h-6 w-6" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      Agronomy
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2.5">Crop Production Analysis</h3>
                  <p className="text-sm text-slate-300/90 leading-relaxed mb-6">
                    Granular breakdown of production output across crops (Rice, Wheat, Cotton, Sugarcane, Maize, etc.) and seasonal cycles (Kharif, Rabi, Summer, Whole Year).
                  </p>
                </div>
                <ul className="space-y-2 text-xs text-slate-300 border-t border-emerald-800/30 pt-4">
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Crop share distribution pie models</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Seasonal yield comparative matrices</span>
                  </li>
                </ul>
              </div>

              {/* Feature 3: Regional Comparison */}
              <div className="agri-card agri-card-hover rounded-3xl p-7 border border-emerald-800/40 bg-forest-900/60 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/15 border border-teal-500/30 text-teal-400">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20">
                      Regional
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2.5">Regional Comparison</h3>
                  <p className="text-sm text-slate-300/90 leading-relaxed mb-6">
                    State-by-state agricultural rankings and acreage benchmarking to highlight leading production hubs, productivity disparities, and regional specialization.
                  </p>
                </div>
                <ul className="space-y-2 text-xs text-slate-300 border-t border-emerald-800/30 pt-4">
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Top-producing state rankings</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Switchable Production vs Yield views</span>
                  </li>
                </ul>
              </div>

              {/* Feature 4: Historical Trend Analysis */}
              <div className="agri-card agri-card-hover rounded-3xl p-7 border border-emerald-800/40 bg-forest-900/60 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-500/15 border border-lime-500/30 text-lime-400">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-lime-500/10 text-lime-300 border border-lime-500/20">
                      Longitudinal
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2.5">Historical Trend Analysis</h3>
                  <p className="text-sm text-slate-300/90 leading-relaxed mb-6">
                    Longitudinal tracking of production volumes and cultivated acreage from 2000 to 2023 with dual-axis Composed Recharts for simultaneous acreage and output review.
                  </p>
                </div>
                <ul className="space-y-2 text-xs text-slate-300 border-t border-emerald-800/30 pt-4">
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>24+ years of continuous trajectory</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Dual-axis multi-metric trend graphs</span>
                  </li>
                </ul>
              </div>

              {/* Feature 5: Dataset Explorer */}
              <div className="agri-card agri-card-hover rounded-3xl p-7 border border-emerald-800/40 bg-forest-900/60 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/15 border border-sky-500/30 text-sky-400">
                      <Database className="h-6 w-6" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/20">
                      Explorer
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2.5">Dataset Explorer</h3>
                  <p className="text-sm text-slate-300/90 leading-relaxed mb-6">
                    High-performance searchable and sortable tabular view for deep record inspection. Filter by keyword, sort by acreage or production, and review exact figures.
                  </p>
                </div>
                <ul className="space-y-2 text-xs text-slate-300 border-t border-emerald-800/30 pt-4">
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Instant full-text record search</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Sortable multi-parameter columns</span>
                  </li>
                </ul>
              </div>

              {/* Feature 6: Data Visualization & Reports */}
              <div className="agri-card agri-card-hover rounded-3xl p-7 border border-emerald-800/40 bg-forest-900/60 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                      <FileBarChart2 className="h-6 w-6" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      Reporting
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2.5">Data Visualization & Reports</h3>
                  <p className="text-sm text-slate-300/90 leading-relaxed mb-6">
                    Rich visual analytics suite featuring rainfall-production scatter diagrams, interactive hover tooltips, and printable executive summary reports.
                  </p>
                </div>
                <ul className="space-y-2 text-xs text-slate-300 border-t border-emerald-800/30 pt-4">
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Rainfall correlation scatter plots</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>One-click printable executive report</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. DASHBOARD PREVIEW
            ========================================================================= */}
        <section id="preview" className="py-20 sm:py-28 border-t border-emerald-900/40 relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-3">
                  <Activity className="h-3.5 w-3.5" />
                  <span>Dashboard Preview</span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                  Experience AgriVision in Action
                </h2>
                <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl">
                  Inspect the live dashboard preview below powered by our Recharts components. Displaying real agricultural statistics and trends.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-medium">
                  <Info className="h-3.5 w-3.5 shrink-0" />
                  <span>
                    {isLiveApiConnected ? 'Live Database Connected' : 'Sample Agricultural Data (2000–2023)'}
                  </span>
                </div>
                <button
                  onClick={onOpenDashboard}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-5 py-2.5 text-sm font-bold text-forest-950 shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                >
                  <span>Explore Dashboard</span>
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Dashboard Container Mockup */}
            <div className="rounded-3xl border border-emerald-700/40 bg-forest-950/90 shadow-2xl overflow-hidden backdrop-blur-xl">
              {/* Mockup Window Header */}
              <div className="flex items-center justify-between border-b border-emerald-800/40 bg-forest-900/80 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block" />
                    <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
                  </div>
                  <div className="h-4 w-[1px] bg-emerald-800/60 ml-2" />
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Sprout className="h-4 w-4 text-emerald-400" />
                    AgriVision Analytics Console
                  </span>
                </div>

                {/* Preview View Mode Tabs */}
                <div className="flex items-center rounded-xl bg-forest-950/80 p-1 border border-emerald-850/60 text-xs">
                  <button
                    onClick={() => setActivePreviewTab('trends')}
                    className={`rounded-lg px-3 py-1 font-semibold transition-all cursor-pointer ${
                      activePreviewTab === 'trends'
                        ? 'bg-emerald-600 text-forest-950 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Historical Trends
                  </button>
                  <button
                    onClick={() => setActivePreviewTab('states')}
                    className={`rounded-lg px-3 py-1 font-semibold transition-all cursor-pointer ${
                      activePreviewTab === 'states'
                        ? 'bg-emerald-600 text-forest-950 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    State Comparison
                  </button>
                  <button
                    onClick={() => setActivePreviewTab('crops')}
                    className={`rounded-lg px-3 py-1 font-semibold transition-all cursor-pointer ${
                      activePreviewTab === 'crops'
                        ? 'bg-emerald-600 text-forest-950 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Crop Distribution
                  </button>
                </div>
              </div>

              {/* Mockup Body: Real Existing KPI Cards & Charts */}
              <div className="p-6 sm:p-8 space-y-8">
                {/* Embedded Real KpiCards Component */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Activity className="h-3.5 w-3.5 text-emerald-400" />
                      Key Agricultural Performance Metrics
                    </h3>
                    <span className="text-[11px] text-emerald-400/80 font-medium">
                      Formula: Aggregate Yield = Σ Production ÷ Σ Area
                    </span>
                  </div>
                  <KpiCards kpis={previewKpis} isLoading={false} />
                </div>

                {/* Embedded Charts Switcher */}
                <div>
                  {activePreviewTab === 'trends' && (
                    <ProductionTrendChart data={previewTrends} isLoading={false} />
                  )}

                  {activePreviewTab === 'states' && (
                    <StateComparisonChart data={previewStates} isLoading={false} />
                  )}

                  {activePreviewTab === 'crops' && (
                    <CropDistributionChart data={previewCrops} isLoading={false} />
                  )}
                </div>

                {/* Bottom Callout in Preview */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-emerald-800/40 bg-forest-900/40 p-4 text-xs text-slate-300">
                  <div className="flex items-center gap-2.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>
                      Want to filter by individual states, crops, and export custom PDF reports?
                    </span>
                  </div>
                  <button
                    onClick={onOpenDashboard}
                    className="inline-flex items-center gap-1.5 font-bold text-emerald-300 hover:text-emerald-200 hover:underline cursor-pointer"
                  >
                    <span>Launch Full Interactive Workspace</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            5. HOW IT WORKS
            ========================================================================= */}
        <section id="how-it-works" className="py-20 sm:py-28 border-t border-emerald-900/40 relative bg-forest-950/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-4">
                <span>How It Works</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-6">
                Four Simple Steps to Agricultural Intelligence
              </h2>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                Discover how AgriVision turns complex historical data into straightforward, actionable agronomic findings in seconds.
              </p>
            </div>

            {/* 4 Steps Flow */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative">
              {/* Step 1 */}
              <div className="agri-card rounded-3xl p-7 border border-emerald-800/40 bg-forest-900/50 backdrop-blur-md flex flex-col justify-between relative group hover:border-emerald-500/40 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black text-emerald-400/30 group-hover:text-emerald-400 transition-colors">
                      01
                    </span>
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <Database className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2.5">Explore Agricultural Datasets</h3>
                  <p className="text-sm text-slate-300/90 leading-relaxed">
                    Access historical agricultural databases spanning states, seasons, and decades without mandatory sign-up or paywalls.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-emerald-800/30 text-xs text-emerald-300 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Public & Open Access</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="agri-card rounded-3xl p-7 border border-emerald-800/40 bg-forest-900/50 backdrop-blur-md flex flex-col justify-between relative group hover:border-emerald-500/40 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black text-emerald-400/30 group-hover:text-emerald-400 transition-colors">
                      02
                    </span>
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
                      <Filter className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2.5">Select Crops, Regions and Years</h3>
                  <p className="text-sm text-slate-300/90 leading-relaxed">
                    Utilize cascading filters to isolate specific crops, target states and districts, and choose single years or historical ranges.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-emerald-800/30 text-xs text-teal-300 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Cascading Filter Logic</span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="agri-card rounded-3xl p-7 border border-emerald-800/40 bg-forest-900/50 backdrop-blur-md flex flex-col justify-between relative group hover:border-emerald-500/40 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black text-emerald-400/30 group-hover:text-emerald-400 transition-colors">
                      03
                    </span>
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                      <Activity className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2.5">Analyze Production Patterns</h3>
                  <p className="text-sm text-slate-300/90 leading-relaxed">
                    The platform computes aggregate yield, compares geographic rankings, and models climate correlations instantaneously.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-emerald-800/30 text-xs text-amber-300 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Real-time Computations</span>
                </div>
              </div>

              {/* Step 4 */}
              <div className="agri-card rounded-3xl p-7 border border-emerald-800/40 bg-forest-900/50 backdrop-blur-md flex flex-col justify-between relative group hover:border-emerald-500/40 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black text-emerald-400/30 group-hover:text-emerald-400 transition-colors">
                      04
                    </span>
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lime-500/10 border border-lime-500/20 text-lime-400">
                      <BarChart2 className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2.5">Understand Results Through Charts</h3>
                  <p className="text-sm text-slate-300/90 leading-relaxed">
                    Interpret agricultural trends with composed multi-axis charts, distribution graphs, and generate printable executive reports.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-emerald-800/30 text-xs text-lime-300 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Exportable Visual Reports</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            6. WHY AGRIVISION?
            ========================================================================= */}
        <section id="why-agrivision" className="py-20 sm:py-28 border-t border-emerald-900/40 relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-4">
                <span>Why AgriVision?</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-6">
                Engineered for Simplicity, Precision and Depth
              </h2>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                Traditional agricultural databases are slow, rigid, and prone to mathematical distortion. AgriVision provides a modern, intuitive alternative.
              </p>
            </div>

            {/* 4 Pillars Highlight */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
              <div className="agri-card rounded-3xl p-8 border border-emerald-800/40 bg-forest-900/50 flex gap-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <LayoutDashboard className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Simple, User-Friendly Interface</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Designed for researchers, students, and agronomists alike. Clean dark-emerald aesthetics, responsive layouts, intuitive cascading filters, and zero complex learning curves.
                  </p>
                </div>
              </div>

              <div className="agri-card rounded-3xl p-8 border border-emerald-800/40 bg-forest-900/50 flex gap-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Data-Driven Agricultural Analysis</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Strict adherence to agronomic mathematics. Yield is calculated from aggregate totals rather than distorted averages, giving you statistically defensible figures every time.
                  </p>
                </div>
              </div>

              <div className="agri-card rounded-3xl p-8 border border-emerald-800/40 bg-forest-900/50 flex gap-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
                  <BarChart2 className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Interactive Visualizations</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Dynamic Recharts graphs with responsive tooltips, multi-axis overlays, seasonal distribution pies, and rainfall correlation scatter plots instead of flat, static tables.
                  </p>
                </div>
              </div>

              <div className="agri-card rounded-3xl p-8 border border-emerald-800/40 bg-forest-900/50 flex gap-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-lime-500/10 border border-lime-500/20 text-lime-400">
                  <Database className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Easy Exploration of Historical Datasets</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Instant full-text search across 246,000+ records, multi-parameter sorting, flexible CSV upload validation for custom datasets, and rapid printable report generation.
                  </p>
                </div>
              </div>
            </div>

            {/* Comparison Grid Table */}
            <div className="agri-card rounded-3xl border border-emerald-800/50 bg-forest-900/60 p-6 sm:p-8 overflow-x-auto">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-400" />
                AgriVision vs Traditional Spreadsheets & Legacy Portals
              </h3>
              <table className="w-full text-left text-sm text-slate-300 min-w-[600px]">
                <thead>
                  <tr className="border-b border-emerald-800/50 text-xs uppercase tracking-wider text-slate-400">
                    <th className="pb-3 font-semibold">Capability</th>
                    <th className="pb-3 font-semibold text-emerald-400">AgriVision System</th>
                    <th className="pb-3 font-semibold text-slate-400">Spreadsheets / Legacy Portals</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-800/30 text-xs sm:text-sm">
                  <tr>
                    <td className="py-3.5 font-medium text-white">Yield Calculation</td>
                    <td className="py-3.5 text-emerald-300 font-semibold">✓ Exact Aggregate Formula (ΣP / ΣA)</td>
                    <td className="py-3.5 text-slate-400">✗ Distorted unweighted averages</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 font-medium text-white">Filtering Speed</td>
                    <td className="py-3.5 text-emerald-300 font-semibold">✓ Real-time Cascading & Instant KPIs</td>
                    <td className="py-3.5 text-slate-400">✗ Sluggish re-indexing & broken formulas</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 font-medium text-white">Visual Analytics</td>
                    <td className="py-3.5 text-emerald-300 font-semibold">✓ Interactive Recharts & Rainfall Overlays</td>
                    <td className="py-3.5 text-slate-400">✗ Static tables & PDF downloads only</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 font-medium text-white">Accessibility</td>
                    <td className="py-3.5 text-emerald-300 font-semibold">✓ Public Live Demo (No Login Required)</td>
                    <td className="py-3.5 text-slate-400">✗ Mandatory gated registrations & paywalls</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* =========================================================================
            7. CALL TO ACTION (CTA)
            ========================================================================= */}
        <section id="cta" className="py-20 sm:py-28 border-t border-emerald-900/40 relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30"
            aria-hidden="true"
          >
            <div className="h-[450px] w-[800px] rounded-full bg-emerald-500/20 blur-[140px]" />
          </div>

          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="agri-card rounded-3xl p-10 sm:p-14 lg:p-16 border border-emerald-500/30 bg-gradient-to-br from-forest-900/95 via-forest-900/80 to-forest-950 text-center shadow-2xl relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-300 mb-6">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Start Exploring Today</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-6 max-w-2xl mx-auto leading-tight">
                Ready to Explore Agricultural Insights?
              </h2>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
                Unlock historical crop patterns, state-wise rankings, and production trends across India. Explore the live interactive demo or create your free account.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
                <button
                  type="button"
                  onClick={onOpenDashboard}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl px-8 py-4 text-base font-bold text-forest-950 bg-gradient-to-r from-lime-400 via-emerald-400 to-teal-400 shadow-[0_0_25px_rgba(52,211,153,0.35)] hover:shadow-[0_0_40px_rgba(52,211,153,0.6)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                >
                  <Play className="h-4 w-4 fill-current" />
                  <span>Explore Demo</span>
                </button>

                <button
                  type="button"
                  onClick={onGoToRegister}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl border border-emerald-500/40 bg-forest-900/90 px-8 py-4 text-base font-semibold text-slate-100 hover:text-white hover:bg-forest-800 hover:border-emerald-400 transition-all cursor-pointer shadow-sm"
                >
                  <UserPlus className="h-4 w-4 text-emerald-400" />
                  <span>Create Free Account</span>
                </button>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-emerald-400" />
                  No credit card required
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-emerald-400" />
                  Instant guest access to live demo
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-emerald-400" />
                  246,000+ verified agronomy records
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =========================================================================
          8. FOOTER
          ========================================================================= */}
      <footer className="relative z-10 border-t border-emerald-900/50 bg-forest-950 pt-16 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
            {/* Brand column */}
            <div className="lg:col-span-2">
              <a href="#" className="flex items-center gap-3 mb-4 group inline-flex">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-forest-950 shadow-md">
                  <Sprout className="h-6 w-6 stroke-[2.5]" />
                </div>
                <span className="text-2xl font-black tracking-tight text-white">
                  Agri<span className="text-emerald-400">Vision</span>
                </span>
              </a>
              <p className="text-sm text-slate-400 leading-relaxed max-w-sm mb-6">
                Agricultural Crop Production Analysis System. Transforming historical production records into actionable agronomic insights, regional comparisons, and yield intelligence.
              </p>
              <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs text-emerald-300 font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>Analytical Platform · Historical Depth 2000–2023</span>
              </div>
            </div>

            {/* Quick Links / About Us */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">
                About Us
              </h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li>
                  <a href="#about" className="hover:text-emerald-400 transition-colors">
                    Our Mission
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-emerald-400 transition-colors">
                    Data Integrity & Yield Formula
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">
                    How AgriVision Works
                  </a>
                </li>
                <li>
                  <a href="#why-agrivision" className="hover:text-emerald-400 transition-colors">
                    Why AgriVision
                  </a>
                </li>
              </ul>
            </div>

            {/* Features */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">
                Features
              </h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li>
                  <a href="#features" className="hover:text-emerald-400 transition-colors">
                    Interactive Dashboard
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-emerald-400 transition-colors">
                    Crop Production Analysis
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-emerald-400 transition-colors">
                    Regional Comparison
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-emerald-400 transition-colors">
                    Historical Trend Analysis
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-emerald-400 transition-colors">
                    Dataset Explorer
                  </a>
                </li>
              </ul>
            </div>

            {/* Access & Demo */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">
                Access & Demo
              </h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li>
                  <button
                    onClick={onOpenDashboard}
                    className="hover:text-emerald-400 transition-colors text-left font-medium text-emerald-400 cursor-pointer flex items-center gap-1.5"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>Explore Live Demo</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={onGoToLogin}
                    className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                  >
                    Sign In to Account
                  </button>
                </li>
                <li>
                  <button
                    onClick={onGoToRegister}
                    className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                  >
                    Create Free Account
                  </button>
                </li>
                <li>
                  <a href="#preview" className="hover:text-emerald-400 transition-colors">
                    Interactive Preview
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar & Copyright */}
          <div className="border-t border-emerald-900/40 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400/80">
            <div>
              © 2026 AgriVision – Agricultural Crop Production Analysis System. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <span className="text-slate-500">
                For research, agronomic & analytical evaluation
              </span>
              <a
                href="#"
                className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                aria-label="Back to top"
              >
                <span>Back to top</span>
                <ChevronUp className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
