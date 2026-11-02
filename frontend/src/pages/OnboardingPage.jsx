import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';

export const OnboardingPage = () => {
  const [step, setStep] = useState(3);
  const [selectedIrrigation, setSelectedIrrigation] = useState('drip');
  const [farmName, setFarmName] = useState('Green Valley Farm');
  const [acreage, setAcreage] = useState('12.5');
  const [soilType, setSoilType] = useState('Red Sandy Loam');
  const navigate = useNavigate();

  const irrigationOptions = [
    {
      id: 'drip',
      title: 'Precision Sub-Surface Drip',
      desc: 'Pressure-compensating emitter tubing delivering calibrated hydration directly to root horizons.',
      efficiency: '95% Efficiency',
      icon: 'water_drop',
    },
    {
      id: 'pivot',
      title: 'Center Pivot Automation',
      desc: 'Continuous electric drive pivot spans equipped with variable-rate nozzle packs and telemetry.',
      efficiency: '85% Efficiency',
      icon: 'cyclone',
    },
    {
      id: 'sprinkler',
      title: 'Micro-Sprinkler Array',
      desc: 'Overhead micro-emitters tailored for orchard cooling, frost prevention, and canopy humidity control.',
      efficiency: '88% Efficiency',
      icon: 'shower',
    },
    {
      id: 'furrow',
      title: 'Automated Furrow & Surge',
      desc: 'Radio-controlled surge valves optimizing pulse infiltration across graded row crops.',
      efficiency: '78% Efficiency',
      icon: 'waves',
    },
  ];

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#FCF8FB] text-[#1B1B1D] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="AgriPulse Logo" className="h-8 w-auto" />
            <span className="font-semibold text-lg text-[#125238]">AgriPulse Setup</span>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-xs text-[#6E6E73] hover:text-[#1B1B1D] cursor-pointer"
          >
            Skip to Dashboard →
          </button>
        </div>

        {/* Stepper Progress */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-2">
            {['1. Property', '2. Boundaries', '3. Irrigation', '4. Edge Fleet'].map((label, idx) => (
              <span
                key={label}
                className={`text-xs font-medium ${
                  idx + 1 === step
                    ? 'text-[#125238] font-semibold'
                    : idx + 1 < step
                    ? 'text-[#2F6B4F]'
                    : 'text-[#707972]'
                }`}
              >
                {label}
              </span>
            ))}
          </div>
          <div className="h-1.5 w-full bg-[#EAE7EA] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#125238] transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Wizard Card Container */}
        <div className="bg-white rounded-[32px] p-6 sm:p-10 shadow-[0_12px_32px_rgba(0,0,0,0.04)] border border-black/[0.04]">
          {step === 1 && (
            <div>
              <span className="font-label-caps text-[#2F6B4F] mb-1 block">Step 01 of 04</span>
              <h2 className="text-2xl font-normal text-[#1B1B1D] mb-2">Configure Farm Profile</h2>
              <p className="text-xs text-[#6E6E73] mb-6">Enter estate details for geo-climatic calibration.</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#1B1B1D] mb-1">Estate Name</label>
                  <input
                    type="text"
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-[#F6F3F5] text-xs text-[#1B1B1D] border border-black/[0.06] focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#1B1B1D] mb-1">Total Acreage</label>
                  <input
                    type="number"
                    value={acreage}
                    onChange={(e) => setAcreage(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-[#F6F3F5] text-xs text-[#1B1B1D] border border-black/[0.06] focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#1B1B1D] mb-1">Soil Classification</label>
                  <input
                    type="text"
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-[#F6F3F5] text-xs text-[#1B1B1D] border border-black/[0.06] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <span className="font-label-caps text-[#2F6B4F] mb-1 block">Step 02 of 04</span>
              <h2 className="text-2xl font-normal text-[#1B1B1D] mb-2">GIS Field & Parcel Mapping</h2>
              <p className="text-xs text-[#6E6E73] mb-6">4 default telemetry zones have been mapped to your 12.5 acre boundary.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { code: 'Zone A', name: 'North Paddy Field', ac: '4.2 Acres', crop: 'Rice (Sona Masoori)' },
                  { code: 'Zone B', name: 'Cotton Basin', ac: '3.8 Acres', crop: 'Bt-Cotton (RCH-659)' },
                  { code: 'Zone C', name: 'Tomato Polyhouse', ac: '2.5 Acres', crop: 'Tomato (Arka Rakshak)' },
                  { code: 'Zone D', name: 'Orchard Belt', ac: '2.0 Acres', crop: 'Sweet Orange (Mosambi)' },
                ].map((z) => (
                  <div key={z.code} className="p-4 rounded-2xl bg-[#F6F3F5] border border-black/[0.04]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-xs text-[#1B1B1D]">{z.code} • {z.name}</span>
                      <StatusBadge variant="eco">{z.ac}</StatusBadge>
                    </div>
                    <span className="text-[11px] text-[#6E6E73]">{z.crop}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <span className="font-label-caps text-[#2F6B4F] mb-1 block">Step 03 of 04</span>
              <h1 className="text-2xl sm:text-3xl font-normal text-[#1B1B1D] mb-2">
                Select Primary Irrigation Infrastructure
              </h1>
              <p className="text-xs text-[#6E6E73] mb-8">
                Calibrates dynamic flow coefficients, valve cycle sequencing, and automated ET0 deficit replenishment.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {irrigationOptions.map((opt) => {
                  const isSelected = selectedIrrigation === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedIrrigation(opt.id)}
                      className={`p-5 rounded-[22px] border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#E8F3EC]/50 border-[#2F6B4F] shadow-sm'
                          : 'bg-[#FBFBFD] border-black/[0.06] hover:bg-black/5'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center ${isSelected ? 'bg-[#2F6B4F] text-white' : 'bg-black/5 text-[#707972]'}`}>
                          <span className="material-symbols-outlined text-[20px]">{opt.icon}</span>
                        </div>
                        <StatusBadge variant={isSelected ? 'eco' : 'neutral'}>
                          {opt.efficiency}
                        </StatusBadge>
                      </div>
                      <h3 className="text-sm font-medium text-[#1B1B1D] mb-1.5">{opt.title}</h3>
                      <p className="text-xs text-[#6E6E73] leading-relaxed">{opt.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-[#E8F3EC] flex items-center justify-center mx-auto mb-4 text-[#125238]">
                <span className="material-symbols-outlined text-[32px]">sensors</span>
              </div>
              <h2 className="text-2xl font-normal text-[#1B1B1D] mb-2">Ready to Synchronize Edge Fleet</h2>
              <p className="text-xs text-[#6E6E73] max-w-md mx-auto mb-8">
                All 6 wireless probes, weather stations, and solenoid gateways are connected and broadcasting live telemetry.
              </p>
              <StatusBadge variant="optimal" icon="check_circle" className="text-xs py-1 px-4">
                Mesh Network Health: 100% Operational
              </StatusBadge>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-black/[0.04] mt-6">
            {step > 1 ? (
              <Button
                variant="ghost"
                onClick={() => setStep(step - 1)}
              >
                Back
              </Button>
            ) : <div />}

            <Button
              variant="primary"
              size="lg"
              iconRight="arrow_forward"
              onClick={handleNext}
            >
              {step === 4 ? 'Launch Dashboard' : 'Save & Continue'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
