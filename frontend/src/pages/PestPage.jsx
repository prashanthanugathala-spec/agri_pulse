import React, { useState, useEffect } from 'react';
import { pestService } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import { LoadingState, ErrorState } from '../components/FeedbackStates';

export const PestPage = () => {
  const [diagnostics, setDiagnostics] = useState([]);
  const [activeDiagnostic, setActiveDiagnostic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);

  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [selectedZone, setSelectedZone] = useState('Zone C - Polyhouse');

  const loadDiagnostics = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await pestService.getDiagnostics();
      setDiagnostics(res);
      if (res.length > 0) setActiveDiagnostic(res[0]);
    } catch (err) {
      setError(err.message || 'Failed to load diagnostics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDiagnostics();
  }, []);

  const handleSimulateScan = async () => {
    try {
      setScanning(true);
      const res = await pestService.simulateScan({
        cropName: selectedCrop,
        zone: selectedZone,
      });
      setActiveDiagnostic(res);
      setDiagnostics((prev) => [res, ...prev]);
    } catch (err) {
      alert('Diagnostic scan failed: ' + err.message);
    } finally {
      setScanning(false);
    }
  };

  if (loading) return <LoadingState message="Connecting to computer vision pathology model..." />;
  if (error) return <ErrorState message={error} onRetry={loadDiagnostics} />;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-header">
        <div>
          <span className="font-label-caps text-[#6E6E73]">Computer Vision Diagnostics</span>
          <h1 className="text-3xl sm:text-4xl font-normal text-[#1D1D1F] tracking-tight mt-1">
            Pest & Disease Vision Diagnostic
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6E73] mt-1">
            High-resolution canopy pathology scan, spore recognition, and targeted organic prescriptions.
          </p>
        </div>

        <StatusBadge variant="optimal" icon="auto_awesome">
          ResNet-50 Vision Model Online (v2.4)
        </StatusBadge>
      </section>

      {/* Main Scanner Section (8 cols) + Result Section (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Scanner Upload Area & Active Diagnosis */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Drag & Drop Scan Card */}
          <div className="bg-white rounded-[28px] p-6 shadow-sm border border-black/[0.04]">
            <h3 className="text-base font-semibold text-[#1D1D1F] mb-1">New Vision Diagnostic Scan</h3>
            <p className="text-xs text-[#6E6E73] mb-4">
              Capture or upload high-resolution leaf, stem, or canopy photos for instant pathogen identification.
            </p>

            <div className="border-2 border-dashed border-[#C0C9C1] rounded-2xl p-8 text-center bg-[#FBFBFD] hover:bg-[#F6F3F5] transition-colors mb-4">
              <div className="w-14 h-14 rounded-full bg-[#E8F3EC] flex items-center justify-center mx-auto mb-3 text-[#125238]">
                <span className="material-symbols-outlined text-[28px]">add_a_photo</span>
              </div>
              <p className="text-xs font-medium text-[#1D1D1F] mb-1">Drop sample image here, or select sample preset below</p>
              <p className="text-[11px] text-[#707972]">Supports JPG, PNG up to 20MB (multispectral supported)</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="h-10 px-3 rounded-xl bg-[#F6F3F5] text-xs text-[#1D1D1F] border border-black/[0.06] focus:outline-none"
                >
                  <option value="Tomato">Crop: Tomato (Polyhouse)</option>
                  <option value="Cotton">Crop: Bt-Cotton (Basin)</option>
                  <option value="Rice">Crop: Rice (North Paddy)</option>
                  <option value="Sweet Orange">Crop: Sweet Orange (Orchard)</option>
                </select>

                <select
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="h-10 px-3 rounded-xl bg-[#F6F3F5] text-xs text-[#1D1D1F] border border-black/[0.06] focus:outline-none"
                >
                  <option value="Zone C - Polyhouse">Zone C - Polyhouse Row 4</option>
                  <option value="Zone B - Cotton Basin">Zone B - Sector 2</option>
                  <option value="Zone A - North Paddy">Zone A - Tillers</option>
                  <option value="Zone D - Orchard">Zone D - Canopy</option>
                </select>
              </div>

              <Button
                variant="primary"
                size="md"
                icon="document_scanner"
                isLoading={scanning}
                onClick={handleSimulateScan}
                className="w-full sm:w-auto"
              >
                Run Pathology Inference
              </Button>
            </div>
          </div>

          {/* Active Diagnostic Detail Card */}
          {activeDiagnostic && (
            <div className="bg-white rounded-[28px] p-6 shadow-sm border border-black/[0.04]">
              <div className="flex items-start justify-between pb-4 mb-4 border-b border-black/[0.04]">
                <div>
                  <span className="font-label-caps text-[#6E6E73]">{activeDiagnostic.affectedZone}</span>
                  <h3 className="text-xl font-medium text-[#1D1D1F] mt-0.5">{activeDiagnostic.issueName}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge
                    variant={
                      activeDiagnostic.severity === 'CRITICAL'
                        ? 'critical'
                        : activeDiagnostic.severity === 'MODERATE'
                        ? 'warning'
                        : 'optimal'
                    }
                  >
                    {activeDiagnostic.severity} Severity
                  </StatusBadge>
                  <StatusBadge variant="eco">{activeDiagnostic.confidenceScore}% Confidence</StatusBadge>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div className="rounded-2xl overflow-hidden h-52 bg-black/10 relative">
                  <img
                    src={activeDiagnostic.imageUrl}
                    alt={activeDiagnostic.issueName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-mono">
                    Bounding Box [x: 120, y: 84, w: 240, h: 180]
                  </div>
                </div>

                <div className="flex flex-col justify-between">
                  <div className="p-4 rounded-2xl bg-[#F6F3F5] mb-3">
                    <span className="text-[10px] text-[#6E6E73] uppercase font-semibold block mb-1">
                      Pathology Model Summary
                    </span>
                    <p className="text-xs text-[#1D1D1F] leading-relaxed">
                      {activeDiagnostic.aiAnalysisSummary}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#E8F3EC]/60 border border-[#2F6B4F]/20">
                    <span className="text-[10px] text-[#2F6B4F] uppercase font-semibold block mb-1">
                      Targeted Bio-Rational Treatment
                    </span>
                    <p className="text-xs text-[#1D1D1F] leading-relaxed font-medium">
                      {activeDiagnostic.treatmentRecommendation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Pathology Archive List (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-[28px] p-6 shadow-sm border border-black/[0.04]">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-black/[0.04]">
            <h3 className="text-sm font-semibold text-[#1D1D1F]">Historical Diagnostic Log</h3>
            <span className="text-xs text-[#6E6E73]">{diagnostics.length} Entries</span>
          </div>

          <div className="space-y-3">
            {diagnostics.map((diag) => (
              <div
                key={diag.id}
                onClick={() => setActiveDiagnostic(diag)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  activeDiagnostic?.id === diag.id
                    ? 'bg-[#E8F3EC]/50 border-[#2F6B4F]/40 shadow-xs'
                    : 'bg-[#F6F3F5] border-transparent hover:bg-[#F0EDEF]'
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="font-medium text-xs text-[#1D1D1F]">{diag.cropName} • {diag.issueName}</span>
                  <StatusBadge
                    variant={
                      diag.severity === 'CRITICAL'
                        ? 'critical'
                        : diag.severity === 'MODERATE'
                        ? 'warning'
                        : 'optimal'
                    }
                  >
                    {diag.confidenceScore}%
                  </StatusBadge>
                </div>
                <div className="text-[11px] text-[#6E6E73]">{diag.affectedZone}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PestPage;
