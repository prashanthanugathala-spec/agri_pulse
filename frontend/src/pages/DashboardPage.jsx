import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService, alertService } from '../services/api';
import MetricCard from '../components/MetricCard';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { LoadingState, ErrorState } from '../components/FeedbackStates';

export const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [diagnosticRunning, setDiagnosticRunning] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState(null);

  const navigate = useNavigate();

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await dashboardService.getOverview();
      setData(res);
    } catch (err) {
      setError(err.message || 'Unable to connect to telemetry service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleRunDiagnostic = async () => {
    try {
      setDiagnosticRunning(true);
      const res = await dashboardService.runDiagnostic();
      setDiagnosticResult(res.message);
    } catch (err) {
      setDiagnosticResult('Diagnostic error: ' + err.message);
    } finally {
      setDiagnosticRunning(false);
    }
  };

  const handleResolveAlert = async (id) => {
    try {
      await alertService.resolveAlert(id);
      loadDashboard();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <LoadingState message="Connecting to edge telemetry network..." />;
  if (error) return <ErrorState message={error} onRetry={loadDashboard} />;

  const {
    farmerName = 'Ravi',
    farmName = 'Green Valley Farm',
    location = 'Hyderabad, Telangana',
    totalAreaAcres = 12.5,
    leasedAreaAcres = 0.5,
    activeCropsCount = 4,
    cropSummaryNames = 'Rice, Cotton, Tomato, Orchards',
    soilMoistureAvg = 68.0,
    cropHealthScoreAvg = 87,
    waterConsumedTodayLiters = 1240,
    activeAlertsCount = 3,
    criticalAlertsCount = 1,
    currentWeather,
    parcels = [],
    crops = [],
    recentAlerts = [],
    recommendations = [],
  } = data || {};

  return (
    <div className="flex flex-col gap-6">
      {/* Executive Greeting Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-header">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#34C759] animate-pulse" />
            <span className="font-label-caps text-[#6E6E73]">Live System Active</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-normal text-[#1D1D1F] tracking-tight">
            Good morning, {farmerName}
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6E73] mt-1 font-normal">
            Thursday, 24 October 2026 • {farmName}, {location} ({totalAreaAcres} Acres)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="md"
            icon="analytics"
            isLoading={diagnosticRunning}
            onClick={handleRunDiagnostic}
            id="run-diagnostic-btn"
          >
            Run Farm Diagnostic
          </Button>
        </div>
      </section>

      {/* 6-Metric Executive Matrix */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Metric 1: Total Area */}
        <MetricCard
          title="Total Area"
          value={totalAreaAcres}
          unit="Acres"
          icon="crop_free"
          subtext={`+${leasedAreaAcres} ac leased`}
        />

        {/* Metric 2: Active Crops */}
        <MetricCard
          title="Active Crops"
          value={activeCropsCount}
          unit="Varieties"
          icon="psychiatry"
          subtext={cropSummaryNames}
        />

        {/* Metric 3: Soil Moisture */}
        <MetricCard
          title="Soil Moisture"
          value={`${soilMoistureAvg}%`}
          icon="water_ph"
          badgeText="+3% Optimal"
          badgeVariant="eco"
          badgeIcon="arrow_upward"
        />

        {/* Metric 4: Crop Health */}
        <MetricCard
          title="Crop Health"
          value={`${cropHealthScoreAvg}%`}
          icon="eco"
          badgeText="Good condition"
          badgeVariant="optimal"
        />

        {/* Metric 5: Water Today */}
        <MetricCard
          title="Water Today"
          value={waterConsumedTodayLiters.toLocaleString()}
          unit="L"
          icon="water_drop"
          badgeText="-18% Saved"
          badgeVariant="eco"
          badgeIcon="arrow_downward"
        />

        {/* Metric 6: Incidents */}
        <MetricCard
          title="Active Alerts"
          value={activeAlertsCount}
          unit="Open"
          icon="crisis_alert"
          badgeText={`${criticalAlertsCount} Critical`}
          badgeVariant={criticalAlertsCount > 0 ? 'critical' : 'optimal'}
        />
      </section>

      {/* Strategic Agronomy Quick Launch Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Market Prices Quick Card */}
        <div
          onClick={() => navigate('/market-prices')}
          className="p-4 rounded-[22px] bg-white border border-black/[0.04] shadow-xs hover:border-[#125238]/30 hover:shadow-sm cursor-pointer transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E8F3EC] flex items-center justify-center text-[#125238] group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[22px]">storefront</span>
            </div>
            <div>
              <span className="text-[10px] text-[#6E6E73] uppercase font-semibold block">Market Prices</span>
              <div className="text-xs font-semibold text-[#1D1D1F]">Paddy: ₹2,350 <span className="text-[#34C759]">▲+45</span></div>
              <div className="text-[10px] text-[#707972]">Live APMC Mandi Rates</div>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#707972] text-[18px] group-hover:translate-x-0.5 transition-transform">
            arrow_forward
          </span>
        </div>

        {/* Water Flow to Soil Quick Card */}
        <div
          onClick={() => navigate('/irrigation')}
          className="p-4 rounded-[22px] bg-white border border-black/[0.04] shadow-xs hover:border-[#125238]/30 hover:shadow-sm cursor-pointer transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E8F3EC] flex items-center justify-center text-[#125238] group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[22px]">water_drop</span>
            </div>
            <div>
              <span className="text-[10px] text-[#6E6E73] uppercase font-semibold block">Water Flow Readings</span>
              <div className="text-xs font-semibold text-[#1D1D1F]">48.2 L/min • 14.5 mm/h</div>
              <div className="text-[10px] text-[#707972]">Subterranean Infiltration</div>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#707972] text-[18px] group-hover:translate-x-0.5 transition-transform">
            arrow_forward
          </span>
        </div>

        {/* Farming Techniques Quick Card */}
        <div
          onClick={() => navigate('/farming-techniques')}
          className="p-4 rounded-[22px] bg-white border border-black/[0.04] shadow-xs hover:border-[#125238]/30 hover:shadow-sm cursor-pointer transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E8F3EC] flex items-center justify-center text-[#125238] group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[22px]">agriculture</span>
            </div>
            <div>
              <span className="text-[10px] text-[#6E6E73] uppercase font-semibold block">Farming Techniques</span>
              <div className="text-xs font-semibold text-[#1D1D1F]">8 Proven Blueprints</div>
              <div className="text-[10px] text-[#707972]">Organic, Hydroponic, ZBNF</div>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#707972] text-[18px] group-hover:translate-x-0.5 transition-transform">
            arrow_forward
          </span>
        </div>

        {/* Govt Schemes Quick Card */}
        <div
          onClick={() => navigate('/gov-schemes')}
          className="p-4 rounded-[22px] bg-white border border-black/[0.04] shadow-xs hover:border-[#125238]/30 hover:shadow-sm cursor-pointer transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E8F3EC] flex items-center justify-center text-[#125238] group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[22px]">account_balance</span>
            </div>
            <div>
              <span className="text-[10px] text-[#6E6E73] uppercase font-semibold block">Govt Schemes & Grants</span>
              <div className="text-xs font-semibold text-[#1D1D1F]">₹2.4L+ Subsidy Match</div>
              <div className="text-[10px] text-[#707972]">PM-KISAN, PMKSY, KUSUM</div>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#707972] text-[18px] group-hover:translate-x-0.5 transition-transform">
            arrow_forward
          </span>
        </div>
      </section>

      {/* Main Grid: Farm Layout & Parcels on Left, Weather & Alerts on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Parcels Overview + Crops Phenology */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Parcels Card */}
          <div className="bg-white rounded-[24px] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_20px_40px_-15px_rgba(0,0,0,0.03)] border border-black/[0.04]">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-black/[0.04]">
              <div>
                <span className="font-label-caps text-[#6E6E73]">Spatial Management</span>
                <h3 className="text-lg font-medium text-[#1D1D1F]">Field Parcels & Solenoid Zones</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                iconRight="arrow_forward"
                onClick={() => navigate('/my-farm')}
              >
                Interactive Map
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {parcels.map((parcel) => (
                <div
                  key={parcel.id}
                  onClick={() => navigate('/my-farm')}
                  className="p-4 rounded-2xl bg-[#F6F3F5] border border-black/[0.04] hover:bg-[#F0EDEF] cursor-pointer transition-all flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="font-semibold text-xs text-[#1D1D1F]">{parcel.code}</span>
                      <h4 className="text-sm font-medium text-[#1D1D1F] mt-0.5">{parcel.name}</h4>
                    </div>
                    <StatusBadge
                      variant={
                        parcel.irrigationStatus === 'ACTIVE'
                          ? 'optimal'
                          : parcel.irrigationStatus === 'SCHEDULED'
                          ? 'eco'
                          : 'neutral'
                      }
                    >
                      {parcel.irrigationStatus}
                    </StatusBadge>
                  </div>

                  <div className="text-xs text-[#6E6E73] mb-3">
                    {parcel.cropName} • {parcel.acreage} ac
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-black/[0.04] text-xs">
                    <span className="text-[#6E6E73]">Moisture: <strong className="text-[#1D1D1F]">{parcel.soilMoisture}%</strong></span>
                    <span className="text-[#6E6E73]">NDVI: <strong className="text-[#2F6B4F]">{parcel.ndviIndex}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Crop Portfolio Snapshot */}
          <div className="bg-white rounded-[24px] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_20px_40px_-15px_rgba(0,0,0,0.03)] border border-black/[0.04]">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-black/[0.04]">
              <div>
                <span className="font-label-caps text-[#6E6E73]">Phenological Staging</span>
                <h3 className="text-lg font-medium text-[#1D1D1F]">Active Crop Health Index</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                iconRight="arrow_forward"
                onClick={() => navigate('/crops')}
              >
                All Crops
              </Button>
            </div>

            <div className="space-y-3">
              {crops.map((crop) => (
                <div
                  key={crop.id}
                  className="p-3.5 rounded-xl hover:bg-[#F6F3F5] transition-colors flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#E8F3EC] flex items-center justify-center text-[#2F6B4F]">
                      <span className="material-symbols-outlined text-[20px]">potted_plant</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[#1D1D1F]">{crop.name} ({crop.variety})</div>
                      <div className="text-xs text-[#6E6E73]">{crop.season} • Stage: {crop.stage}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <div className="text-xs font-medium text-[#1D1D1F]">{crop.yieldForecast}</div>
                      <div className="text-[11px] text-[#6E6E73]">Req: {crop.waterRequirement}</div>
                    </div>
                    <StatusBadge variant={crop.healthScore >= 85 ? 'optimal' : 'warning'}>
                      {crop.healthScore}% Vigor
                    </StatusBadge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Weather, Alerts, Recommendations */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Microclimate Card */}
          {currentWeather && (
            <div className="bg-white rounded-[24px] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_20px_40px_-15px_rgba(0,0,0,0.03)] border border-black/[0.04]">
              <div className="flex items-center justify-between mb-4">
                <span className="font-label-caps text-[#6E6E73]">Edge Weather Station</span>
                <span className="material-symbols-outlined text-[#3A6751] text-[20px]">wb_sunny</span>
              </div>
              <div className="flex items-baseline justify-between mb-3">
                <div className="font-metric-num text-4xl font-normal text-[#1D1D1F]">
                  {currentWeather.temperature}°C
                </div>
                <StatusBadge variant="eco">{currentWeather.conditionName}</StatusBadge>
              </div>
              <div className="grid grid-cols-3 gap-2 py-3 border-y border-black/[0.04] text-center">
                <div>
                  <div className="text-[10px] text-[#6E6E73] uppercase font-semibold">Humidity</div>
                  <div className="text-sm font-medium text-[#1D1D1F] mt-0.5">{currentWeather.humidity}%</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#6E6E73] uppercase font-semibold">Wind</div>
                  <div className="text-sm font-medium text-[#1D1D1F] mt-0.5">{currentWeather.windSpeed} km/h</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#6E6E73] uppercase font-semibold">Rain Prob</div>
                  <div className="text-sm font-medium text-[#1D1D1F] mt-0.5">{currentWeather.rainProbability}%</div>
                </div>
              </div>
              <div className="pt-3 flex items-center justify-between text-xs text-[#2F6B4F]">
                <span>ET0: {currentWeather.evapotranspiration} mm/day</span>
                <button onClick={() => navigate('/weather')} className="hover:underline cursor-pointer">
                  7-Day Trend →
                </button>
              </div>
            </div>
          )}

          {/* Proactive Alerts */}
          <div className="bg-white rounded-[24px] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_20px_40px_-15px_rgba(0,0,0,0.03)] border border-black/[0.04]">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-black/[0.04]">
              <h3 className="text-sm font-medium text-[#1D1D1F] flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#BA1A1A]">crisis_alert</span>
                Incident Feed
              </h3>
              <span className="text-xs text-[#6E6E73]">{recentAlerts.length} Active</span>
            </div>

            <div className="space-y-3">
              {recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-xl border text-xs transition-all ${
                    alert.resolved
                      ? 'bg-black/5 border-transparent opacity-60'
                      : alert.severity === 'CRITICAL'
                      ? 'bg-[#FFDAD6]/30 border-[#BA1A1A]/20'
                      : 'bg-[#F6F3F5] border-black/[0.04]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-[#1D1D1F]">{alert.title}</span>
                    <StatusBadge variant={alert.resolved ? 'neutral' : alert.severity === 'CRITICAL' ? 'critical' : 'warning'}>
                      {alert.resolved ? 'Resolved' : alert.severity}
                    </StatusBadge>
                  </div>
                  <p className="text-[11px] text-[#6E6E73] mb-2">{alert.description}</p>
                  {!alert.resolved && (
                    <button
                      onClick={() => handleResolveAlert(alert.id)}
                      className="text-[11px] font-medium text-[#2F6B4F] hover:underline cursor-pointer"
                    >
                      Mark Resolved ✓
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Prioritized Recommendations */}
          <div className="bg-white rounded-[24px] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_20px_40px_-15px_rgba(0,0,0,0.03)] border border-black/[0.04]">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-black/[0.04]">
              <h3 className="text-sm font-medium text-[#1D1D1F] flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#2F6B4F]">auto_awesome</span>
                Agronomic Actions
              </h3>
            </div>
            <div className="space-y-3">
              {recommendations.slice(0, 3).map((rec) => (
                <div key={rec.id} className="p-3 rounded-xl bg-[#F6F3F5] text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-[#1D1D1F]">{rec.title}</span>
                    <StatusBadge variant="eco">{rec.impactCategory}</StatusBadge>
                  </div>
                  <p className="text-[11px] text-[#6E6E73] mb-2">{rec.summary}</p>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full text-[11px]"
                    onClick={() => navigate('/recommendations-and-settings')}
                  >
                    {rec.actionCta || 'Execute Action'}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Diagnostic Result Modal */}
      <Modal
        isOpen={!!diagnosticResult}
        onClose={() => setDiagnosticResult(null)}
        title="Diagnostic Complete"
        subtitle="AgriPulse Real-time Telemetry Health Check"
      >
        <div className="py-4 text-center">
          <div className="w-14 h-14 rounded-full bg-[#E8F3EC] flex items-center justify-center mx-auto mb-3 text-[#125238]">
            <span className="material-symbols-outlined text-[28px]">check_circle</span>
          </div>
          <p className="text-sm text-[#1B1B1D] font-medium mb-2">{diagnosticResult}</p>
          <p className="text-xs text-[#6E6E73]">Edge gateways, probes, and solenoid valves report 100% telemetry continuity.</p>
        </div>
        <Button
          variant="primary"
          className="w-full mt-4"
          onClick={() => setDiagnosticResult(null)}
        >
          Close Report
        </Button>
      </Modal>
    </div>
  );
};

export default DashboardPage;
