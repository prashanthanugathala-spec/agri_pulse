import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layout & Pages
import DashboardLayout from './components/DashboardLayout';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import FarmMapPage from './pages/FarmMapPage';
import CropsPage from './pages/CropsPage';
import SoilPage from './pages/SoilPage';
import WeatherPage from './pages/WeatherPage';
import IrrigationPage from './pages/IrrigationPage';
import PestPage from './pages/PestPage';
import AiChatPage from './pages/AiChatPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AlertsPage from './pages/AlertsPage';
import SensorsPage from './pages/SensorsPage';
import SettingsPage from './pages/SettingsPage';
import FarmerProfilePage from './pages/FarmerProfilePage';
import MarketPricesPage from './pages/MarketPricesPage';
import FarmingTechniquesPage from './pages/FarmingTechniquesPage';
import PesticidesPage from './pages/PesticidesPage';
import GovernmentSchemesPage from './pages/GovernmentSchemesPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public & Entry Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<FarmerProfilePage />} />
              <Route path="/farmer-profile" element={<FarmerProfilePage />} />
              <Route path="/my-farm" element={<FarmMapPage />} />
              <Route path="/crops" element={<CropsPage />} />
              <Route path="/soil" element={<SoilPage />} />
              <Route path="/weather" element={<WeatherPage />} />
              <Route path="/irrigation" element={<IrrigationPage />} />
              <Route path="/market-prices" element={<MarketPricesPage />} />
              <Route path="/farming-techniques" element={<FarmingTechniquesPage />} />
              <Route path="/pesticides" element={<PesticidesPage />} />
              <Route path="/gov-schemes" element={<GovernmentSchemesPage />} />
              <Route path="/pest-and-disease" element={<PestPage />} />
              <Route path="/agripulse-ai" element={<AiChatPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/alerts" element={<AlertsPage />} />
              <Route path="/sensors" element={<SensorsPage />} />
              <Route path="/recommendations-and-settings" element={<SettingsPage />} />
            </Route>
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
