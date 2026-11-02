import React from 'react';
import { Sprout, LogIn, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function LandingPage({ onOpenDashboard, onGoToLogin }) {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-forest-950 text-slate-100 select-none">
      {/* Dynamic Ambient Background Glows */}
      <div
        className="pointer-events-none absolute -top-48 left-1/2 -translate-x-1/2 h-[650px] w-[900px] rounded-full bg-emerald-500/15 blur-[140px] animate-pulse-glow"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-teal-500/10 blur-[130px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/2 -right-32 h-[500px] w-[500px] rounded-full bg-lime-500/10 blur-[140px]"
        aria-hidden="true"
      />

      {/* Subtle Data Grid Pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #10b981 1px, transparent 0)',
          backgroundSize: '36px 36px',
        }}
        aria-hidden="true"
      />

      {/* Rolling Field Contour Lines (Inline SVG) */}
      <svg
        className="pointer-events-none absolute bottom-0 left-0 right-0 w-full h-48 sm:h-64 text-emerald-500/10"
        viewBox="0 0 1440 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,192L60,186.7C120,181,240,171,360,186.7C480,203,600,245,720,240C840,235,960,181,1080,165.3C1200,149,1320,171,1380,181.3L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          fill="currentColor"
        />
        <path
          d="M0,256L80,240C160,224,320,192,480,192C640,192,800,224,960,234.7C1120,245,1280,235,1360,229.3L1440,224L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          fill="rgba(4, 39, 24, 0.4)"
        />
      </svg>

      {/* Decorative Wheat Stalk - Left (Inline SVG) */}
      <div
        className="pointer-events-none hidden xl:block absolute left-12 top-1/2 -translate-y-1/2 w-48 h-96 opacity-25 animate-float-slow"
        aria-hidden="true"
      >
        <svg viewBox="0 0 100 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full stroke-emerald-400">
          <path d="M50 230 C 50 150, 48 80, 50 10" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M50 40 C 35 30, 25 35, 20 45 C 30 50, 45 46, 50 40" strokeWidth="2" fill="rgba(52,211,153,0.15)" />
          <path d="M50 40 C 65 30, 75 35, 80 45 C 70 50, 55 46, 50 40" strokeWidth="2" fill="rgba(52,211,153,0.15)" />
          <path d="M50 70 C 32 60, 22 65, 18 75 C 28 80, 45 76, 50 70" strokeWidth="2" fill="rgba(52,211,153,0.15)" />
          <path d="M50 70 C 68 60, 78 65, 82 75 C 72 80, 55 76, 50 70" strokeWidth="2" fill="rgba(52,211,153,0.15)" />
          <path d="M50 100 C 30 90, 20 95, 16 105 C 26 110, 45 106, 50 100" strokeWidth="2" fill="rgba(52,211,153,0.15)" />
          <path d="M50 100 C 70 90, 80 95, 84 105 C 74 110, 55 106, 50 100" strokeWidth="2" fill="rgba(52,211,153,0.15)" />
          <path d="M50 130 C 30 120, 20 125, 16 135 C 26 140, 45 136, 50 130" strokeWidth="2" fill="rgba(52,211,153,0.15)" />
          <path d="M50 130 C 70 120, 80 125, 84 135 C 74 140, 55 136, 50 130" strokeWidth="2" fill="rgba(52,211,153,0.15)" />
        </svg>
      </div>

      {/* Decorative Botanical Branch - Right (Inline SVG) */}
      <div
        className="pointer-events-none hidden xl:block absolute right-12 top-1/2 -translate-y-1/2 w-48 h-96 opacity-25 animate-float-reverse"
        aria-hidden="true"
      >
        <svg viewBox="0 0 100 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full stroke-teal-400">
          <path d="M50 230 C 50 160, 55 90, 50 10" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M50 50 C 35 38, 20 48, 22 62 C 34 65, 46 56, 50 50" strokeWidth="2" fill="rgba(45,212,191,0.15)" />
          <path d="M50 80 C 65 68, 80 78, 78 92 C 66 95, 54 86, 50 80" strokeWidth="2" fill="rgba(45,212,191,0.15)" />
          <path d="M50 110 C 35 98, 20 108, 22 122 C 34 125, 46 116, 50 110" strokeWidth="2" fill="rgba(45,212,191,0.15)" />
          <path d="M50 140 C 65 128, 80 138, 78 152 C 66 155, 54 146, 50 140" strokeWidth="2" fill="rgba(45,212,191,0.15)" />
        </svg>
      </div>

      {/* Minimal Top Header */}
      <header className="relative z-20 w-full px-6 sm:px-10 py-6 flex items-center justify-between max-w-7xl mx-auto">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-forest-950 shadow-md shadow-emerald-900/50">
            <Sprout className="h-6 w-6 stroke-[2.5]" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white">
            Agri<span className="text-emerald-400">Vision</span>
          </span>
        </div>

        {/* Minimal Auth State Button */}
        <div>
          {isAuthenticated && user ? (
            <button
              onClick={onOpenDashboard}
              className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-forest-900/80 px-4 py-1.5 text-xs sm:text-sm font-semibold text-emerald-300 hover:border-emerald-400 hover:bg-forest-800 transition-all cursor-pointer shadow-sm"
            >
              <UserCheck className="h-4 w-4 text-emerald-400" />
              <span className="hidden sm:inline">Signed in as</span>
              <span className="font-bold text-white">{user.name}</span>
            </button>
          ) : (
            <button
              onClick={onGoToLogin}
              className="flex items-center gap-2 rounded-full border border-emerald-600/40 bg-forest-900/80 px-4 py-1.5 text-xs sm:text-sm font-semibold text-emerald-300 hover:bg-emerald-800/40 hover:text-emerald-200 transition-all cursor-pointer shadow-sm"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Full-Screen Hero */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto py-12 sm:py-16">
        {/* Category Pill Tag */}
        <div className="animate-fade-in-up mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-300 backdrop-blur-md shadow-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Agricultural Intelligence Platform</span>
        </div>

        {/* Large Title */}
        <h1 className="animate-fade-in-up delay-100 text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight mb-4">
          <span className="bg-gradient-to-r from-lime-300 via-emerald-400 to-teal-300 bg-clip-text text-transparent drop-shadow-[0_8px_30px_rgba(16,185,129,0.35)]">
            AgriVision
          </span>
        </h1>

        {/* Subtitle Directly Underneath */}
        <p className="animate-fade-in-up delay-200 text-base sm:text-lg md:text-xl lg:text-2xl font-light tracking-[0.25em] uppercase text-emerald-200/90 mb-5">
          Agriculture Crop Production Analysis
        </p>

        {/* Supporting Line */}
        <p className="animate-fade-in-up delay-300 text-sm sm:text-base md:text-lg text-slate-300/85 max-w-xl mx-auto mb-10 leading-relaxed font-normal">
          Explore crop production, yield and rainfall trends across states and seasons.
        </p>

        {/* Primary CTA Button */}
        <div className="animate-fade-in-up delay-400">
          <button
            type="button"
            onClick={onOpenDashboard}
            aria-label="Open Dashboard →"
            className="group relative inline-flex items-center justify-center gap-3 rounded-full px-8 sm:px-11 py-4 sm:py-4.5 text-base sm:text-lg font-bold text-forest-950 bg-gradient-to-r from-lime-400 via-emerald-400 to-teal-400 shadow-[0_0_25px_rgba(52,211,153,0.35)] hover:shadow-[0_0_45px_rgba(52,211,153,0.65)] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400/80 focus-visible:ring-offset-4 focus-visible:ring-offset-forest-950 cursor-pointer"
          >
            <span className="tracking-tight">Open Dashboard</span>
            <span className="text-xl font-black transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden="true">
              →
            </span>
          </button>
        </div>

        {/* Feature Badges */}
        <div className="animate-fade-in-up delay-500 mt-12 sm:mt-16 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-300/80">
          <div className="flex items-center gap-2 rounded-xl border border-emerald-800/40 bg-forest-900/60 backdrop-blur-md px-3.5 py-2 shadow-sm">
            <span className="text-emerald-400 font-bold">✓</span>
            <span>Historical Trends (2000–2023)</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-emerald-800/40 bg-forest-900/60 backdrop-blur-md px-3.5 py-2 shadow-sm">
            <span className="text-emerald-400 font-bold">✓</span>
            <span>State & Crop Comparisons</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-emerald-800/40 bg-forest-900/60 backdrop-blur-md px-3.5 py-2 shadow-sm">
            <span className="text-emerald-400 font-bold">✓</span>
            <span>Rainfall & Agronomy Insights</span>
          </div>
        </div>
      </main>

      {/* Small Footer Line */}
      <footer className="relative z-20 w-full text-center py-6 px-4 text-xs text-slate-400/60 font-medium">
        Demo dataset · For analytical use
      </footer>
    </div>
  );
}

export default LandingPage;
