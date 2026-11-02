import React, { useState, useEffect } from 'react';
import { farmService, irrigationService } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import { LoadingState, ErrorState } from '../components/FeedbackStates';

export const FarmMapPage = () => {
  const [parcels, setParcels] = useState([]);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [activeLayer, setActiveLayer] = useState('ndvi'); // ndvi, moisture, irrigation
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadParcels = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await farmService.getParcels();
      setParcels(res);
      if (res.length > 0) setSelectedParcel(res[0]);
    } catch (err) {
      setError(err.message || 'Failed to load parcels.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadParcels();
  }, []);

  const handleToggleIrrigation = async () => {
    if (!selectedParcel) return;
    const newStatus = selectedParcel.irrigationStatus === 'ACTIVE' ? 'STANDBY' : 'ACTIVE';
    try {
      const updated = await farmService.updateParcel(selectedParcel.id, {
        irrigationStatus: newStatus,
      });
      setSelectedParcel(updated);
      setParcels((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <LoadingState message="Loading GIS parcel boundaries..." />;
  if (error) return <ErrorState message={error} onRetry={loadParcels} />;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-header">
        <div>
          <span className="font-label-caps text-[#6E6E73]">GIS Spatial Telemetry</span>
          <h1 className="text-3xl sm:text-4xl font-normal text-[#1D1D1F] tracking-tight mt-1">
            Interactive Farm Map & Parcels
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6E73] mt-1">
            Real-time multispectral NDVI mapping, soil hydrology contours, and zone actuators.
          </p>
        </div>

        {/* Layer Switcher */}
        <div className="flex items-center rounded-full bg-white p-1 shadow-xs border border-black/[0.04]">
          {[
            { id: 'ndvi', label: 'NDVI Biomass', icon: 'filter_vintage' },
            { id: 'moisture', label: 'Soil Hydrology', icon: 'water_ph' },
            { id: 'irrigation', label: 'Valves & Actuators', icon: 'precision_manufacturing' },
          ].map((l) => (
            <button
              key={l.id}
              onClick={() => setActiveLayer(l.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeLayer === l.id
                  ? 'bg-[#E8F3EC] text-[#2F6B4F] shadow-xs'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{l.icon}</span>
              <span>{l.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Map & Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive SVG GIS Farm Map Canvas (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-[28px] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_20px_40px_-15px_rgba(0,0,0,0.03)] border border-black/[0.04] flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-black/[0.04]">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs text-[#1D1D1F]">12.5 Acres Boundary</span>
              <span className="text-xs text-[#6E6E73]">• 4 Managed Parcels</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="inline-block w-2.5 h-2.5 rounded-sm bg-[#2F6B4F]" />
              <span className="text-[#6E6E73]">High Vigour (&gt;0.75)</span>
              <span className="inline-block w-2.5 h-2.5 rounded-sm bg-[#FF9F0A] ml-2" />
              <span className="text-[#6E6E73]">Moderate (0.60-0.75)</span>
            </div>
          </div>

          {/* SVG Map Container */}
          <div className="relative w-full h-[420px] bg-[#F6F3F5] rounded-2xl overflow-hidden flex items-center justify-center p-4">
            <svg
              viewBox="0 0 800 500"
              className="w-full h-full select-none"
              style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.04))' }}
            >
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="800" height="500" fill="url(#grid)" />

              {/* Zone A: North Paddy */}
              <g
                onClick={() => setSelectedParcel(parcels[0])}
                className="cursor-pointer group"
              >
                <polygon
                  points="60,40 380,40 360,230 40,220"
                  fill={activeLayer === 'moisture' ? '#C2E5D3' : '#96D4B2'}
                  stroke={selectedParcel?.id === parcels[0]?.id ? '#125238' : '#2F6B4F'}
                  strokeWidth={selectedParcel?.id === parcels[0]?.id ? '4' : '2'}
                  className="transition-all duration-200 group-hover:opacity-90"
                />
                <text x="180" y="130" fill="#125238" fontWeight="600" fontSize="16" textAnchor="middle">
                  Zone A: North Paddy
                </text>
                <text x="180" y="152" fill="#214F3A" fontSize="12" textAnchor="middle">
                  Rice (Sona Masoori) • 4.2 ac
                </text>
                {parcels[0]?.irrigationStatus === 'ACTIVE' && (
                  <circle cx="340" cy="65" r="7" fill="#34C759" className="animate-ping" />
                )}
              </g>

              {/* Zone B: Cotton Basin */}
              <g
                onClick={() => setSelectedParcel(parcels[1])}
                className="cursor-pointer group"
              >
                <polygon
                  points="400,40 740,40 760,240 380,240"
                  fill={activeLayer === 'moisture' ? '#BCEED1' : '#B1F0CD'}
                  stroke={selectedParcel?.id === parcels[1]?.id ? '#125238' : '#3A6751'}
                  strokeWidth={selectedParcel?.id === parcels[1]?.id ? '4' : '2'}
                  className="transition-all duration-200 group-hover:opacity-90"
                />
                <text x="560" y="130" fill="#105137" fontWeight="600" fontSize="16" textAnchor="middle">
                  Zone B: Cotton Basin
                </text>
                <text x="560" y="152" fill="#214F3A" fontSize="12" textAnchor="middle">
                  Bt-Cotton • 3.8 ac
                </text>
              </g>

              {/* Zone C: Tomato Polyhouse */}
              <g
                onClick={() => setSelectedParcel(parcels[2])}
                className="cursor-pointer group"
              >
                <polygon
                  points="40,240 360,250 340,460 50,450"
                  fill={activeLayer === 'moisture' ? '#DAE5DE' : '#A1D1B6'}
                  stroke={selectedParcel?.id === parcels[2]?.id ? '#125238' : '#2F6B4F'}
                  strokeWidth={selectedParcel?.id === parcels[2]?.id ? '4' : '2'}
                  className="transition-all duration-200 group-hover:opacity-90"
                />
                <text x="180" y="340" fill="#125238" fontWeight="600" fontSize="16" textAnchor="middle">
                  Zone C: Polyhouse
                </text>
                <text x="180" y="362" fill="#214F3A" fontSize="12" textAnchor="middle">
                  Tomato (Arka Rakshak) • 2.5 ac
                </text>
              </g>

              {/* Zone D: Orchard Belt */}
              <g
                onClick={() => setSelectedParcel(parcels[3])}
                className="cursor-pointer group"
              >
                <polygon
                  points="380,260 760,260 740,460 360,460"
                  fill={activeLayer === 'moisture' ? '#E8F3EC' : '#BEC9C3'}
                  stroke={selectedParcel?.id === parcels[3]?.id ? '#125238' : '#707972'}
                  strokeWidth={selectedParcel?.id === parcels[3]?.id ? '4' : '2'}
                  className="transition-all duration-200 group-hover:opacity-90"
                />
                <text x="550" y="340" fill="#141E1A" fontWeight="600" fontSize="16" textAnchor="middle">
                  Zone D: Orchard Belt
                </text>
                <text x="550" y="362" fill="#404943" fontSize="12" textAnchor="middle">
                  Sweet Orange • 2.0 ac
                </text>
              </g>
            </svg>
          </div>

          <div className="pt-4 flex items-center justify-between text-xs text-[#6E6E73]">
            <span>Click any polygon on map to inspect live parcel telemetry</span>
            <span>Drone Survey Coordinates: 17.3850° N, 78.4867° E</span>
          </div>
        </div>

        {/* Selected Parcel Telemetry Drawer (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-[28px] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_20px_40px_-15px_rgba(0,0,0,0.03)] border border-black/[0.04] flex flex-col justify-between">
          {selectedParcel ? (
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-black/[0.04]">
                <div>
                  <span className="font-semibold text-xs text-[#2F6B4F]">{selectedParcel.code}</span>
                  <h3 className="text-xl font-medium text-[#1D1D1F] mt-0.5">{selectedParcel.name}</h3>
                </div>
                <StatusBadge
                  variant={selectedParcel.irrigationStatus === 'ACTIVE' ? 'optimal' : 'eco'}
                >
                  {selectedParcel.irrigationStatus}
                </StatusBadge>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#F6F3F5] flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-[#6E6E73] uppercase font-semibold">Active Variety</span>
                    <div className="text-sm font-medium text-[#1D1D1F]">{selectedParcel.cropName}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#6E6E73] uppercase font-semibold">Area</span>
                    <div className="text-sm font-medium text-[#1D1D1F]">{selectedParcel.acreage} ac</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-[#F6F3F5]">
                    <span className="text-[10px] text-[#6E6E73] uppercase font-semibold">Soil Moisture</span>
                    <div className="font-metric-num text-2xl text-[#1D1D1F] my-1">{selectedParcel.soilMoisture}%</div>
                    <span className="text-[11px] text-[#2F6B4F]">Calibrated Target 65%</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#F6F3F5]">
                    <span className="text-[10px] text-[#6E6E73] uppercase font-semibold">Soil pH</span>
                    <div className="font-metric-num text-2xl text-[#1D1D1F] my-1">{selectedParcel.soilPh}</div>
                    <span className="text-[11px] text-[#34C759]">Optimal Balance</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#F6F3F5]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-[#1D1D1F]">Phenology Stage</span>
                    <span className="text-xs text-[#2F6B4F] font-semibold">{selectedParcel.cropStage}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-black/5 overflow-hidden">
                    <div className="h-full bg-[#2F6B4F] rounded-full" style={{ width: '65%' }} />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#F6F3F5]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-[#1D1D1F]">NDVI Biomass Density</span>
                    <span className="font-semibold text-xs text-[#2F6B4F]">{selectedParcel.ndviIndex}</span>
                  </div>
                  <p className="text-[11px] text-[#6E6E73]">
                    Multispectral reflectance confirms uniform chlorophyll activity across canopy foliage.
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-black/[0.04] mt-6">
                <Button
                  variant={selectedParcel.irrigationStatus === 'ACTIVE' ? 'danger' : 'primary'}
                  size="lg"
                  className="w-full"
                  icon="water_drop"
                  onClick={handleToggleIrrigation}
                >
                  {selectedParcel.irrigationStatus === 'ACTIVE' ? 'Pause Valve Actuation' : 'Trigger Zone Pulse Irrigation'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-xs text-[#6E6E73]">Select a parcel from the map</div>
          )}
        </div>
      </div>

      {/* Comprehensive Area of Farming & Land Demarcation Analytics Section */}
      <section className="bg-white rounded-[28px] p-6 shadow-sm border border-black/[0.04] flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-black/[0.04] gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#125238] text-[20px]">crop_free</span>
              <span className="font-label-caps text-[#6E6E73]">Acreage & Spatial Demarcation</span>
            </div>
            <h3 className="text-xl font-normal text-[#1D1D1F] tracking-tight mt-0.5">
              Area of Farming & Land Utilization
            </h3>
            <p className="text-xs text-[#6E6E73]">
              Cadastral boundary measurements, crop-wise acreage distribution, and land unit conversions.
            </p>
          </div>

          <StatusBadge variant="eco" icon="verified">
            100% GIS Ground Truth Surveyed
          </StatusBadge>
        </div>

        {/* 4 Land Area KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#F6F3F5] flex flex-col justify-between">
            <span className="text-[10px] text-[#6E6E73] uppercase font-semibold">Total Estate Area</span>
            <div className="font-metric-num text-3xl font-bold text-[#1D1D1F] my-1">
              12.5 <span className="text-sm font-normal text-[#6E6E73]">Acres</span>
            </div>
            <div className="text-[11px] text-[#2F6B4F] font-medium">5.06 Hectares • 500 Gunthas</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F6F3F5] flex flex-col justify-between">
            <span className="text-[10px] text-[#6E6E73] uppercase font-semibold">Active Cultivated Land</span>
            <div className="font-metric-num text-3xl font-bold text-[#1D1D1F] my-1">
              12.0 <span className="text-sm font-normal text-[#6E6E73]">Acres</span>
            </div>
            <div className="text-[11px] text-[#34C759] font-medium">96.0% Land Utilization Efficiency</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F6F3F5] flex flex-col justify-between">
            <span className="text-[10px] text-[#6E6E73] uppercase font-semibold">Infrastructure & Field Bunds</span>
            <div className="font-metric-num text-3xl font-bold text-[#1D1D1F] my-1">
              0.5 <span className="text-sm font-normal text-[#6E6E73]">Acres</span>
            </div>
            <div className="text-[11px] text-[#707972]">Pump houses, solar farm, farm tracks</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F6F3F5] flex flex-col justify-between">
            <span className="text-[10px] text-[#6E6E73] uppercase font-semibold">Tenure & Ownership</span>
            <div className="font-metric-num text-2xl font-bold text-[#1D1D1F] my-1">
              Freehold
            </div>
            <div className="text-[11px] text-[#125238] font-medium">12.0 ac Owned + 0.5 ac Leased</div>
          </div>
        </div>

        {/* Acreage Breakdown by Parcel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Parcel Area Table */}
          <div className="p-5 rounded-2xl bg-[#FBFBFD] border border-black/[0.06]">
            <span className="text-xs font-semibold text-[#1D1D1F] block mb-3">
              Parcel Demarcation & Crop Allocation:
            </span>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-white border border-black/[0.04]">
                <div>
                  <div className="font-medium text-[#1D1D1F]">Zone A: North Paddy Basin</div>
                  <div className="text-[11px] text-[#6E6E73]">Crop: Sona Masoori Rice • Clay Loam</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[#1D1D1F]">4.5 Acres</div>
                  <div className="text-[10px] text-[#2F6B4F]">36.0% of Estate</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-white border border-black/[0.04]">
                <div>
                  <div className="font-medium text-[#1D1D1F]">Zone B: East Terrace Basin</div>
                  <div className="text-[11px] text-[#6E6E73]">Crop: Bt-Cotton • Black Cotton Soil</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[#1D1D1F]">3.8 Acres</div>
                  <div className="text-[10px] text-[#2F6B4F]">30.4% of Estate</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-white border border-black/[0.04]">
                <div>
                  <div className="font-medium text-[#1D1D1F]">Zone C: Greenhouse / Polyhouse A</div>
                  <div className="text-[11px] text-[#6E6E73]">Crop: Hybrid Tomato • Sandy Loam</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[#1D1D1F]">2.2 Acres</div>
                  <div className="text-[10px] text-[#2F6B4F]">17.6% of Estate</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-white border border-black/[0.04]">
                <div>
                  <div className="font-medium text-[#1D1D1F]">Zone D: Hill Slope Orchard</div>
                  <div className="text-[11px] text-[#6E6E73]">Crop: Nagpur Mandarin • Red Loam</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[#1D1D1F]">2.0 Acres</div>
                  <div className="text-[10px] text-[#2F6B4F]">16.0% of Estate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Land Measurement & Area Unit Converter Tool */}
          <div className="p-5 rounded-2xl bg-[#E8F3EC]/50 border border-[#2F6B4F]/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#125238] mb-1">
                <span className="material-symbols-outlined text-[18px]">straighten</span>
                Agricultural Land Measurement Converter
              </div>
              <p className="text-xs text-[#6E6E73] mb-4">
                Instant conversion between regional Indian land measurement units and global metrics.
              </p>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2 rounded-xl bg-white border border-black/[0.04]">
                  <span className="text-[#6E6E73]">Acres (Standard):</span>
                  <span className="font-bold text-[#1D1D1F]">12.50 Acres</span>
                </div>
                <div className="flex justify-between p-2 rounded-xl bg-white border border-black/[0.04]">
                  <span className="text-[#6E6E73]">Hectares (Metric):</span>
                  <span className="font-bold text-[#1D1D1F]">5.06 Hectares</span>
                </div>
                <div className="flex justify-between p-2 rounded-xl bg-white border border-black/[0.04]">
                  <span className="text-[#6E6E73]">Gunthas (Telangana / Maharashtra):</span>
                  <span className="font-bold text-[#1D1D1F]">500 Gunthas (40 Gunthas = 1 Ac)</span>
                </div>
                <div className="flex justify-between p-2 rounded-xl bg-white border border-black/[0.04]">
                  <span className="text-[#6E6E73]">Bighas (North India):</span>
                  <span className="font-bold text-[#1D1D1F]">20.00 Pucca Bighas</span>
                </div>
                <div className="flex justify-between p-2 rounded-xl bg-white border border-black/[0.04]">
                  <span className="text-[#6E6E73]">Square Meters (m²):</span>
                  <span className="font-bold text-[#1D1D1F]">50,585.7 m²</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#2F6B4F]/20 text-[11px] text-[#2F6B4F] font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">info</span>
              All parcel GPS polygon vertices are locked to cadastral survey coordinates.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FarmMapPage;
