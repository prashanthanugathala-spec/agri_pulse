import React, { useState, useEffect } from 'react';
import { cropService, cropAnalysisService } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { LoadingState, ErrorState, EmptyState } from '../components/FeedbackStates';

export const CropsPage = () => {
  const [crops, setCrops] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Crop Analysis Modal states
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [selectedCropForAnalysis, setSelectedCropForAnalysis] = useState(null);
  const [cropAnalysisData, setCropAnalysisData] = useState(null);
  const [analysisTab, setAnalysisTab] = useState('overview');


  // Form states for adding crop
  const [name, setName] = useState('');
  const [variety, setVariety] = useState('');
  const [season, setSeason] = useState('Kharif 2026');
  const [stage, setStage] = useState('Vegetative');
  const [yieldForecast, setYieldForecast] = useState('3.8 tons/ac');
  const [waterReq, setWaterReq] = useState('4,200 L/day');
  const [submitting, setSubmitting] = useState(false);

  const loadCrops = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await cropService.getAllCrops(filter === 'ALL' ? null : filter);
      setCrops(res);
    } catch (err) {
      setError(err.message || 'Failed to load crops.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCrops();
  }, [filter]);

  const handleAddCrop = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await cropService.createCrop({
        farmId: 1,
        name,
        variety,
        season,
        stage,
        healthScore: 92,
        yieldForecast,
        waterRequirement: waterReq,
        status: 'OPTIMAL',
      });
      setIsAddModalOpen(false);
      setName('');
      setVariety('');
      loadCrops();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenAnalysis = async (crop) => {
    setSelectedCropForAnalysis(crop);
    try {
      const data = await cropAnalysisService.getCropAnalysis(crop.id);
      setCropAnalysisData(data);
    } catch {
      // fallback
    }
    setIsAnalysisModalOpen(true);
  };

  const handleDeleteCrop = async (id) => {
    if (!window.confirm('Are you sure you want to remove this crop from the active portfolio?')) return;
    try {
      await cropService.deleteCrop(id);
      loadCrops();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <LoadingState message="Retrieving crop phenology metrics..." />;
  if (error) return <ErrorState message={error} onRetry={loadCrops} />;


  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-header">
        <div>
          <span className="font-label-caps text-[#6E6E73]">Agronomic Phenology</span>
          <h1 className="text-3xl sm:text-4xl font-normal text-[#1D1D1F] tracking-tight mt-1">
            Crop Portfolio & Phenology
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6E73] mt-1">
            Lifecycle development stages, health scores, and projected yield metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <div className="flex rounded-full bg-white p-1 border border-black/[0.04]">
            {['ALL', 'OPTIMAL', 'ATTENTION'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  filter === tab
                    ? 'bg-[#E8F3EC] text-[#2F6B4F] shadow-xs'
                    : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <Button
            variant="primary"
            size="md"
            icon="add"
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Crop
          </Button>
        </div>
      </section>

      {/* Crop Cards Grid */}
      {crops.length === 0 ? (
        <EmptyState
          icon="potted_plant"
          title="No crops in this filter"
          description="Try switching filters or add a new crop variety to your portfolio."
          actionText="Add Crop Variety"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {crops.map((crop) => (
            <div
              key={crop.id}
              className="bg-white rounded-[28px] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_20px_40px_-15px_rgba(0,0,0,0.03)] border border-black/[0.04] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#E8F3EC] flex items-center justify-center text-[#2F6B4F]">
                      <span className="material-symbols-outlined text-[24px]">potted_plant</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-[#1D1D1F]">{crop.name}</h3>
                      <div className="text-xs text-[#6E6E73]">{crop.variety} • {crop.season}</div>
                    </div>
                  </div>

                  <StatusBadge variant={crop.healthScore >= 85 ? 'optimal' : 'warning'}>
                    {crop.healthScore}% Vigor
                  </StatusBadge>
                </div>

                {/* Phenology Bar */}
                <div className="p-4 rounded-2xl bg-[#F6F3F5] mb-4">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-[#6E6E73]">Current Phenology</span>
                    <span className="font-medium text-[#2F6B4F]">{crop.stage}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 h-2">
                    <div className="bg-[#2F6B4F] rounded-l-full" title="Germination" />
                    <div className="bg-[#2F6B4F]" title="Vegetative" />
                    <div className={crop.stage.includes('Ripening') || crop.stage.includes('Harvest') ? 'bg-[#2F6B4F]' : 'bg-[#B1F0CD]'} title="Flowering" />
                    <div className={crop.stage.includes('Harvest') ? 'bg-[#2F6B4F] rounded-r-full' : 'bg-black/10 rounded-r-full'} title="Ripening/Harvest" />
                  </div>
                  <div className="flex justify-between text-[10px] text-[#707972] mt-1.5">
                    <span>Vegetative</span>
                    <span>Flowering</span>
                    <span>Ripening</span>
                    <span>Harvest</span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-[#F6F3F5]">
                    <div className="text-[10px] text-[#6E6E73] uppercase font-semibold">Yield Target</div>
                    <div className="text-sm font-medium text-[#1D1D1F] mt-0.5">{crop.yieldForecast}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F6F3F5]">
                    <div className="text-[10px] text-[#6E6E73] uppercase font-semibold">Water Demand</div>
                    <div className="text-sm font-medium text-[#1D1D1F] mt-0.5">{crop.waterRequirement}</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-black/[0.04] flex items-center justify-between text-xs">
                <Button
                  variant="secondary"
                  size="sm"
                  icon="biotech"
                  onClick={() => handleOpenAnalysis(crop)}
                >
                  Analyse Crop
                </Button>
                <button
                  onClick={() => handleDeleteCrop(crop.id)}
                  className="text-[#BA1A1A] hover:underline cursor-pointer"
                >
                  Remove Crop
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Crop Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Crop Variety"
        subtitle="Register new botanical species into active agronomy calendar"
      >
        <form onSubmit={handleAddCrop} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#1B1B1D] mb-1">Crop Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Maize"
              className="w-full h-10 px-3.5 rounded-xl bg-[#F6F3F5] text-xs text-[#1B1B1D] border border-black/[0.06] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#1B1B1D] mb-1">Variety / Hybrid Strain</label>
            <input
              type="text"
              required
              value={variety}
              onChange={(e) => setVariety(e.target.value)}
              placeholder="e.g. DMH-849 Sweet Corn"
              className="w-full h-10 px-3.5 rounded-xl bg-[#F6F3F5] text-xs text-[#1B1B1D] border border-black/[0.06] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#1B1B1D] mb-1">Season</label>
              <input
                type="text"
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-[#F6F3F5] text-xs text-[#1B1B1D] border border-black/[0.06] focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#1B1B1D] mb-1">Phenology Stage</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-[#F6F3F5] text-xs text-[#1B1B1D] border border-black/[0.06] focus:bg-white focus:outline-none"
              >
                <option value="Vegetative">Vegetative</option>
                <option value="Tillering">Tillering</option>
                <option value="Flowering">Flowering</option>
                <option value="Fruit Ripening">Fruit Ripening</option>
                <option value="Harvest Ready">Harvest Ready</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#1B1B1D] mb-1">Yield Target</label>
              <input
                type="text"
                value={yieldForecast}
                onChange={(e) => setYieldForecast(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-[#F6F3F5] text-xs text-[#1B1B1D] border border-black/[0.06] focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#1B1B1D] mb-1">Water Demand</label>
              <input
                type="text"
                value={waterReq}
                onChange={(e) => setWaterReq(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-[#F6F3F5] text-xs text-[#1B1B1D] border border-black/[0.06] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-4"
            isLoading={submitting}
          >
            Register Crop
          </Button>
        </form>
      </Modal>

      {/* Deep Crop Agronomic Analysis Modal */}
      <Modal
        isOpen={isAnalysisModalOpen}
        onClose={() => setIsAnalysisModalOpen(false)}
        title={selectedCropForAnalysis ? `Agronomic Analysis: ${selectedCropForAnalysis.name}` : 'Crop Agronomic Analysis'}
        subtitle={selectedCropForAnalysis ? `${selectedCropForAnalysis.variety} • Season ${selectedCropForAnalysis.season}` : ''}
      >
        <div className="space-y-4">
          {/* Analysis Tab Switcher */}
          <div className="flex rounded-full bg-[#F6F3F5] p-1 border border-black/[0.04] text-xs">
            {[
              { id: 'overview', label: 'Vigour & NDVI' },
              { id: 'nutrients', label: 'NPK Nutrition' },
              { id: 'phenology', label: 'Lifecycle Timeline' },
              { id: 'advisory', label: 'Pest & Advisory' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setAnalysisTab(tab.id)}
                className={`flex-1 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
                  analysisTab === tab.id
                    ? 'bg-white text-[#125238] shadow-xs'
                    : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Overview, Vigour, Stress, Yield */}
          {analysisTab === 'overview' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#E8F3EC]/70 border border-[#2F6B4F]/20">
                  <span className="text-[10px] uppercase font-semibold text-[#125238] block">NDVI Biomass Index</span>
                  <div className="text-2xl font-bold text-[#125238] mt-0.5">0.82</div>
                  <span className="text-[10px] text-[#2F6B4F]">High Photosynthetic Activity</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F6F3F5]">
                  <span className="text-[10px] uppercase font-semibold text-[#6E6E73] block">Canopy Coverage</span>
                  <div className="text-2xl font-bold text-[#1D1D1F] mt-0.5">78%</div>
                  <span className="text-[10px] text-[#707972]">Optimal Leaf Area Index</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#F6F3F5]">
                  <span className="text-[10px] text-[#6E6E73] uppercase font-semibold block">Soil Compatibility</span>
                  <div className="text-sm font-semibold text-[#1D1D1F] mt-0.5">94% Suitability</div>
                  <span className="text-[10px] text-[#707972]">pH 6.8 & Clay-Loam match</span>
                </div>
                <div className="p-3 rounded-xl bg-[#F6F3F5]">
                  <span className="text-[10px] text-[#6E6E73] uppercase font-semibold block">Water Stress Index</span>
                  <div className="text-sm font-semibold text-[#34C759] mt-0.5">0.12 (Minimal Stress)</div>
                  <span className="text-[10px] text-[#707972]">Sub-surface hydration optimal</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F6F3F5]">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-[#1D1D1F]">Yield Potential Projection:</span>
                  <span className="font-bold text-[#2F6B4F]">5.8 Tons/ha</span>
                </div>
                <p className="text-[11px] text-[#6E6E73]">
                  Projected at +11.5% above the regional average of 5.2 Tons/ha due to optimal tiller density and regulated hydrology.
                </p>
              </div>
            </div>
          )}

          {/* Tab 2: N-P-K Nutrient Absorption */}
          {analysisTab === 'nutrients' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-[#F6F3F5]">
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Nitrogen (N) Uptake</span>
                  <span className="text-[#2F6B4F]">85 / 120 kg/ha (71%)</span>
                </div>
                <div className="w-full bg-black/10 rounded-full h-2">
                  <div className="bg-[#2F6B4F] h-2 rounded-full" style={{ width: '71%' }} />
                </div>
                <span className="text-[10px] text-[#6E6E73] mt-1 block">Scheduled top dressing at panicle stage</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F6F3F5]">
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Phosphorus (P) Uptake</span>
                  <span className="text-[#2F6B4F]">32 / 40 kg/ha (80%)</span>
                </div>
                <div className="w-full bg-black/10 rounded-full h-2">
                  <div className="bg-[#2F6B4F] h-2 rounded-full" style={{ width: '80%' }} />
                </div>
                <span className="text-[10px] text-[#6E6E73] mt-1 block">Root elongation phase satisfied</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F6F3F5]">
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Potassium (K) Uptake</span>
                  <span className="text-[#125238]">48 / 60 kg/ha (80%)</span>
                </div>
                <div className="w-full bg-black/10 rounded-full h-2">
                  <div className="bg-[#125238] h-2 rounded-full" style={{ width: '80%' }} />
                </div>
                <span className="text-[10px] text-[#6E6E73] mt-1 block">Rich soil potash buffer detected</span>
              </div>
            </div>
          )}

          {/* Tab 3: Phenology Lifecycle Timeline */}
          {analysisTab === 'phenology' && (
            <div className="space-y-2.5">
              {[
                { stage: 'Germination & Nursery', duration: 'Days 0 - 25', status: 'COMPLETED' },
                { stage: 'Transplanting & Active Tillering', duration: 'Days 26 - 55 (Day 48 Current)', status: 'CURRENT' },
                { stage: 'Panicle Initiation', duration: 'Days 56 - 85', status: 'UPCOMING' },
                { stage: 'Flowering & Grain Filling', duration: 'Days 86 - 120', status: 'UPCOMING' },
                { stage: 'Maturity & Harvest', duration: 'Days 121 - 145', status: 'UPCOMING' },
              ].map((p, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                    p.status === 'CURRENT'
                      ? 'bg-[#E8F3EC] border-[#2F6B4F]/40'
                      : p.status === 'COMPLETED'
                      ? 'bg-[#F6F3F5] border-transparent opacity-80'
                      : 'bg-white border-black/[0.04] text-[#707972]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px]">
                      {p.status === 'COMPLETED' ? 'check_circle' : p.status === 'CURRENT' ? 'timelapse' : 'radio_button_unchecked'}
                    </span>
                    <span className="font-medium text-[#1D1D1F]">{p.stage}</span>
                  </div>
                  <span className="text-[11px] text-[#6E6E73]">{p.duration}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Pest Vulnerability & Advisory */}
          {analysisTab === 'advisory' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-[#FFF8E6] border border-[#B78103]/20">
                <div className="flex items-center justify-between text-xs font-semibold text-[#B78103] mb-1">
                  <span>Yellow Stem Borer Risk: MEDIUM</span>
                  <span>Threshold 3 moths/day</span>
                </div>
                <p className="text-[11px] text-[#6E6E73]">
                  Deploy 4 pheromone traps per acre. Scout weekly for dead hearts or white ears.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F6F3F5] space-y-1.5 text-xs">
                <span className="font-semibold text-[#125238] block">Agronomic AI Prescription:</span>
                <p className="text-[#6E6E73] leading-relaxed">
                  • Maintain shallow standing water (2-3 cm) during tillering.
                </p>
                <p className="text-[#6E6E73] leading-relaxed">
                  • Apply second top-dressing of nitrogen blended with Neem cake.
                </p>
                <p className="text-[#6E6E73] leading-relaxed">
                  • Release Trichogramma egg parasitoids @ 20,000/acre if adult moths appear.
                </p>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default CropsPage;

