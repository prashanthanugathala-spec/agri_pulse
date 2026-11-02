import React, { useState, useEffect } from 'react';
import { analyticsService } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import { LoadingState, ErrorState } from '../components/FeedbackStates';

export const AnalyticsPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [yieldTrends, setYieldTrends] = useState([]);
  const [timeframe, setTimeframe] = useState('season');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const [mRes, yRes] = await Promise.all([
        analyticsService.getMetrics(timeframe),
        analyticsService.getYieldTrends(),
      ]);
      setMetrics(mRes);
      setYieldTrends(yRes);
    } catch (err) {
      setError(err.message || 'Failed to load analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [timeframe]);

  const handleExport = async () => {
    try {
      setExporting(true);
      const res = await analyticsService.exportReport('pdf');
      alert(`Report generated: ${res.message}`);
    } catch (err) {
      alert(err.message);
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <LoadingState message="Compiling seasonal yield intelligence..." />;
  if (error) return <ErrorState message={error} onRetry={loadAnalytics} />;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-header">
        <div>
          <span className="font-label-caps text-[#6E6E73]">Agronomic Intelligence</span>
          <h1 className="text-3xl sm:text-4xl font-normal text-[#1D1D1F] tracking-tight mt-1">
            Farm Analytics & Yield Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6E73] mt-1">
            Comparative harvest yield trajectories, resource optimization benchmarks, and financial returns.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-full bg-white p-1 border border-black/[0.04]">
            {[
              { id: 'month', label: '30 Days' },
              { id: 'season', label: 'Current Kharif' },
              { id: 'annual', label: 'Annual' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTimeframe(t.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  timeframe === t.id
                    ? 'bg-[#E8F3EC] text-[#2F6B4F] shadow-xs'
                    : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <Button
            variant="secondary"
            size="md"
            icon="download"
            isLoading={exporting}
            onClick={handleExport}
          >
            Export Dossier
          </Button>
        </div>
      </section>

      {/* 4 Analytics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-black/[0.04]">
          <span className="font-label-caps text-[#6E6E73]">Total Yield Projection</span>
          <div className="font-metric-num text-3xl text-[#1D1D1F] my-1">
            {metrics?.seasonYieldForecastTons || 28.5} <span className="text-sm font-normal text-[#6E6E73]">Tons</span>
          </div>
          <StatusBadge variant="eco" icon="arrow_upward">+11.4% vs Benchmark</StatusBadge>
        </div>

        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-black/[0.04]">
          <span className="font-label-caps text-[#6E6E73]">Projected Crop Value</span>
          <div className="font-metric-num text-3xl text-[#1D1D1F] my-1">
            {metrics?.projectedRevenueInr || '₹14,20,000'}
          </div>
          <StatusBadge variant="optimal">Pre-harvest Contracted</StatusBadge>
        </div>

        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-black/[0.04]">
          <span className="font-label-caps text-[#6E6E73]">Net Water Conserved</span>
          <div className="font-metric-num text-3xl text-[#1D1D1F] my-1">
            {metrics?.waterSavingsPercent || 18.4}%
          </div>
          <StatusBadge variant="eco" icon="water_drop">48,600 Liters Saved</StatusBadge>
        </div>

        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-black/[0.04]">
          <span className="font-label-caps text-[#6E6E73]">Nutrient Optimization</span>
          <div className="font-metric-num text-3xl text-[#1D1D1F] my-1">
            {metrics?.fertilizerCostReductionPercent || 12.2}%
          </div>
          <StatusBadge variant="eco">Cost Reduction</StatusBadge>
        </div>
      </div>

      {/* Yield Trend Comparison Chart */}
      <div className="bg-white rounded-[28px] p-6 shadow-sm border border-black/[0.04]">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-black/[0.04]">
          <div>
            <span className="font-label-caps text-[#6E6E73]">Biomass & Yield Accumulation</span>
            <h3 className="text-lg font-medium text-[#1D1D1F]">Monthly Harvest Actual vs Projected Target (Tons/Ac)</h3>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-[#2F6B4F] font-semibold">
              <span className="w-3 h-3 rounded-full bg-[#2F6B4F]" /> Actual Achieved
            </span>
            <span className="flex items-center gap-1.5 text-[#707972]">
              <span className="w-3 h-3 rounded-full bg-[#EAE7EA]" /> Regional Target
            </span>
          </div>
        </div>

        {/* Bar Comparison SVG */}
        <div className="h-64 flex items-end justify-between gap-6 px-4 pt-4">
          {yieldTrends.map((t, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <div className="w-full flex items-end justify-center gap-2 h-44">
                {/* Target Bar */}
                <div
                  className="w-5 sm:w-8 bg-[#EAE7EA] rounded-t-lg transition-all duration-300"
                  style={{ height: `${(t.target / 5.0) * 100}%` }}
                  title={`Target: ${t.target} t/ac`}
                />
                {/* Actual Bar */}
                <div
                  className="w-5 sm:w-8 bg-[#2F6B4F] rounded-t-lg transition-all duration-300 relative group"
                  style={{ height: `${(t.actual / 5.0) * 100}%` }}
                  title={`Actual: ${t.actual} t/ac`}
                >
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[#2F6B4F] opacity-0 group-hover:opacity-100 transition-opacity">
                    {t.actual}
                  </span>
                </div>
              </div>
              <span className="text-xs font-medium text-[#1D1D1F]">{t.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
