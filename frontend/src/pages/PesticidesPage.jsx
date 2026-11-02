import React, { useState, useEffect } from 'react';
import { pesticideService } from '../services/api';
import { mockPesticides } from '../services/mockData';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import { LoadingState, ErrorState } from '../components/FeedbackStates';

export const PesticidesPage = () => {
  const [pesticides, setPesticides] = useState(mockPesticides || []);
  const [selectedPesticide, setSelectedPesticide] = useState(mockPesticides?.[0] || null);
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Smart Dosage Calculator states
  const [calcAcreage, setCalcAcreage] = useState(4.5);
  const [selectedDosagePesticideId, setSelectedDosagePesticideId] = useState(mockPesticides?.[0]?.id || 1);
  const [tankCapacityLiters, setTankCapacityLiters] = useState(15);

  const loadPesticides = async () => {
    try {
      const res = await pesticideService.getAllPesticides();
      if (res && res.length > 0) {
        setPesticides(res);
        setSelectedPesticide((prev) => prev || res[0]);
      }
    } catch {
      // Gracefully retain pre-populated pesticides dataset
    }
  };

  useEffect(() => {
    loadPesticides();
  }, []);

  const types = [
    { id: 'ALL', label: 'All Protections' },
    { id: 'BIO_PESTICIDE', label: 'Bio-Pesticides (Eco)' },
    { id: 'CHEMICAL_INSECTICIDE', label: 'Insecticides' },
    { id: 'CHEMICAL_FUNGICIDE', label: 'Fungicides' },
    { id: 'HERBICIDE', label: 'Herbicides & Weedicides' },
  ];

  const filteredPesticides = pesticides.filter((p) => {
    const matchesType = typeFilter === 'ALL' || p.type === typeFilter;
    const matchesQuery =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.targetPests.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.targetCrops.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesQuery;
  });

  // Calculate spray tank requirements
  const activeCalcPesticide =
    pesticides.find((p) => p.id === Number(selectedDosagePesticideId)) || pesticides[0];

  // Estimation: standard 175 Liters of spray water per acre
  const totalSprayWaterLiters = Math.round(calcAcreage * 175);
  const totalSprayTanks = Math.ceil(totalSprayWaterLiters / tankCapacityLiters);

  // Parse dosage
  let dosageEstimateDisplay = 'Follow container label';
  if (activeCalcPesticide?.dosagePerLiter) {
    dosageEstimateDisplay = `${activeCalcPesticide.dosagePerLiter} per Liter of water`;
  }

  const getToxicityBandBadge = (band, label) => {
    if (band === 'GREEN') return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#E8F3EC] text-[#2F6B4F]">🟢 {label}</span>;
    if (band === 'BLUE') return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EBF4FF] text-[#0066CC]">🔵 {label}</span>;
    if (band === 'YELLOW') return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FFF8E6] text-[#B78103]">🟡 {label}</span>;
    return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FFDAD6] text-[#BA1A1A]">🔴 {label}</span>;
  };


  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-header">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#34C759] animate-pulse" />
            <span className="font-label-caps text-[#6E6E73]">CIBRC Compliant Protection</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-normal text-[#1D1D1F] tracking-tight">
            Pesticides & Crop Protection Guide
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6E73] mt-1">
            Certified bio-rational & chemical crop protection directory, precise tank dosage calculator, and safety intervals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge variant="eco" icon="verified_user">
            CIBRC Regulatory Verified
          </StatusBadge>
        </div>
      </section>

      {/* Spray Weather Window Notification Bar */}
      <div className="bg-white rounded-[24px] p-5 shadow-sm border border-black/[0.04] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#E8F3EC] flex items-center justify-center text-[#2F6B4F]">
            <span className="material-symbols-outlined text-[22px]">air</span>
          </div>
          <div>
            <div className="text-xs font-semibold text-[#1D1D1F]">Favorable Spray Window Forecast</div>
            <div className="text-[11px] text-[#6E6E73]">
              Wind velocity: 8.5 km/h (&lt;12 km/h safe) • Temp: 28°C • Rain risk: 10%
            </div>
          </div>
        </div>
        <StatusBadge variant="optimal" icon="check_circle">
          Optimal Spraying Conditions
        </StatusBadge>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-[24px] p-4 shadow-sm border border-black/[0.04] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {types.map((t) => (
            <button
              key={t.id}
              onClick={() => setTypeFilter(t.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                typeFilter === t.id
                  ? 'bg-[#125238] text-white shadow-xs'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#707972] text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chemical, pest, crop..."
            className="w-full h-9 pl-9 pr-3 rounded-full bg-[#F6F3F5] text-xs text-[#1D1D1F] border border-black/[0.04] focus:outline-none focus:bg-white"
          />
        </div>
      </div>

      {/* Main Grid: Directory List (8 cols) + Calculator & Safety Details (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Pesticide Cards Grid */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPesticides.map((pest) => (
            <div
              key={pest.id}
              onClick={() => {
                setSelectedPesticide(pest);
                setSelectedDosagePesticideId(pest.id);
              }}
              className={`p-5 rounded-[24px] border cursor-pointer transition-all flex flex-col justify-between ${
                selectedPesticide?.id === pest.id
                  ? 'bg-white border-[#2F6B4F] shadow-md ring-2 ring-[#2F6B4F]/10'
                  : 'bg-white border-black/[0.04] hover:shadow-sm hover:border-black/[0.1]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold text-[#6E6E73]">{pest.category}</span>
                  {getToxicityBandBadge(pest.toxicityBand, pest.toxicityBand)}
                </div>

                <h3 className="text-base font-semibold text-[#1D1D1F]">{pest.name}</h3>

                <div className="mt-3 space-y-1 text-xs">
                  <div>
                    <span className="text-[#6E6E73]">Target Pests: </span>
                    <span className="text-[#1D1D1F] font-medium">{pest.targetPests}</span>
                  </div>
                  <div>
                    <span className="text-[#6E6E73]">Compatible Crops: </span>
                    <span className="text-[#125238] font-medium">{pest.targetCrops}</span>
                  </div>
                </div>
              </div>

              {/* Dosage & PHI Footer */}
              <div className="mt-4 pt-3 border-t border-black/[0.04] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-[#6E6E73] block">Dosage / Acre</span>
                  <span className="font-semibold text-[#1D1D1F]">{pest.dosagePerAcre}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#6E6E73] block">Pre-Harvest Interval (PHI)</span>
                  <span className="font-semibold text-[#2F6B4F]">{pest.phiDays} Days</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Interactive Dosage Calculator & Safety Protocol */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Smart Dosage Calculator Card */}
          <div className="bg-white rounded-[28px] p-6 shadow-sm border border-black/[0.04]">
            <div className="pb-3 mb-4 border-b border-black/[0.04]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#125238] text-[20px]">calculate</span>
                <h3 className="text-base font-semibold text-[#1D1D1F]">Pesticide Dosage & Tank Calculator</h3>
              </div>
              <p className="text-xs text-[#6E6E73] mt-0.5">
                Calculate exact chemical grams/ml and knapsack spray tank counts.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#1D1D1F] mb-1">Crop Protection Formulation</label>
                <select
                  value={selectedDosagePesticideId}
                  onChange={(e) => setSelectedDosagePesticideId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#F6F3F5] text-xs text-[#1D1D1F] border border-black/[0.06] focus:outline-none"
                >
                  {pesticides.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <label className="font-medium text-[#1D1D1F]">Treatment Area (Acres)</label>
                  <span className="text-[#2F6B4F] font-semibold">{calcAcreage} Acres</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="20"
                  step="0.5"
                  value={calcAcreage}
                  onChange={(e) => setCalcAcreage(Number(e.target.value))}
                  className="w-full accent-[#2F6B4F] cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1D1D1F] mb-1">Knapsack Sprayer Tank Capacity</label>
                <div className="grid grid-cols-3 gap-2">
                  {[12, 15, 20].map((liters) => (
                    <button
                      key={liters}
                      type="button"
                      onClick={() => setTankCapacityLiters(liters)}
                      className={`py-1.5 rounded-xl text-xs font-medium transition-all ${
                        tankCapacityLiters === liters
                          ? 'bg-[#125238] text-white shadow-xs'
                          : 'bg-[#F6F3F5] text-[#1D1D1F]'
                      }`}
                    >
                      {liters} Liters
                    </button>
                  ))}
                </div>
              </div>

              {/* Calculated Outputs */}
              <div className="p-4 rounded-2xl bg-[#E8F3EC]/70 border border-[#2F6B4F]/20 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#6E6E73]">Total Spray Water Required:</span>
                  <span className="text-sm font-bold text-[#1D1D1F]">{totalSprayWaterLiters} Liters</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#6E6E73]">Total Sprayer Tanks ({tankCapacityLiters}L each):</span>
                  <span className="text-sm font-bold text-[#125238]">{totalSprayTanks} Tanks</span>
                </div>
                <div className="flex justify-between items-center text-xs pt-1 border-t border-black/[0.04]">
                  <span className="text-[#6E6E73]">Recommended Concentration:</span>
                  <span className="text-xs font-semibold text-[#1D1D1F]">{dosageEstimateDisplay}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Active Pesticide Safety & PHI Profile */}
          {selectedPesticide && (
            <div className="bg-white rounded-[28px] p-6 shadow-sm border border-black/[0.04]">
              <div className="flex items-start justify-between pb-3 mb-3 border-b border-black/[0.04]">
                <div>
                  <span className="font-label-caps text-[#6E6E73]">Safety Protocols</span>
                  <h3 className="text-lg font-medium text-[#1D1D1F] mt-0.5">{selectedPesticide.name}</h3>
                </div>
                {getToxicityBandBadge(selectedPesticide.toxicityBand, selectedPesticide.toxicityLabel)}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-xl bg-[#F6F3F5]">
                  <span className="text-[10px] text-[#6E6E73] block uppercase font-semibold">Pre-Harvest (PHI)</span>
                  <span className="text-base font-bold text-[#1D1D1F] mt-0.5">{selectedPesticide.phiDays} Days</span>
                  <span className="text-[10px] text-[#707972] block">Safe waiting period</span>
                </div>

                <div className="p-3 rounded-xl bg-[#F6F3F5]">
                  <span className="text-[10px] text-[#6E6E73] block uppercase font-semibold">Re-Entry Interval</span>
                  <span className="text-base font-bold text-[#1D1D1F] mt-0.5">{selectedPesticide.reiHours} Hours</span>
                  <span className="text-[10px] text-[#707972] block">Worker field clearance</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F6F3F5] text-xs text-[#1D1D1F] space-y-1 mb-4">
                <div className="font-semibold text-[#125238]">Application Protocol:</div>
                <div className="text-[#6E6E73] leading-relaxed">{selectedPesticide.applicationMethod}</div>
              </div>

              <div className="p-3 rounded-xl bg-[#FFDAD6]/30 border border-[#BA1A1A]/20 text-xs text-[#1D1D1F]">
                <div className="font-semibold text-[#BA1A1A] mb-1">Safety & PPE Requirement:</div>
                <div className="text-[11px] text-[#6E6E73] leading-relaxed">{selectedPesticide.safetyNotes}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PesticidesPage;
