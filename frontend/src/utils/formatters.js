/**
 * Formatting utilities for AgriVision agricultural metrics
 */

export const formatProduction = (val, compact = false) => {
  if (val === null || val === undefined || isNaN(val)) return '0 MT';
  if (compact) {
    if (val >= 1e6) return `${(val / 1e6).toFixed(2)}M MT`;
    if (val >= 1e3) return `${(val / 1e3).toFixed(1)}k MT`;
  }
  return `${Number(val).toLocaleString(undefined, { maximumFractionDigits: 1 })} MT`;
};

export const formatArea = (val, compact = false) => {
  if (val === null || val === undefined || isNaN(val)) return '0 Ha';
  if (compact) {
    if (val >= 1e6) return `${(val / 1e6).toFixed(2)}M Ha`;
    if (val >= 1e3) return `${(val / 1e3).toFixed(1)}k Ha`;
  }
  return `${Number(val).toLocaleString(undefined, { maximumFractionDigits: 1 })} Ha`;
};

export const formatYield = (val) => {
  if (val === null || val === undefined || isNaN(val)) return '0.00 MT/Ha';
  return `${Number(val).toFixed(2)} MT/Ha`;
};

export const formatRainfall = (val) => {
  if (val === null || val === undefined || isNaN(val)) return '0.0 mm';
  return `${Number(val).toFixed(1)} mm`;
};

export const formatNumber = (val) => {
  if (val === null || val === undefined || isNaN(val)) return '0';
  return Number(val).toLocaleString();
};

export const formatPercent = (val) => {
  if (val === null || val === undefined || isNaN(val)) return '0.0%';
  return `${Number(val).toFixed(1)}%`;
};
