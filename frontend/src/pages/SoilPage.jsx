import React, { useState, useEffect } from 'react';
import { soilService } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { LoadingState, ErrorState } from '../components/FeedbackStates';

export const SoilPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // Form states
  const [parcelName, setParcelName] = useState('Zone A - North Paddy Field');
  const [sampleCode, setSampleCode] = useState('SMP-2026-104');
  const [labName, setLabName] = useState('Telangana State Agronomy Lab');
  const [ph, setPh] = useState(6.8);
  const [notes, setNotes] = useState('Adequate organic matter; optimal macronutrient reserves.');
  const [submitting, setSubmitting] = useState(false);

  const loadSoilData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [metricsRes, testsRes] = await Promise.all([
        soilService.getMetrics(),
        soilService.getSoilTests(),
      ]);
      setMetrics(metricsRes);
      setTests(testsRes);
    } catch (err) {
      setError(err.message || 'Failed to load soil telemetry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSoilData();
  }, []);

  const handleLogTest = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await soilService.logTest({
        parcelName,
        sampleCode,
        labName,
        ph: parseFloat(ph),
        status: 'OPTIMAL',
        notes,
      });
      setIsLogModalOpen(false);
      loadSoilData();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState message="Connecting to subterranean soil matrix probes..." />;
  if (error) return <ErrorState message={error} onRetry={loadSoilData} />;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-header">
        <div>
          <span className="font-label-caps text-[#6E6E73]">Edaphic Telemetry</span>
          <h1 className="text-3xl sm:text-4xl font-normal text-[#1D1D1F] tracking-tight mt-1">
            Soil Health & Vitality
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6E73] mt-1">
            Macronutrient reserves (N-P-K), subterranean moisture depths, and laboratory test archives.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon="add"
          onClick={() => setIsLogModalOpen(true)}
        >
          Log Laboratory Test
        </Button>
      </section>

      {/* Primary N-P-K Vitality Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-black/[0.04]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-label-caps text-[#6E6E73]">Nitrogen (N)</span>
            <span className="material-symbols-outlined text-[#707972] text-[20px]">science</span>
          </div>
          <div className="font-metric-num text-3xl text-[#1D1D1F] my-1">
            {metrics?.nitrogenLevel || 185.0} <span className="text-sm font-normal text-[#6E6E73]">kg/ha</span>
          </div>
          <StatusBadge variant="eco" icon="check">Adequate Nitrogen</StatusBadge>
        </div>

        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-black/[0.04]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-label-caps text-[#6E6E73]">Phosphorus (P)</span>
            <span className="material-symbols-outlined text-[#707972] text-[20px]">biotech</span>
          </div>
          <div className="font-metric-num text-3xl text-[#1D1D1F] my-1">
            {metrics?.phosphorusLevel || 34.0} <span className="text-sm font-normal text-[#6E6E73]">kg/ha</span>
          </div>
          <StatusBadge variant="optimal" icon="check">Optimal Reserve</StatusBadge>
        </div>

        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-black/[0.04]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-label-caps text-[#6E6E73]">Potassium (K)</span>
            <span className="material-symbols-outlined text-[#707972] text-[20px]">grain</span>
          </div>
          <div className="font-metric-num text-3xl text-[#1D1D1F] my-1">
            {metrics?.potassiumLevel || 240.0} <span className="text-sm font-normal text-[#6E6E73]">kg/ha</span>
          </div>
          <StatusBadge variant="optimal" icon="check">Rich Potash Buffer</StatusBadge>
        </div>

        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-black/[0.04]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-label-caps text-[#6E6E73]">Soil pH & Organic</span>
            <span className="material-symbols-outlined text-[#707972] text-[20px]">layers</span>
          </div>
          <div className="font-metric-num text-3xl text-[#1D1D1F] my-1">
            {metrics?.soilPh || 6.8} <span className="text-sm font-normal text-[#6E6E73]">pH • {metrics?.organicMatter}% OM</span>
          </div>
          <StatusBadge variant="eco" icon="eco">Vitality Score {metrics?.overallVitalityIndex || 88}/100</StatusBadge>
        </div>
      </div>

      {/* Multi-depth Subterranean Moisture Profiles */}
      <div className="bg-white rounded-[28px] p-6 shadow-sm border border-black/[0.04]">
        <div className="pb-4 mb-4 border-b border-black/[0.04]">
          <span className="font-label-caps text-[#6E6E73]">Sub-surface Hydrology Profile</span>
          <h3 className="text-lg font-medium text-[#1D1D1F]">Multi-depth Root Horizon Saturation</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-[#F6F3F5] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#1D1D1F]">Horizon 0 - 15 cm</span>
              <StatusBadge variant="optimal">Active Feeder Roots</StatusBadge>
            </div>
            <div className="font-metric-num text-4xl text-[#1D1D1F] my-2">
              {metrics?.moistureDepth15cm || 70.0}%
            </div>
            <p className="text-xs text-[#6E6E73]">Topsoil moisture tension within calibrated optimal band.</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#F6F3F5] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#1D1D1F]">Horizon 15 - 30 cm</span>
              <StatusBadge variant="eco">Mid Root Zone</StatusBadge>
            </div>
            <div className="font-metric-num text-4xl text-[#1D1D1F] my-2">
              {metrics?.moistureDepth30cm || 65.0}%
            </div>
            <p className="text-xs text-[#6E6E73]">Sustained moisture reservoir preventing wilting stress.</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#F6F3F5] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#1D1D1F]">Horizon 30 - 60 cm</span>
              <StatusBadge variant="neutral">Deep Sub-soil</StatusBadge>
            </div>
            <div className="font-metric-num text-4xl text-[#1D1D1F] my-2">
              {metrics?.moistureDepth60cm || 58.0}%
            </div>
            <p className="text-xs text-[#6E6E73]">Deep groundwater infiltration recharge intact.</p>
          </div>
        </div>
      </div>

      {/* Soil Lab Test History Table */}
      <div className="bg-white rounded-[28px] p-6 shadow-sm border border-black/[0.04]">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-black/[0.04]">
          <div>
            <span className="font-label-caps text-[#6E6E73]">Laboratory Verification</span>
            <h3 className="text-lg font-medium text-[#1D1D1F]">Soil Test Archives</h3>
          </div>
          <span className="text-xs text-[#6E6E73]">{tests.length} Verified Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-black/[0.06] text-[#6E6E73]">
                <th className="pb-3 font-semibold uppercase tracking-wider">Sample Code</th>
                <th className="pb-3 font-semibold uppercase tracking-wider">Parcel Zone</th>
                <th className="pb-3 font-semibold uppercase tracking-wider">Testing Facility</th>
                <th className="pb-3 font-semibold uppercase tracking-wider">pH Level</th>
                <th className="pb-3 font-semibold uppercase tracking-wider">Health Status</th>
                <th className="pb-3 font-semibold uppercase tracking-wider">Agronomist Observations</th>
                <th className="pb-3 font-semibold uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04]">
              {tests.map((test) => (
                <tr key={test.id} className="hover:bg-[#F6F3F5] transition-colors">
                  <td className="py-3.5 font-medium text-[#1D1D1F]">{test.sampleCode}</td>
                  <td className="py-3.5 text-[#1D1D1F]">{test.parcelName}</td>
                  <td className="py-3.5 text-[#6E6E73]">{test.labName}</td>
                  <td className="py-3.5 font-semibold text-[#1D1D1F]">{test.ph}</td>
                  <td className="py-3.5">
                    <StatusBadge variant={test.status === 'OPTIMAL' ? 'optimal' : 'warning'}>
                      {test.status}
                    </StatusBadge>
                  </td>
                  <td className="py-3.5 text-[#6E6E73] max-w-xs truncate">{test.notes}</td>
                  <td className="py-3.5 text-[#6E6E73]">{test.testedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Lab Test Modal */}
      <Modal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        title="Log Soil Assay Report"
        subtitle="Record certified third-party laboratory analysis"
      >
        <form onSubmit={handleLogTest} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#1B1B1D] mb-1">Parcel</label>
            <select
              value={parcelName}
              onChange={(e) => setParcelName(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl bg-[#F6F3F5] text-xs text-[#1B1B1D] border border-black/[0.06] focus:bg-white focus:outline-none"
            >
              <option value="Zone A - North Paddy Field">Zone A - North Paddy Field</option>
              <option value="Zone B - Cotton Basin">Zone B - Cotton Basin</option>
              <option value="Zone C - Tomato Polyhouse">Zone C - Tomato Polyhouse</option>
              <option value="Zone D - High Density Orchard">Zone D - High Density Orchard</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#1B1B1D] mb-1">Sample Code</label>
              <input
                type="text"
                required
                value={sampleCode}
                onChange={(e) => setSampleCode(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-[#F6F3F5] text-xs text-[#1B1B1D] border border-black/[0.06] focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#1B1B1D] mb-1">Measured pH</label>
              <input
                type="number"
                step="0.1"
                required
                value={ph}
                onChange={(e) => setPh(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-[#F6F3F5] text-xs text-[#1B1B1D] border border-black/[0.06] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#1B1B1D] mb-1">Laboratory Facility</label>
            <input
              type="text"
              required
              value={labName}
              onChange={(e) => setLabName(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl bg-[#F6F3F5] text-xs text-[#1B1B1D] border border-black/[0.06] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#1B1B1D] mb-1">Observations / Buffer Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#F6F3F5] text-xs text-[#1B1B1D] border border-black/[0.06] focus:bg-white focus:outline-none"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-4"
            isLoading={submitting}
          >
            Save Assay Entry
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default SoilPage;
