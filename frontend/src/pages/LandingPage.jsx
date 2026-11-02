import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePageEntrance } from '../animations/gsapHelpers';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';

export const LandingPage = () => {
  const pageRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  usePageEntrance(pageRef);

  return (
    <div ref={pageRef} className="min-h-screen bg-[#FCF8FB] text-[#1B1B1D]">
      {/* Top Header / Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/[0.04] transition-all">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="AgriPulse Logo" className="h-9 w-auto" />
            <span className="font-semibold text-xl text-[#125238] tracking-tight">AgriPulse</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#404943]">
            <a href="#solutions" className="hover:text-[#125238] transition-colors">Platform</a>
            <a href="#how-it-works" className="hover:text-[#125238] transition-colors">Systematic Precision</a>
            <a href="#telemetry" className="hover:text-[#125238] transition-colors">Telemetry</a>
            <a href="#impact" className="hover:text-[#125238] transition-colors">Impact</a>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Button
                variant="primary"
                size="md"
                iconRight="arrow_forward"
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard ({user?.fullName ? user.fullName.split(' ')[0] : 'Agronomist'})
              </Button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-[#1B1B1D] px-4 py-2 rounded-full hover:bg-black/5 transition-colors"
                >
                  Sign In
                </Link>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => navigate('/register')}
                >
                  Register Estate
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-24 px-6 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 flex flex-col items-start animate-header">
            <StatusBadge variant="eco" icon="eco" className="mb-6">
              Editorial Agronomic Instrumentation
            </StatusBadge>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#1B1B1D] font-normal tracking-tight leading-[1.1] mb-6">
              Smart Agriculture. <br />
              <span className="text-[#125238] font-medium">Smarter Decisions.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#404943] max-w-xl font-normal leading-relaxed mb-8">
              An enterprise biological management suite blending minimalist industrial design with edge telemetry. Monitor subsoil hydrology, automate precision valves, and diagnose crop pathogens with calibrated computer vision.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Button
                variant="primary"
                size="lg"
                iconRight="arrow_forward"
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
              >
                {isAuthenticated ? 'Open Live Suite' : 'Sign In to Estate'}
              </Button>
              <Button
                variant="secondary"
                size="lg"
                icon="rocket_launch"
                onClick={() => navigate(isAuthenticated ? '/my-farm' : '/register')}
              >
                {isAuthenticated ? 'Manage Parcels' : 'Register New Farm'}
              </Button>
            </div>

            {/* Quick trust metrics */}
            <div className="grid grid-cols-3 gap-6 pt-12 mt-12 border-t border-black/[0.06] w-full max-w-lg">
              <div>
                <div className="font-metric-num text-3xl font-medium text-[#1B1B1D]">18.4%</div>
                <div className="text-xs text-[#6E6E73] mt-0.5">Water Conserved</div>
              </div>
              <div>
                <div className="font-metric-num text-3xl font-medium text-[#1B1B1D]">94.6%</div>
                <div className="text-xs text-[#6E6E73] mt-0.5">Vision Diagnostic Acc.</div>
              </div>
              <div>
                <div className="font-metric-num text-3xl font-medium text-[#1B1B1D]">100%</div>
                <div className="text-xs text-[#6E6E73] mt-0.5">Live IoT Uptime</div>
              </div>
            </div>
          </div>

          {/* Right Hero Telemetry Visual Card */}
          <div className="lg:col-span-6 animate-card">
            <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-black/[0.04] relative">
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-black/[0.04]">
                <div>
                  <span className="font-label-caps text-[#6E6E73]">Live Station Telemetry</span>
                  <h3 className="text-lg font-medium text-[#1B1B1D] mt-0.5">Green Valley Estate • 12.5 Ac</h3>
                </div>
                <StatusBadge variant="optimal" icon="check_circle">
                  All Sensors Online
                </StatusBadge>
              </div>

              {/* 3 mini cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-2xl bg-[#F6F3F5] flex flex-col justify-between">
                  <span className="font-label-caps text-[#6E6E73]">Avg Moisture</span>
                  <div className="font-metric-num text-2xl text-[#1B1B1D] my-1">68%</div>
                  <span className="text-[11px] text-[#2F6B4F] font-medium">+3% Optimal</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#F6F3F5] flex flex-col justify-between">
                  <span className="font-label-caps text-[#6E6E73]">Microclimate</span>
                  <div className="font-metric-num text-2xl text-[#1B1B1D] my-1">29.4°C</div>
                  <span className="text-[11px] text-[#6E6E73]">58% RH • 12 km/h</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#F6F3F5] flex flex-col justify-between">
                  <span className="font-label-caps text-[#6E6E73]">NDVI Index</span>
                  <div className="font-metric-num text-2xl text-[#1B1B1D] my-1">0.78</div>
                  <span className="text-[11px] text-[#34C759] font-medium">Optimal Biomass</span>
                </div>
              </div>

              {/* Sub-Surface Curve SVG */}
              <div className="p-4 rounded-2xl bg-[#F6F3F5] mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-[#1B1B1D]">Sub-surface Soil Moisture Depletion Curve</span>
                  <span className="text-xs text-[#2F6B4F] font-semibold">Active Run</span>
                </div>
                <svg className="w-full h-12 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 24">
                  <path d="M0,18 C20,16 35,22 50,14 C65,7 80,12 100,5" fill="none" stroke="#2F6B4F" strokeLinecap="round" strokeWidth="2.5" />
                  <circle cx="100" cy="5" fill="#2F6B4F" r="3.5" />
                </svg>
              </div>

              {/* Aerial Image Inset with Glass Banner */}
              <div className="rounded-2xl overflow-hidden relative h-48 bg-black/10">
                <img
                  className="w-full h-full object-cover"
                  src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80"
                  alt="Canopy Photosynthetic Density Scan"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                  <div className="flex items-center justify-between w-full text-white">
                    <div>
                      <div className="text-[10px] uppercase font-bold tracking-wider opacity-80">Active Scan Layer</div>
                      <div className="text-xs font-medium">Canopy Photosynthetic Density (High Uniformity)</div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-[11px] bg-white/20 backdrop-blur-md font-medium">
                      Resolution 0.25m²
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Steps to Intelligent Farming */}
      <section id="how-it-works" className="py-20 px-6 max-w-[1400px] mx-auto border-t border-black/[0.04]">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="font-label-caps text-[#2F6B4F] tracking-widest block mb-2">Systematic Precision</span>
          <h2 className="text-3xl sm:text-4xl font-normal text-[#1B1B1D]">Five steps to intelligent farming</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            { step: '01', title: 'Connect', desc: 'Install wireless zero-maintenance IoT probes across canopy and subsoil.' },
            { step: '02', title: 'Monitor', desc: 'Continuous real-time stream of soil moisture, micro-climate, and sap density.' },
            { step: '03', title: 'Analyze', desc: 'Machine learning agronomy models correlate regional patterns with local biology.' },
            { step: '04', title: 'Recommend', desc: 'Actionable, calibrated irrigation intervals and precision nutrient dosages.' },
            { step: '05', title: 'Improve', desc: 'Demonstrably higher harvest quality and tonnage with lower input overhead.' },
          ].map((item) => (
            <div key={item.step} className="bg-white rounded-2xl p-6 border border-black/[0.04] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-[#E8F3EC] flex items-center justify-center font-metric-num text-lg font-semibold text-[#125238] mb-4">
                {item.step}
              </div>
              <h3 className="text-lg font-medium text-[#1B1B1D] mb-2">{item.title}</h3>
              <p className="text-xs text-[#6E6E73] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-20 px-6 max-w-[1400px] mx-auto">
        <div className="bg-[#125238] rounded-[32px] p-8 sm:p-14 text-white text-center flex flex-col items-center">
          <span className="font-label-caps text-[#A1D1B6] tracking-widest mb-3">Enterprise Biological Instrumentation</span>
          <h2 className="text-3xl sm:text-4xl font-normal tracking-tight max-w-2xl mb-6">
            Empower your agronomic director with real-time field telemetry.
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
            >
              {isAuthenticated ? 'Open Dashboard' : 'Sign In to Account'}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => navigate(isAuthenticated ? '/my-farm' : '/register')}
            >
              {isAuthenticated ? 'View Boundaries' : 'Register Estate'}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
