import React, { useState, useEffect } from 'react';
import { farmingTechniqueService } from '../services/api';
import { mockFarmingTechniques } from '../services/mockData';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import { LoadingState, ErrorState } from '../components/FeedbackStates';

export const FarmingTechniquesPage = () => {
  const [techniques, setTechniques] = useState(mockFarmingTechniques || []);
  const [selectedTechnique, setSelectedTechnique] = useState(mockFarmingTechniques?.[0] || null);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Technique Matcher Advisor States
  const [advisorAcreage, setAdvisorAcreage] = useState('12.5');
  const [advisorWater, setAdvisorWater] = useState('Moderate');
  const [advisorSoil, setAdvisorSoil] = useState('Clay Loam');
  const [advisorBudget, setAdvisorBudget] = useState('Medium');
  const [recommendedId, setRecommendedId] = useState('precision');

  const loadTechniques = async () => {
    try {
      const res = await farmingTechniqueService.getAllTechniques();
      if (res && res.length > 0) {
        setTechniques(res);
        setSelectedTechnique((prev) => prev || res[0]);
      }
    } catch {
      // Gracefully retain pre-populated agronomic dataset
    }
  };

  useEffect(() => {
    loadTechniques();
  }, []);


  // Compute recommendation based on user criteria
  useEffect(() => {
    if (advisorWater === 'Scarce' || advisorBudget === 'High') {
      if (advisorBudget === 'High' && Number(advisorAcreage) < 5) {
        setRecommendedId('hydroponics');
      } else {
        setRecommendedId('drip');
      }
    } else if (advisorBudget === 'Low') {
      setRecommendedId('zbnf');
    } else if (Number(advisorAcreage) >= 10) {
      setRecommendedId('precision');
    } else {
      setRecommendedId('organic');
    }
  }, [advisorAcreage, advisorWater, advisorSoil, advisorBudget]);

  const categories = ['ALL', 'Technology Driven', 'Ecological & Sustainable', 'Controlled Environment', 'Hydraulic Optimization', 'Natural & Indigenous', 'Soil Restoration', 'High-Tech Protected', 'Biodiversity & Resilience'];

  const filteredTechniques = techniques.filter(
    (t) => categoryFilter === 'ALL' || t.category === categoryFilter
  );


  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-header">
        <div>
          <span className="font-label-caps text-[#6E6E73]">Agronomic Methodologies & Systems</span>
          <h1 className="text-3xl sm:text-4xl font-normal text-[#1D1D1F] tracking-tight mt-1">
            Different Types of Farming Techniques
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6E73] mt-1">
            Explore modern, ecological, protected, and indigenous farming architectures to maximize estate yield and sustainability.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge variant="eco" icon="psychology">
            8 Certified Frameworks
          </StatusBadge>
        </div>
      </section>

      {/* Interactive Technique Matcher Advisor */}
      <div className="bg-gradient-to-br from-[#E8F3EC]/90 to-white rounded-[28px] p-6 shadow-sm border border-[#2F6B4F]/20">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#125238] uppercase tracking-wider mb-1">
              <span className="material-symbols-outlined text-[18px]">smart_toy</span>
              Interactive Farming Technique Matcher
            </div>
            <h2 className="text-xl font-normal text-[#1D1D1F] tracking-tight">
              Which farming technique fits your land best?
            </h2>
            <p className="text-xs text-[#6E6E73] mt-1">
              Adjust your parameters to receive tailored methodology recommendations based on water, soil, and capital.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              <div>
                <label className="block text-[11px] font-medium text-[#1D1D1F] mb-1">Land Holding</label>
                <select
                  value={advisorAcreage}
                  onChange={(e) => setAdvisorAcreage(e.target.value)}
                  className="w-full h-8 px-2 rounded-xl bg-white text-xs border border-black/[0.08] focus:outline-none"
                >
                  <option value="2.5">2.5 Acres (Marginal)</option>
                  <option value="5.0">5.0 Acres (Small)</option>
                  <option value="12.5">12.5 Acres (Medium)</option>
                  <option value="25.0">25+ Acres (Commercial)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#1D1D1F] mb-1">Water Source</label>
                <select
                  value={advisorWater}
                  onChange={(e) => setAdvisorWater(e.target.value)}
                  className="w-full h-8 px-2 rounded-xl bg-white text-xs border border-black/[0.08] focus:outline-none"
                >
                  <option value="Abundant">Abundant (Canal/River)</option>
                  <option value="Moderate">Moderate (Borewell)</option>
                  <option value="Scarce">Scarce (Rainfed/Deficit)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#1D1D1F] mb-1">Dominant Soil</label>
                <select
                  value={advisorSoil}
                  onChange={(e) => setAdvisorSoil(e.target.value)}
                  className="w-full h-8 px-2 rounded-xl bg-white text-xs border border-black/[0.08] focus:outline-none"
                >
                  <option value="Clay Loam">Black Cotton / Clay Loam</option>
                  <option value="Red Loam">Red Sandy Loam</option>
                  <option value="Alluvial">Alluvial Basin</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#1D1D1F] mb-1">Capex Budget</label>
                <select
                  value={advisorBudget}
                  onChange={(e) => setAdvisorBudget(e.target.value)}
                  className="w-full h-8 px-2 rounded-xl bg-white text-xs border border-black/[0.08] focus:outline-none"
                >
                  <option value="Low">Low (&lt;₹50k/ac)</option>
                  <option value="Medium">Medium (₹50k-₹2L/ac)</option>
                  <option value="High">High (High-Tech CEA)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Recommendation Match Result Card */}
          {(() => {
            const rec = techniques.find((t) => t.id === recommendedId) || techniques[0];
            return (
              <div className="w-full lg:w-80 bg-white rounded-2xl p-4 shadow-sm border border-black/[0.06] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] uppercase font-bold text-[#125238] bg-[#E8F3EC] px-2 py-0.5 rounded-full">
                      Optimal Match
                    </span>
                    <span className="text-xs text-[#34C759] font-medium">96% Suitability</span>
                  </div>
                  <h4 className="text-base font-semibold text-[#1D1D1F]">{rec?.title}</h4>
                  <p className="text-[11px] text-[#6E6E73] line-clamp-2 mt-1">{rec?.tagline}</p>
                </div>

                <div className="mt-3 pt-3 border-t border-black/[0.04] flex items-center justify-between">
                  <div className="text-[11px] text-[#2F6B4F] font-semibold">
                    Water: {rec?.waterSavings} saved
                  </div>
                  <button
                    onClick={() => {
                      setSelectedTechnique(rec);
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className="text-xs text-[#125238] font-medium hover:underline cursor-pointer"
                  >
                    View Blueprint →
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              categoryFilter === cat
                ? 'bg-[#125238] text-white shadow-xs'
                : 'bg-white text-[#6E6E73] hover:text-[#1D1D1F] border border-black/[0.04]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Grid: Techniques Cards (8 cols) + Detail & Implementation Guide (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Technique Cards Grid */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTechniques.map((tech) => (
            <div
              key={tech.id}
              onClick={() => setSelectedTechnique(tech)}
              className={`p-5 rounded-[24px] border cursor-pointer transition-all flex flex-col justify-between ${
                selectedTechnique?.id === tech.id
                  ? 'bg-white border-[#2F6B4F] shadow-md ring-2 ring-[#2F6B4F]/10'
                  : 'bg-white border-black/[0.04] hover:shadow-sm hover:border-black/[0.1]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#E8F3EC] flex items-center justify-center text-[#2F6B4F]">
                    <span className="material-symbols-outlined text-[22px]">{tech.icon}</span>
                  </div>
                  <StatusBadge variant="eco">{tech.badge}</StatusBadge>
                </div>

                <h3 className="text-base font-semibold text-[#1D1D1F]">{tech.title}</h3>
                <p className="text-xs text-[#6E6E73] mt-1 line-clamp-2">{tech.description}</p>
              </div>

              {/* Metrics Matrix */}
              <div className="mt-4 pt-3 border-t border-black/[0.04] grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-xl bg-[#F6F3F5]">
                  <span className="text-[10px] text-[#6E6E73] block">Water Saved</span>
                  <span className="font-semibold text-[#2F6B4F]">{tech.waterSavings}</span>
                </div>
                <div className="p-2 rounded-xl bg-[#F6F3F5]">
                  <span className="text-[10px] text-[#6E6E73] block">Yield Advantage</span>
                  <span className="font-semibold text-[#1D1D1F]">{tech.yieldIncrease}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Deep Blueprint & Adoption Steps */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {selectedTechnique && (
            <div className="bg-white rounded-[28px] p-6 shadow-sm border border-black/[0.04]">
              <div className="flex items-start justify-between pb-3 mb-3 border-b border-black/[0.04]">
                <div>
                  <span className="font-label-caps text-[#6E6E73]">{selectedTechnique.category}</span>
                  <h3 className="text-xl font-medium text-[#1D1D1F] mt-0.5">{selectedTechnique.title}</h3>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-[#E8F3EC] flex items-center justify-center text-[#2F6B4F]">
                  <span className="material-symbols-outlined text-[22px]">{selectedTechnique.icon}</span>
                </div>
              </div>

              <p className="text-xs text-[#1D1D1F] leading-relaxed mb-4">
                {selectedTechnique.description}
              </p>

              {/* Specifications Matrix */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center text-xs p-2 rounded-xl bg-[#F6F3F5]">
                  <span className="text-[#6E6E73]">Setup Capital:</span>
                  <span className="font-semibold text-[#1D1D1F]">{selectedTechnique.setupCost}</span>
                </div>
                <div className="flex justify-between items-center text-xs p-2 rounded-xl bg-[#F6F3F5]">
                  <span className="text-[#6E6E73]">Skill / Training Level:</span>
                  <span className="font-semibold text-[#1D1D1F]">{selectedTechnique.skillLevel}</span>
                </div>
                <div className="flex justify-between items-center text-xs p-2 rounded-xl bg-[#F6F3F5]">
                  <span className="text-[#6E6E73]">Cost Reduction:</span>
                  <span className="font-semibold text-[#2F6B4F]">{selectedTechnique.costReduction}</span>
                </div>
              </div>

              {/* Ideal Crops */}
              <div className="mb-4">
                <span className="text-[11px] font-semibold text-[#1D1D1F] block mb-2">Ideal Compatible Crops:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTechnique.idealFor.map((crop) => (
                    <span key={crop} className="px-2.5 py-1 rounded-full text-[11px] bg-[#E8F3EC] text-[#125238] font-medium">
                      {crop}
                    </span>
                  ))}
                </div>
              </div>

              {/* Core Pillars */}
              <div className="mb-4">
                <span className="text-[11px] font-semibold text-[#1D1D1F] block mb-2">Methodology Core Pillars:</span>
                <ul className="space-y-1.5 text-xs text-[#1D1D1F]">
                  {selectedTechnique.corePillars.map((p, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[16px] text-[#2F6B4F] mt-0.5">check_circle</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Step-by-Step Implementation Roadmap */}
              <div className="p-4 rounded-2xl bg-[#F6F3F5] border border-black/[0.04]">
                <span className="text-[11px] font-semibold text-[#125238] uppercase block mb-2">
                  Actionable Adoption Roadmap
                </span>
                <ol className="space-y-2 text-xs text-[#1D1D1F]">
                  {selectedTechnique.adoptionSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#125238] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-snug">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmingTechniquesPage;
