import React, { useState } from 'react';
import {
  Sprout,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  Database,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function LoginPage({ onClose, onContinueAsGuest }) {
  const { login, register } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // UI status
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Quick fill demo user
  const handleUseDemo = () => {
    setEmail('demo@agrivision.ai');
    setPassword('AgriVision2026!');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // Client-side validations
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError('Please provide a valid email address.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (isRegisterMode) {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    setLoading(true);

    try {
      if (isRegisterMode) {
        await register(name.trim(), cleanEmail, password);
        setSuccessMsg('Account created successfully! Redirecting...');
      } else {
        await login(cleanEmail, password);
        setSuccessMsg('Signed in successfully!');
      }

      // If onClose provided (modal or view switch), close it after successful auth
      if (onClose) {
        setTimeout(() => {
          onClose();
        }, 500);
      }
    } catch (err) {
      console.error('Authentication error:', err);
      const detail =
        err?.response?.data?.detail ||
        (typeof err?.response?.data === 'string' ? err.response.data : null) ||
        err?.message ||
        'Authentication failed. Please verify your details.';
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-forest-950 text-slate-100 overflow-hidden select-none">
      {/* Dynamic ambient lighting & background glow */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-emerald-500/15 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-teal-500/15 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[700px] rounded-full bg-forest-900/40 blur-[150px]" />

      {/* Subtle grid pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #10b981 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl rounded-3xl border border-emerald-800/40 bg-forest-900/60 shadow-2xl shadow-emerald-950/80 backdrop-blur-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-all">
        {/* Optional Close/Back to Dashboard button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 rounded-full p-2 text-slate-400 hover:bg-forest-800/80 hover:text-white transition-colors"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* LEFT COLUMN: Visual Showcase & Brand Story (Desktop) */}
        <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-emerald-800/30 bg-gradient-to-br from-forest-900/80 via-forest-950/90 to-forest-900/60">
          <div>
            {/* Brand Header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-forest-950 shadow-lg shadow-emerald-900/50">
                <Sprout className="h-7 w-7 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-white">
                  Agri<span className="text-emerald-400">Vision</span>
                </span>
                <span className="ml-2 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-500/20">
                  ENTERPRISE
                </span>
                <p className="text-xs text-emerald-400/80 font-medium">Agronomic Intelligence Platform</p>
              </div>
            </div>

            {/* Headline */}
            <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight mb-4">
              Precision Insights for Sustainable Agriculture.
            </h2>
            <p className="text-sm text-slate-300/90 leading-relaxed mb-8">
              Access 24+ years of historical production metrics, meteorological cross-correlations, and district-level yield forecasting.
            </p>

            {/* Feature Highlights */}
            <div className="space-y-3.5 mb-8">
              <div className="flex items-start gap-3 rounded-xl border border-emerald-800/20 bg-forest-950/60 p-3 backdrop-blur-sm">
                <div className="mt-0.5 rounded-lg bg-emerald-500/10 p-1.5 text-emerald-400">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-emerald-200">Historical Yield Analytics</h4>
                  <p className="text-[11px] text-slate-400">Track 2000–2023 multi-season crop production trends.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-emerald-800/20 bg-forest-950/60 p-3 backdrop-blur-sm">
                <div className="mt-0.5 rounded-lg bg-emerald-500/10 p-1.5 text-emerald-400">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-emerald-200">Climatic Cross-Correlation</h4>
                  <p className="text-[11px] text-slate-400">Correlate rainfall patterns with regional production shifts.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-emerald-800/20 bg-forest-950/60 p-3 backdrop-blur-sm">
                <div className="mt-0.5 rounded-lg bg-emerald-500/10 p-1.5 text-emerald-400">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-emerald-200">Secure Agronomic Vault</h4>
                  <p className="text-[11px] text-slate-400">Export verified reports and upload custom CSV datasets safely.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Trust Badge */}
          <div className="flex items-center justify-between pt-6 border-t border-emerald-800/20 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>4,105 Records Live</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">SQLite WAL Engine</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Auth Form */}
        <div className="lg:col-span-7 p-8 lg:p-12 flex flex-col justify-center bg-forest-950/80">
          <div className="max-w-md mx-auto w-full">
            {/* Segmented Auth Mode Switch */}
            <div className="flex rounded-xl bg-forest-900/90 p-1 border border-emerald-800/40 mb-8 shadow-inner">
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(false);
                  setError('');
                  setSuccessMsg('');
                }}
                className={`flex-1 rounded-lg py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  !isRegisterMode
                    ? 'bg-emerald-600 text-forest-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(true);
                  setError('');
                  setSuccessMsg('');
                }}
                className={`flex-1 rounded-lg py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  isRegisterMode
                    ? 'bg-emerald-600 text-forest-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Form Title & Subtitle */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {isRegisterMode ? 'Join AgriVision' : 'Welcome back'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                {isRegisterMode
                  ? 'Set up your credentials to access advanced agricultural forecasting.'
                  : 'Enter your credentials to access your agronomic dashboard.'}
              </p>
            </div>

            {/* Success Alert */}
            {successMsg && (
              <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3.5 text-xs sm:text-sm text-emerald-300 animate-fadeIn">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Error Alert */}
            {error && (
              <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-red-500/40 bg-red-500/10 p-3.5 text-xs sm:text-sm text-red-300 animate-shake">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name (Register mode only) */}
              {isRegisterMode && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Kambala Pavan"
                      className="w-full rounded-xl border border-emerald-800/50 bg-forest-900/90 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400/50 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="analyst@agrivision.ai"
                    className="w-full rounded-xl border border-emerald-800/50 bg-forest-900/90 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400/50 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Password
                  </label>
                  {!isRegisterMode && (
                    <button
                      type="button"
                      onClick={handleUseDemo}
                      className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
                    >
                      Fill Demo Credentials
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full rounded-xl border border-emerald-800/50 bg-forest-900/90 pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400/50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-200"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (Register mode only) */}
              {isRegisterMode && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat your password"
                      className="w-full rounded-xl border border-emerald-800/50 bg-forest-900/90 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400/50 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 py-3 text-sm font-bold text-forest-950 hover:from-emerald-400 hover:to-teal-300 active:scale-[0.99] transition-all shadow-lg shadow-emerald-950/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-forest-950 border-t-transparent animate-spin" />
                    <span>{isRegisterMode ? 'Creating account...' : 'Signing in...'}</span>
                  </div>
                ) : (
                  <>
                    <span>{isRegisterMode ? 'Create Account' : 'Sign In'}</span>
                    <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-emerald-800/40" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-forest-950 px-3 text-slate-500">or explore freely</span>
              </div>
            </div>

            {/* Guest / Direct Dashboard Entry */}
            {onContinueAsGuest && (
              <button
                type="button"
                onClick={onContinueAsGuest}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-emerald-700/40 bg-forest-900/60 py-2.5 text-xs sm:text-sm font-semibold text-emerald-300 hover:bg-forest-800/60 hover:text-emerald-200 transition-colors"
              >
                <Database className="h-4 w-4" />
                <span>Continue to Dashboard as Guest</span>
                <ChevronRight className="h-4 w-4 opacity-70" />
              </button>
            )}

            {/* Terms and Privacy notice */}
            <p className="mt-6 text-center text-[11px] text-slate-500">
              Protected by JWT HS256 & Argon2 Password Hashing.
              <br />
              AgriVision Agricultural Intelligence System © 2026.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
