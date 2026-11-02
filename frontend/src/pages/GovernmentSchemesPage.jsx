import React, { useState, useEffect } from 'react';
import { governmentSchemeService } from '../services/api';
import { mockGovSchemes } from '../services/mockData';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import { LoadingState, ErrorState } from '../components/FeedbackStates';

export const GovernmentSchemesPage = () => {
  const [schemes, setSchemes] = useState(mockGovSchemes || []);
  const [selectedScheme, setSelectedScheme] = useState(mockGovSchemes?.[0] || null);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Farmer Eligibility Checker states
  const [holdingAcres, setHoldingAcres] = useState(12.5);
  const [farmerCategory, setFarmerCategory] = useState('General'); // Small/Marginal (<5ac), General (>5ac), SC/ST/Women
  const [appliedCategory, setAppliedCategory] = useState('All');

  const loadSchemes = async () => {
    try {
      const res = await governmentSchemeService.getAllSchemes();
      if (res && res.length > 0) {
        setSchemes(res);
        setSelectedScheme((prev) => prev || res[0]);
      }
    } catch {
      // Gracefully retain pre-populated government schemes dataset
    }
  };

  useEffect(() => {
    loadSchemes();
  }, []);

  const categories = [
    'ALL',
    'Direct Income Support',
    'Crop Insurance & Risk Mitigation',
    'Irrigation & Water Conservation',
    'Farm Machinery & Drones',
    'Concessional Agricultural Credit',
    'Solar Energy & Pumping',
    'Organic Farming & Certification',
    'Soil Testing & Nutrient Prescriptions',
  ];

  const filteredSchemes = schemes.filter((s) => {
    const matchesCat = categoryFilter === 'ALL' || s.category === categoryFilter;
    const matchesQuery =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.benefitSummary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  // Calculate estimated total subsidy potential for user's estate
  const isSmallMarginal = holdingAcres <= 5.0 || farmerCategory === 'Small/Marginal';
  const estimatedDripSubsidy = Math.round(holdingAcres * (isSmallMarginal ? 55000 : 42000));
  const estimatedSolarSubsidy = 180000;
  const pmKisanAnnual = 6000;


  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-header">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#34C759] animate-pulse" />
            <span className="font-label-caps text-[#6E6E73]">Central & State Government Portals</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-normal text-[#1D1D1F] tracking-tight">
            Government Agricultural Schemes & Subsidies
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6E73] mt-1">
            Direct income support, subsidized solar pumps, drip irrigation grants, crop insurance, and mechanization schemes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge variant="eco" icon="account_balance">
            Direct DBT Active
          </StatusBadge>
        </div>
      </section>

      {/* Estate Subsidy Eligibility Assessment Banner */}
      <div className="bg-gradient-to-br from-[#E8F3EC]/90 to-white rounded-[28px] p-6 shadow-sm border border-[#2F6B4F]/20">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#125238] uppercase tracking-wider mb-1">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              Personalized Subsidy & Eligibility Calculator
            </div>
            <h2 className="text-xl font-normal text-[#1D1D1F] tracking-tight">
              Estimated Subsidy Potential for Your Estate
            </h2>
            <p className="text-xs text-[#6E6E73] mt-1">
              Based on your <strong>{holdingAcres} Acres</strong> landholding profile in Telangana.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
              <div>
                <label className="block text-[11px] font-medium text-[#1D1D1F] mb-1">Landholding (Acres)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="100"
                  value={holdingAcres}
                  onChange={(e) => setHoldingAcres(Number(e.target.value))}
                  className="w-full h-8 px-2 rounded-xl bg-white text-xs border border-black/[0.08] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#1D1D1F] mb-1">Farmer Category</label>
                <select
                  value={farmerCategory}
                  onChange={(e) => setFarmerCategory(e.target.value)}
                  className="w-full h-8 px-2 rounded-xl bg-white text-xs border border-black/[0.08] focus:outline-none"
                >
                  <option value="General">General Farmer (&gt;5 ac)</option>
                  <option value="Small/Marginal">Small & Marginal (&lt;5 ac)</option>
                  <option value="SC/ST/Women">SC / ST / Women Farmer</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#1D1D1F] mb-1">Primary Crop</label>
                <select className="w-full h-8 px-2 rounded-xl bg-white text-xs border border-black/[0.08] focus:outline-none">
                  <option>Paddy & Cotton Mix</option>
                  <option>Horticulture / Orchards</option>
                  <option>Vegetables & Pulses</option>
                </select>
              </div>
            </div>
          </div>

          {/* Subsidy Highlight Box */}
          <div className="w-full lg:w-80 bg-white rounded-2xl p-4 shadow-sm border border-black/[0.06] space-y-2">
            <span className="text-[10px] uppercase font-bold text-[#6E6E73] block">Potential Direct Benefits</span>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#6E6E73]">PM-KISAN Direct Transfer:</span>
              <span className="font-semibold text-[#1D1D1F]">₹{pmKisanAnnual.toLocaleString()}/yr</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#6E6E73]">PMKSY Drip Subsidy ({isSmallMarginal ? '55%' : '45%'}):</span>
              <span className="font-semibold text-[#2F6B4F]">₹{estimatedDripSubsidy.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#6E6E73]">PM-KUSUM Solar Pump (60%):</span>
              <span className="font-semibold text-[#2F6B4F]">₹{estimatedSolarSubsidy.toLocaleString()}</span>
            </div>
            <div className="pt-2 border-t border-black/[0.04] flex justify-between items-center">
              <span className="text-xs font-bold text-[#1D1D1F]">Total Grant Potential:</span>
              <span className="text-base font-bold text-[#125238]">
                ₹{(pmKisanAnnual + estimatedDripSubsidy + estimatedSolarSubsidy).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="bg-white rounded-[24px] p-4 shadow-sm border border-black/[0.04] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-[#125238] text-white shadow-xs'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              {cat}
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
            placeholder="Search scheme name or benefit..."
            className="w-full h-9 pl-9 pr-3 rounded-full bg-[#F6F3F5] text-xs text-[#1D1D1F] border border-black/[0.04] focus:outline-none focus:bg-white"
          />
        </div>
      </div>

      {/* Main Grid: Schemes List (8 cols) + Selected Scheme Details (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Scheme Cards */}
        <div className="lg:col-span-8 space-y-4">
          {filteredSchemes.map((scheme) => (
            <div
              key={scheme.id}
              onClick={() => setSelectedScheme(scheme)}
              className={`p-5 rounded-[24px] border cursor-pointer transition-all flex flex-col justify-between ${
                selectedScheme?.id === scheme.id
                  ? 'bg-white border-[#2F6B4F] shadow-md ring-2 ring-[#2F6B4F]/10'
                  : 'bg-white border-black/[0.04] hover:shadow-sm hover:border-black/[0.1]'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#6E6E73]">{scheme.ministry}</span>
                  <h3 className="text-base font-semibold text-[#1D1D1F] mt-0.5">{scheme.title}</h3>
                </div>
                <StatusBadge variant="eco">{scheme.subsidyPercent}</StatusBadge>
              </div>

              <p className="text-xs text-[#1D1D1F] leading-relaxed mb-3">
                {scheme.benefitSummary}
              </p>

              <div className="p-3 rounded-xl bg-[#F6F3F5] text-xs text-[#6E6E73] mb-3">
                <span className="font-semibold text-[#1D1D1F]">Eligibility: </span>
                {scheme.eligibility}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-black/[0.04] text-xs">
                <span className="text-[#6E6E73]">Assistance: <strong className="text-[#2F6B4F]">{scheme.financialAssistance}</strong></span>
                <span className="text-[#125238] font-medium flex items-center gap-1 hover:underline">
                  View Guidelines & Apply →
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Selected Scheme Deep Profile & Documents Checklist */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {selectedScheme && (
            <div className="bg-white rounded-[28px] p-6 shadow-sm border border-black/[0.04]">
              <div className="flex items-start justify-between pb-3 mb-3 border-b border-black/[0.04]">
                <div>
                  <span className="font-label-caps text-[#6E6E73]">{selectedScheme.category}</span>
                  <h3 className="text-lg font-medium text-[#1D1D1F] mt-0.5">{selectedScheme.title}</h3>
                  <div className="text-[11px] text-[#707972] mt-0.5">{selectedScheme.ministry}</div>
                </div>
                <StatusBadge variant="optimal">Open for Enrollment</StatusBadge>
              </div>

              {/* Financial Highlight */}
              <div className="p-4 rounded-2xl bg-[#E8F3EC]/70 border border-[#2F6B4F]/20 mb-4">
                <span className="text-[10px] uppercase font-bold text-[#125238] block mb-1">
                  Financial Assistance & Subsidy
                </span>
                <div className="text-lg font-bold text-[#1D1D1F]">{selectedScheme.financialAssistance}</div>
                <div className="text-xs text-[#2F6B4F] font-medium mt-0.5">{selectedScheme.subsidyPercent}</div>
              </div>

              {/* Key Features */}
              <div className="mb-4">
                <span className="text-[11px] font-semibold text-[#1D1D1F] block mb-2">Key Scheme Features:</span>
                <ul className="space-y-1.5 text-xs text-[#1D1D1F]">
                  {selectedScheme.keyFeatures.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[16px] text-[#2F6B4F] mt-0.5">check_circle</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Required Documents Checklist */}
              <div className="p-4 rounded-2xl bg-[#F6F3F5] mb-4">
                <span className="text-[11px] font-semibold text-[#1D1D1F] uppercase block mb-2">
                  Mandatory Application Documents
                </span>
                <ul className="space-y-1.5 text-xs text-[#1D1D1F]">
                  {selectedScheme.documentsRequired.map((doc, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-[#707972]">description</span>
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Direct Portal Link */}
              <a
                href={selectedScheme.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#125238] text-white text-xs font-semibold hover:bg-[#0E3E2B] transition-colors shadow-xs"
              >
                <span>Apply on Official Portal</span>
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GovernmentSchemesPage;
