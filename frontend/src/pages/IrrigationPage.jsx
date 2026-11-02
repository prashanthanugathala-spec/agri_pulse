import React, { useState, useEffect } from 'react';
import { irrigationService } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import { LoadingState, ErrorState } from '../components/FeedbackStates';

export const IrrigationPage = () => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAutoMode, setIsAutoMode] = useState(true);

  const loadZones = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await irrigationService.getZones();
      setZones(res);
    } catch (err) {
      setError(err.message || 'Failed to load irrigation telemetry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadZones();
  }, []);

  const handleToggleValve = async (id, currentVal) => {
    try {
      const updated = await irrigationService.toggleValve(id, !currentVal);
      setZones((prev) => prev.map((z) => (z.id === id ? updated : z)));
    } catch (err) {
      alert('Valve operation failed: ' + err.message);
    }
  };

  const handleEmergencyStop = async () => {
    if (!window.confirm('Trigger emergency shutdown for all active solenoid valves?')) return;
    try {
      await irrigationService.emergencyStop();
      loadZones();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <LoadingState message="Polling solenoid valve gateway..." />;
  if (error) return <ErrorState message={error} onRetry={loadZones} />;

  const totalWater = zones.reduce((acc, z) => acc + (z.waterConsumedToday || 0), 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-header">
        <div>
          <span className="font-label-caps text-[#6E6E73]">Automated Hydraulics</span>
          <h1 className="text-3xl sm:text-4xl font-normal text-[#1D1D1F] tracking-tight mt-1">
            Precision Irrigation Automation
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6E73] mt-1">
            Closed-loop soil moisture feedback, ultrasonic flow monitoring, and valve actuators.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mode Switcher */}
          <div className="flex rounded-full bg-white p-1 border border-black/[0.04]">
            <button
              onClick={() => setIsAutoMode(true)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                isAutoMode ? 'bg-[#E8F3EC] text-[#2F6B4F] shadow-xs' : 'text-[#6E6E73]'
              }`}
            >
              Autonomous Closed-Loop
            </button>
            <button
              onClick={() => setIsAutoMode(false)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                !isAutoMode ? 'bg-[#E8F3EC] text-[#2F6B4F] shadow-xs' : 'text-[#6E6E73]'
              }`}
            >
              Manual Override
            </button>
          </div>

          <Button
            variant="danger"
            size="md"
            icon="power_settings_new"
            onClick={handleEmergencyStop}
          >
            Emergency Stop
          </Button>
        </div>
      </section>

      {/* Hydraulic Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-black/[0.04]">
          <span className="font-label-caps text-[#6E6E73]">Total Hydration Dispatched</span>
          <div className="font-metric-num text-3xl text-[#1D1D1F] my-1">
            {totalWater.toLocaleString()} <span className="text-sm font-normal text-[#6E6E73]">Liters</span>
          </div>
          <StatusBadge variant="eco" icon="arrow_downward">-18% Water Efficiency</StatusBadge>
        </div>

        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-black/[0.04]">
          <span className="font-label-caps text-[#6E6E73]">Active Flow Rate</span>
          <div className="font-metric-num text-3xl text-[#1D1D1F] my-1">
            48.0 <span className="text-sm font-normal text-[#6E6E73]">L/min</span>
          </div>
          <StatusBadge variant="optimal" icon="waves">Pump Line Pressure 2.4 bar</StatusBadge>
        </div>

        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-black/[0.04]">
          <span className="font-label-caps text-[#6E6E73]">Active Solenoid Valves</span>
          <div className="font-metric-num text-3xl text-[#1D1D1F] my-1">
            {zones.filter((z) => z.valveState).length} of {zones.length}
          </div>
          <StatusBadge variant="neutral">Mesh Gateway Sync: 2s</StatusBadge>
        </div>
      </div>

      {/* Dedicated Water Flow to Soil Hydrology Telemetry Section */}
      <section className="bg-white rounded-[28px] p-6 shadow-sm border border-black/[0.04] flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-black/[0.04] gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#34C759] animate-pulse" />
              <span className="font-label-caps text-[#6E6E73]">Live Ultrasonic Hydrology Telemetry</span>
            </div>
            <h3 className="text-xl font-normal text-[#1D1D1F] tracking-tight mt-0.5">
              Readings of Water Flow to Soil
            </h3>
            <p className="text-xs text-[#6E6E73]">
              Real-time ultrasonic flowmeter measurements, subterranean infiltration velocity, and root-horizon saturation.
            </p>
          </div>

          <StatusBadge variant="eco" icon="water">
            Infiltration Rate: 14.5 mm/hr
          </StatusBadge>
        </div>

        {/* 4 Flow to Soil Core Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#F6F3F5] flex flex-col justify-between">
            <span className="text-[10px] text-[#6E6E73] uppercase font-semibold">Instantaneous Flow</span>
            <div className="font-metric-num text-2xl font-bold text-[#1D1D1F] my-1">
              48.2 <span className="text-xs font-normal text-[#6E6E73]">L/min</span>
            </div>
            <div className="text-[11px] text-[#2F6B4F] font-medium">2.89 m³/hr volumetric flow</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F6F3F5] flex flex-col justify-between">
            <span className="text-[10px] text-[#6E6E73] uppercase font-semibold">Hydraulic Line Pressure</span>
            <div className="font-metric-num text-2xl font-bold text-[#1D1D1F] my-1">
              2.4 <span className="text-xs font-normal text-[#6E6E73]">bar</span>
            </div>
            <div className="text-[11px] text-[#707972]">Velocity: 1.42 m/sec in 63mm pipe</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F6F3F5] flex flex-col justify-between">
            <span className="text-[10px] text-[#6E6E73] uppercase font-semibold">Soil Infiltration Rate</span>
            <div className="font-metric-num text-2xl font-bold text-[#1D1D1F] my-1">
              14.5 <span className="text-xs font-normal text-[#6E6E73]">mm/hr</span>
            </div>
            <div className="text-[11px] text-[#34C759] font-medium">Optimal Clay-Loam Infiltration</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F6F3F5] flex flex-col justify-between">
            <span className="text-[10px] text-[#6E6E73] uppercase font-semibold">Saturation Deficit</span>
            <div className="font-metric-num text-2xl font-bold text-[#1D1D1F] my-1">
              18.2 <span className="text-xs font-normal text-[#6E6E73]">mm</span>
            </div>
            <div className="text-[11px] text-[#707972]">Until Field Capacity reached</div>
          </div>
        </div>

        {/* Depth Absorption Horizons (0-5cm, 15cm, 30cm) */}
        <div>
          <span className="text-xs font-semibold text-[#1D1D1F] block mb-3">
            Subterranean Water Flow & Depth Horizon Penetration:
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl border border-black/[0.06] bg-[#FBFBFD]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#1D1D1F]">Surface Horizon (0 - 5 cm)</span>
                <span className="text-xs font-bold text-[#125238]">62.4% Moisture</span>
              </div>
              <div className="w-full bg-black/10 rounded-full h-2 mb-2">
                <div className="bg-[#2F6B4F] h-2 rounded-full" style={{ width: '62.4%' }} />
              </div>
              <div className="text-[11px] text-[#6E6E73] space-y-0.5">
                <div>Water Absorption: <strong>18.2 L/hr/m²</strong></div>
                <div>Status: <span className="text-[#34C759] font-medium">Active Capillary Inflow (No Pooling)</span></div>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-[#2F6B4F]/30 bg-[#E8F3EC]/40">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#125238]">Feeder Root Zone (15 cm)</span>
                <span className="text-xs font-bold text-[#125238]">68.0% Moisture</span>
              </div>
              <div className="w-full bg-black/10 rounded-full h-2 mb-2">
                <div className="bg-[#125238] h-2 rounded-full" style={{ width: '68%' }} />
              </div>
              <div className="text-[11px] text-[#6E6E73] space-y-0.5">
                <div>Water Absorption: <strong>12.4 L/hr/m²</strong></div>
                <div>Status: <span className="text-[#125238] font-medium">Peak Root Hydration (Optimal)</span></div>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-black/[0.06] bg-[#FBFBFD]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#1D1D1F]">Deep Horizon (30 cm)</span>
                <span className="text-xs font-bold text-[#125238]">74.0% Moisture</span>
              </div>
              <div className="w-full bg-black/10 rounded-full h-2 mb-2">
                <div className="bg-[#2F6B4F] h-2 rounded-full" style={{ width: '74%' }} />
              </div>
              <div className="text-[11px] text-[#6E6E73] space-y-0.5">
                <div>Water Absorption: <strong>6.8 L/hr/m²</strong></div>
                <div>Status: <span className="text-[#707972] font-medium">Field Capacity Buffer (Safe)</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Real-Time Water Delivery by Parcel Table */}
        <div>
          <span className="text-xs font-semibold text-[#1D1D1F] block mb-3">
            Parcel-Wise Water Delivery & Soil Moisture Gain Telemetry:
          </span>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-black/[0.06] text-[#707972] font-medium">
                  <th className="pb-3 pl-2">Parcel Zone</th>
                  <th className="pb-3">Delivery Architecture</th>
                  <th className="pb-3 text-right">Live Flow</th>
                  <th className="pb-3 text-right">Today's Water</th>
                  <th className="pb-3 text-right">Soil Moisture Delta</th>
                  <th className="pb-3 pr-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04]">
                <tr className="hover:bg-[#F6F3F5]">
                  <td className="py-3 pl-2 font-medium text-[#1D1D1F]">Zone A - South Basin (Rice, 4.5 ac)</td>
                  <td className="py-3 text-[#6E6E73]">Regulated Basin Infiltration</td>
                  <td className="py-3 text-right font-semibold text-[#34C759]">45.0 L/min</td>
                  <td className="py-3 text-right font-medium">580 Liters</td>
                  <td className="py-3 text-right font-bold text-[#2F6B4F]">66% → 72% (+6%)</td>
                  <td className="py-3 pr-2 text-center">
                    <StatusBadge variant="optimal">Active Flowing</StatusBadge>
                  </td>
                </tr>
                <tr className="hover:bg-[#F6F3F5]">
                  <td className="py-3 pl-2 font-medium text-[#1D1D1F]">Zone B - East Terrace (Cotton, 3.8 ac)</td>
                  <td className="py-3 text-[#6E6E73]">Sub-surface Micro Drip</td>
                  <td className="py-3 text-right font-semibold text-[#707972]">0.0 L/min</td>
                  <td className="py-3 text-right font-medium">340 Liters</td>
                  <td className="py-3 text-right font-bold text-[#2F6B4F]">60.5% → 64% (+3.5%)</td>
                  <td className="py-3 pr-2 text-center">
                    <StatusBadge variant="eco">Hydrated</StatusBadge>
                  </td>
                </tr>
                <tr className="hover:bg-[#F6F3F5]">
                  <td className="py-3 pl-2 font-medium text-[#1D1D1F]">Zone C - Polyhouse A (Tomato, 2.2 ac)</td>
                  <td className="py-3 text-[#6E6E73]">Pressure-Compensated Drip Pulsing</td>
                  <td className="py-3 text-right font-semibold text-[#707972]">0.0 L/min</td>
                  <td className="py-3 text-right font-medium">180 Liters</td>
                  <td className="py-3 text-right font-bold text-[#2F6B4F]">64% → 68% (+4%)</td>
                  <td className="py-3 pr-2 text-center">
                    <StatusBadge variant="optimal">Optimal</StatusBadge>
                  </td>
                </tr>
                <tr className="hover:bg-[#F6F3F5]">
                  <td className="py-3 pl-2 font-medium text-[#1D1D1F]">Zone D - Hill Slope (Orange, 2.0 ac)</td>
                  <td className="py-3 text-[#6E6E73]">Micro-Sprinkler Root Ring</td>
                  <td className="py-3 text-right font-semibold text-[#707972]">0.0 L/min</td>
                  <td className="py-3 text-right font-medium">140 Liters</td>
                  <td className="py-3 text-right font-bold text-[#2F6B4F]">62% → 65% (+3%)</td>
                  <td className="py-3 pr-2 text-center">
                    <StatusBadge variant="optimal">Optimal</StatusBadge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Zone Actuators Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-[#1D1D1F]">Solenoid Zone Actuators</h3>
          <span className="text-xs text-[#6E6E73]">{zones.length} Configured Zones</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {zones.map((zone) => (
            <div
              key={zone.id}
              className="bg-white rounded-[28px] p-6 shadow-sm border border-black/[0.04] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      zone.valveState ? 'bg-[#34C759]/10 text-[#34C759]' : 'bg-black/5 text-[#707972]'
                    }`}>
                      <span className="material-symbols-outlined text-[24px]">water_drop</span>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-[#1D1D1F]">{zone.zoneName}</h3>
                      <div className="text-xs text-[#6E6E73]">Flow rate: {zone.flowRateLpm} L/min • Mode: {zone.mode}</div>
                    </div>
                  </div>

                  <StatusBadge variant={zone.valveState ? 'optimal' : 'neutral'}>
                    {zone.valveState ? 'VALVE OPEN' : 'STANDBY'}
                  </StatusBadge>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-[#F6F3F5]">
                    <div className="text-[10px] text-[#6E6E73] uppercase font-semibold">Today's Consumption</div>
                    <div className="text-sm font-medium text-[#1D1D1F] mt-0.5">{zone.waterConsumedToday} L</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F6F3F5]">
                    <div className="text-[10px] text-[#6E6E73] uppercase font-semibold">Moisture Setpoint</div>
                    <div className="text-sm font-medium text-[#1D1D1F] mt-0.5">{zone.moistureThreshold}% Trigger</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#F6F3F5] text-xs text-[#6E6E73] mb-4">
                  <span className="font-medium text-[#1D1D1F]">Schedule: </span>
                  {zone.nextRunTime}
                </div>
              </div>

              <div className="pt-4 border-t border-black/[0.04] flex items-center justify-between">
                <span className="text-xs text-[#6E6E73]">Last cycle: {zone.lastRunDurationMin} mins</span>
                <Button
                  variant={zone.valveState ? 'danger' : 'secondary'}
                  size="sm"
                  onClick={() => handleToggleValve(zone.id, zone.valveState)}
                >
                  {zone.valveState ? 'Close Solenoid' : 'Open Valve Pulse'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IrrigationPage;
