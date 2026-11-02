import React, { useState, useEffect } from 'react';
import { weatherService } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { LoadingState, ErrorState } from '../components/FeedbackStates';

export const WeatherPage = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadWeather = async () => {
      try {
        setLoading(true);
        const res = await weatherService.getCurrent();
        setWeather(res);
      } catch (err) {
        setError(err.message || 'Failed to load weather telemetry.');
      } finally {
        setLoading(false);
      }
    };
    loadWeather();
  }, []);

  if (loading) return <LoadingState message="Connecting to hyper-local weather station..." />;
  if (error) return <ErrorState message={error} />;

  let forecast = [];
  try {
    forecast = weather?.forecastJson ? JSON.parse(weather.forecastJson) : [];
  } catch (e) {
    forecast = [];
  }

  let advisories = [];
  try {
    advisories = weather?.advisoriesJson ? JSON.parse(weather.advisoriesJson) : [];
  } catch (e) {
    advisories = [];
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-header">
        <div>
          <span className="font-label-caps text-[#6E6E73]">Hyper-Local Atmospheric Intelligence</span>
          <h1 className="text-3xl sm:text-4xl font-normal text-[#1D1D1F] tracking-tight mt-1">
            Farm Microclimate & 7-Day Forecast
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6E73] mt-1">
            Solar radiation, atmospheric vapor pressure deficits (VPD), and precipitation models.
          </p>
        </div>

        <StatusBadge variant="optimal" icon="sensors">
          Station SNS-WTH-04 Live
        </StatusBadge>
      </section>

      {/* Primary Current Atmospheric Card */}
      <div className="bg-white rounded-[28px] p-6 lg:p-8 shadow-sm border border-black/[0.04]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-black/[0.04]">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-[#E8F3EC] flex items-center justify-center text-[#125238]">
              <span className="material-symbols-outlined text-[48px]">wb_sunny</span>
            </div>
            <div>
              <span className="font-label-caps text-[#6E6E73]">Ambient Field Temperature</span>
              <div className="font-metric-num text-5xl text-[#1D1D1F] my-1">
                {weather?.temperature || 29.4}°C
              </div>
              <div className="text-xs text-[#6E6E73]">
                {weather?.conditionName || 'Clear Sky'} • {weather?.location || 'Hyderabad, Telangana'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#F6F3F5]">
              <div className="text-[10px] text-[#6E6E73] uppercase font-semibold">Relative Humidity</div>
              <div className="font-metric-num text-xl text-[#1D1D1F] mt-1">{weather?.humidity}%</div>
              <span className="text-[11px] text-[#34C759]">Balanced</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#F6F3F5]">
              <div className="text-[10px] text-[#6E6E73] uppercase font-semibold">Wind Velocity</div>
              <div className="font-metric-num text-xl text-[#1D1D1F] mt-1">{weather?.windSpeed} km/h</div>
              <span className="text-[11px] text-[#2F6B4F]">Northwest Drift</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#F6F3F5]">
              <div className="text-[10px] text-[#6E6E73] uppercase font-semibold">UV Radiance</div>
              <div className="font-metric-num text-xl text-[#1D1D1F] mt-1">UV {weather?.uvIndex}</div>
              <span className="text-[11px] text-[#FF9F0A]">Moderate-High</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#F6F3F5]">
              <div className="text-[10px] text-[#6E6E73] uppercase font-semibold">Evapotranspiration</div>
              <div className="font-metric-num text-xl text-[#1D1D1F] mt-1">{weather?.evapotranspiration} mm</div>
              <span className="text-[11px] text-[#2F6B4F]">Daily Loss Rate</span>
            </div>
          </div>
        </div>

        {/* 7-Day Forecast Grid */}
        <div className="pt-6">
          <h3 className="text-sm font-medium text-[#1D1D1F] mb-4">7-Day Synoptic Weather Outlook</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {forecast.map((item, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border text-center transition-all ${
                  item.day === 'Today'
                    ? 'bg-[#E8F3EC]/50 border-[#2F6B4F]/30 shadow-xs'
                    : 'bg-[#F6F3F5] border-black/[0.04]'
                }`}
              >
                <span className="text-xs font-semibold text-[#1D1D1F] block mb-2">{item.day}</span>
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mx-auto mb-2 text-[#3A6751] shadow-xs">
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                </div>
                <div className="text-sm font-semibold text-[#1D1D1F]">{item.temp}°C</div>
                <div className="text-[10px] text-[#6E6E73] mt-0.5 truncate">{item.condition}</div>
                <div className="text-[11px] font-medium text-[#2F6B4F] mt-2 flex items-center justify-center gap-0.5">
                  <span className="material-symbols-outlined text-[12px]">water_drop</span>
                  <span>{item.rain}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Microclimate Advisories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {advisories.map((adv, idx) => (
          <div
            key={idx}
            className="bg-white rounded-[24px] p-6 shadow-sm border border-black/[0.04] flex items-start gap-4"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              adv.type === 'HEAT_ADVISORY' ? 'bg-[#FF9F0A]/10 text-[#FF9F0A]' : 'bg-[#34C759]/10 text-[#34C759]'
            }`}>
              <span className="material-symbols-outlined text-[24px]">
                {adv.type === 'HEAT_ADVISORY' ? 'wb_incandescent' : 'air'}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-semibold text-[#1D1D1F]">{adv.title}</h4>
                <StatusBadge variant={adv.type === 'HEAT_ADVISORY' ? 'warning' : 'optimal'}>
                  {adv.type === 'HEAT_ADVISORY' ? 'Attention' : 'Optimal'}
                </StatusBadge>
              </div>
              <p className="text-xs text-[#6E6E73] leading-relaxed">{adv.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherPage;
