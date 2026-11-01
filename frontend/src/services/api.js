import axios from 'axios';

const API_BASE = '/api';

const client = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
});

export const api = {
  // Metadata & Filters
  getMetadata: async () => {
    const res = await client.get('/metadata/filters');
    return res.data;
  },

  // KPIs
  getKpis: async (filters = {}) => {
    const res = await client.get('/analytics/kpis', { params: cleanParams(filters) });
    return res.data;
  },

  // Historical Trends
  getTrends: async (filters = {}) => {
    const res = await client.get('/analytics/trends', { params: cleanParams(filters) });
    return res.data;
  },

  // State Comparison
  getStateComparison: async (filters = {}, limit = 10) => {
    const res = await client.get('/analytics/state-comparison', {
      params: { ...cleanParams(filters), limit },
    });
    return res.data;
  },

  // Crop Distribution
  getCropDistribution: async (filters = {}) => {
    const res = await client.get('/analytics/crop-distribution', { params: cleanParams(filters) });
    return res.data;
  },

  // Seasonal Stats
  getSeasonalStats: async (filters = {}) => {
    const res = await client.get('/analytics/seasonal', { params: cleanParams(filters) });
    return res.data;
  },

  // Rainfall Scatter
  getRainfallScatter: async (filters = {}, sampleLimit = 250) => {
    const res = await client.get('/analytics/rainfall-production', {
      params: { ...cleanParams(filters), sample_limit: sampleLimit },
    });
    return res.data;
  },

  // Paginated Records
  getRecords: async (params = {}) => {
    const res = await client.get('/records', { params: cleanParams(params) });
    return res.data;
  },

  // CSV Upload Validation
  validateCsv: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await client.post('/upload/validate', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  // CSV Upload Commit
  commitCsv: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await client.post('/upload/commit', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  // Sample Template Download URL
  getSampleTemplateUrl: () => `${API_BASE}/upload/sample`,

  // Export Download URL
  getExportUrl: (format = 'csv', filters = {}) => {
    const query = new URLSearchParams({ format, ...cleanParams(filters) }).toString();
    return `${API_BASE}/records/export?${query}`;
  },
};

// Helper to remove null, undefined, or empty "All" strings from query params
function cleanParams(obj) {
  const clean = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined && value !== '' && value !== 'All') {
      clean[key] = value;
    }
  }
  return clean;
}

export default api;
