import axios from 'axios';
import * as mock from './mockData';

// Create configured Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach JWT if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('agripulse_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with unified error formatting & Netlify standalone resilience
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const config = error.config || {};
    const url = config.url || '';
    const method = (config.method || 'get').toLowerCase();

    // If network failed (e.g. backend unreachable on Netlify or connection refused)
    if (error.code === 'ERR_NETWORK' || !error.response || error.response.status === 404 || error.response.status >= 500) {
      console.info(`[AgriPulse Standalone Mode] Serving telemetry for: ${method.toUpperCase()} ${url}`);

      if (url.includes('/dashboard/overview')) return mock.mockDashboardOverview;
      if (url.includes('/farm/parcels')) return mock.mockParcels;
      if (url.includes('/farm')) return { name: 'Precision Agriculture Estate', location: 'Hyderabad, Telangana', totalAcreage: 12.5 };
      if (url.includes('/crops')) return mock.mockCrops;
      if (url.includes('/soil/metrics')) return mock.mockSoilMetrics;
      if (url.includes('/soil/tests')) return mock.mockSoilTests;
      if (url.includes('/weather/current')) return mock.mockWeatherCurrent;
      if (url.includes('/weather/forecast')) return mock.mockWeatherForecast;
      if (url.includes('/weather/advisories')) return mock.mockWeatherAdvisories;
      if (url.includes('/irrigation/zones')) return mock.mockIrrigationZones;
      if (url.includes('/irrigation/usage-trends')) return [{ day: 'Mon', usage: 120 }, { day: 'Tue', usage: 140 }, { day: 'Wed', usage: 95 }, { day: 'Thu', usage: 110 }, { day: 'Fri', usage: 80 }];
      if (url.includes('/pest/diagnostics')) return mock.mockPestDiagnostics;
      if (url.includes('/alerts')) return mock.mockAlerts;
      if (url.includes('/sensors')) return mock.mockSensors;
      if (url.includes('/settings')) return mock.mockSettings;
      if (url.includes('/auth/login') || url.includes('/auth/register')) return mock.mockUser;
      if (url.includes('/auth/me')) return mock.mockUser;
      if (url.includes('/analytics/metrics')) return { soilHealth: 88, waterSavedPercent: 24, yieldForecastTons: 32 };
      if (url.includes('/analytics/yield-trends')) return [{ month: 'May', yield: 4.2 }, { month: 'Jun', yield: 4.8 }, { month: 'Jul', yield: 5.1 }, { month: 'Aug', yield: 5.4 }, { month: 'Sep', yield: 5.8 }];
      if (url.includes('/market-prices')) return mock.mockMarketPrices;
      if (url.includes('/farming-techniques')) return mock.mockFarmingTechniques;
      if (url.includes('/pesticides')) return mock.mockPesticides;
      if (url.includes('/government-schemes')) return mock.mockGovSchemes;
      if (url.includes('/irrigation/water-flow') || url.includes('/water-flow')) return mock.mockWaterFlowTelemetry;
      if (url.includes('/farmer-profile/id-card')) return {
        farmerUid: mock.mockFarmerProfile.farmerUid,
        fullName: mock.mockFarmerProfile.fullName,
        farmName: mock.mockFarmerProfile.farmName,
        totalAcreage: mock.mockFarmerProfile.totalAcreage,
        surveyNumbers: mock.mockFarmerProfile.surveyNumbers,
        villageDistrict: `${mock.mockFarmerProfile.villageMandal}, ${mock.mockFarmerProfile.district}`,
        state: mock.mockFarmerProfile.state,
        pmKisanId: mock.mockFarmerProfile.pmKisanId,
        kccNumber: mock.mockFarmerProfile.kccNumber,
        soilHealthCardNo: mock.mockFarmerProfile.soilHealthCardNo,
        avatarUrl: mock.mockFarmerProfile.avatarUrl,
        validity: '2026 - 2029 Certified Pass',
        issuer: 'Ministry of Agriculture & AgriPulse Digital Registry',
        qrValidationHash: `AGRI-VERIFY-${mock.mockFarmerProfile.farmerUid}-DIGITAL`
      };
      if (url.includes('/farmer-profile/summary')) return {
        farmerUid: mock.mockFarmerProfile.farmerUid,
        fullName: mock.mockFarmerProfile.fullName,
        farmName: mock.mockFarmerProfile.farmName,
        totalAcreage: mock.mockFarmerProfile.totalAcreage,
        activeParcelsCount: mock.mockFarmerProfile.activeParcelsCount,
        vitalityScore: mock.mockFarmerProfile.vitalityScore,
        kccLimit: mock.mockFarmerProfile.kccLimit,
        verifiedBadges: mock.mockFarmerProfile.verifiedBadges
      };
      if (url.includes('/farmer-profile')) return mock.mockFarmerProfile;
      if (url.includes('/crops/analysis')) return mock.mockCropAnalysis;
      if (url.includes('/recommendations')) return [{ id: 1, text: 'Apply foliar potassium nitrate on Cotton in Zone B', urgency: 'MEDIUM', completed: false }];
      if (url.includes('/ai/messages')) return [];
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

// ==========================================
// API SERVICES
// ==========================================

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  getCurrentUser: () => api.get('/auth/me'),
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore network errors on logout
    } finally {
      localStorage.removeItem('agripulse_token');
      localStorage.removeItem('agripulse_user');
    }
  },
};

export const dashboardService = {
  getOverview: () => api.get('/dashboard/overview'),
  runDiagnostic: () => api.post('/dashboard/run-diagnostic'),
};

export const farmService = {
  getFarm: () => api.get('/farm'),
  getParcels: () => api.get('/farm/parcels'),
  getParcelById: (id) => api.get(`/farm/parcels/${id}`),
  updateParcel: (id, data) => api.put(`/farm/parcels/${id}`, data),
};

export const cropService = {
  getAllCrops: (params) => api.get('/crops', { params }),
  getCropById: (id) => api.get(`/crops/${id}`),
  createCrop: (data) => api.post('/crops', data),
  updateCrop: (id, data) => api.put(`/crops/${id}`, data),
  deleteCrop: (id) => api.delete(`/crops/${id}`),
};

export const soilService = {
  getMetrics: () => api.get('/soil/metrics'),
  getTestsHistory: () => api.get('/soil/tests'),
  logTest: (data) => api.post('/soil/tests', data),
};

export const weatherService = {
  getCurrent: () => api.get('/weather/current'),
  getForecast: () => api.get('/weather/forecast'),
  getAdvisories: () => api.get('/weather/advisories'),
};

export const irrigationService = {
  getZones: () => api.get('/irrigation/zones'),
  toggleValve: (zoneId, active) => api.post(`/irrigation/zones/${zoneId}/toggle`, { active }),
  updateConfig: (data) => api.post('/irrigation/config', data),
  getUsageTrends: () => api.get('/irrigation/usage-trends'),
  emergencyStop: () => api.post('/irrigation/emergency-stop'),
};

export const pestService = {
  getDiagnostics: () => api.get('/pest/diagnostics'),
  runVisionScan: (formData) => api.post('/pest/scan', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  simulateScan: (data) => api.post('/pest/simulate-scan', data),
};

export const aiService = {
  getHistory: () => api.get('/ai/messages'),
  sendMessage: async (prompt) => {
    try {
      return await api.post('/ai/chat', { prompt });
    } catch {
      // Direct Groq fallback for Netlify standalone
      const { askVoiceAssistant } = await import('./voiceAssistantService');
      const voiceRes = await askVoiceAssistant(prompt, window.location.pathname);
      return {
        id: Date.now(),
        sender: 'AGRONOMIST_AI',
        message: voiceRes.displayText || voiceRes.spokenText,
        groundingSources: voiceRes.grounding || 'AgriPulse Groq LPU • Live IoT Edge Telemetry',
        createdAt: new Date().toISOString(),
      };
    }
  },
  clearHistory: () => api.delete('/ai/messages'),
};

export const analyticsService = {
  getMetrics: (timeframe) => api.get('/analytics/metrics', { params: { timeframe } }),
  getYieldTrends: () => api.get('/analytics/yield-trends'),
  exportReport: (format) => api.get('/analytics/export', { params: { format } }),
};

export const alertService = {
  getAllAlerts: (status) => api.get('/alerts', { params: { status } }),
  resolveAlert: (id) => api.post(`/alerts/${id}/resolve`),
  snoozeAlert: (id, hours) => api.post(`/alerts/${id}/snooze`, { hours }),
  dismissAlert: (id) => api.delete(`/alerts/${id}`),
};

export const sensorService = {
  getAllSensors: () => api.get('/sensors'),
  pairSensor: (sensorData) => api.post('/sensors/pair', sensorData),
  calibrateSensor: (id) => api.post(`/sensors/${id}/calibrate`),
};

export const recommendationService = {
  getRecommendations: () => api.get('/recommendations'),
  completeRecommendation: (id) => api.post(`/recommendations/${id}/complete`),
};

export const settingsService = {
  getSettings: () => api.get('/settings'),
  updateProfile: (data) => api.put('/settings/profile', data),
  updateNotifications: (data) => api.put('/settings/notifications', data),
  updateTelemetryFrequency: (freq) => api.put('/settings/telemetry', { frequency: freq }),
};

export const marketPriceService = {
  getAllPrices: (params) => api.get('/market-prices', { params }),
  getCommodityById: (id) => api.get(`/market-prices/${id}`),
};

export const farmingTechniqueService = {
  getAllTechniques: () => api.get('/farming-techniques'),
  getTechniqueById: (id) => api.get(`/farming-techniques/${id}`),
};

export const pesticideService = {
  getAllPesticides: (params) => api.get('/pesticides', { params }),
  getPesticideById: (id) => api.get(`/pesticides/${id}`),
};

export const governmentSchemeService = {
  getAllSchemes: (params) => api.get('/government-schemes', { params }),
  getSchemeById: (id) => api.get(`/government-schemes/${id}`),
};

export const waterFlowService = {
  getTelemetry: () => api.get('/irrigation/water-flow'),
};

export const cropAnalysisService = {
  getCropAnalysis: (cropId) => api.get('/crops/analysis', { params: { cropId } }),
};

export const farmerProfileService = {
  getProfile: (userId) => api.get('/farmer-profile', { params: { userId } }),
  updateProfile: (data, userId) => api.put('/farmer-profile', data, { params: { userId } }),
  getDigitalIdCard: (userId) => api.get('/farmer-profile/id-card', { params: { userId } }),
  getSummary: (userId) => api.get('/farmer-profile/summary', { params: { userId } }),
};

export default api;


