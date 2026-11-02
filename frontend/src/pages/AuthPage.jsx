import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

export const AuthPage = () => {
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Determine initial mode based on URL pathname or search params
  const isRegisterInitial = location.pathname === '/register' || searchParams.get('mode') === 'register';
  const [isRegister, setIsRegister] = useState(isRegisterInitial);

  const [email, setEmail] = useState('ravi@agripulse.io');
  const [password, setPassword] = useState('agripulse123');
  const [fullName, setFullName] = useState('Ravi Kumar');
  const [farmName, setFarmName] = useState('Green Valley Farm');
  const [acreage, setAcreage] = useState(12.5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      const destination = location.state?.from?.pathname || '/dashboard';
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  // Sync mode if route changes
  useEffect(() => {
    if (location.pathname === '/register') {
      setIsRegister(true);
    } else if (location.pathname === '/login') {
      setIsRegister(false);
    }
  }, [location.pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isRegister) {
        await register({
          email: email.trim(),
          password,
          fullName: fullName.trim(),
          farmName: farmName.trim(),
          totalAcreage: parseFloat(acreage) || 10.0,
        });
        navigate('/onboarding', { replace: true });
      } else {
        await login({
          email: email.trim(),
          password,
        });
        const destination = location.state?.from?.pathname || '/dashboard';
        navigate(destination, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCF8FB] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <Link to="/" className="inline-flex justify-center mb-3">
          <img src="/logo.svg" alt="AgriPulse Logo" className="h-10 w-auto" />
        </Link>
        <h1 className="text-3xl font-normal text-[#1B1B1D] tracking-tight">
          {isRegister ? 'Register your property.' : 'Welcome back to your land.'}
        </h1>
        <p className="text-xs text-[#6E6E73] mt-2">
          Precision instrumentation for modern enterprise agriculture.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-[28px] shadow-[0_12px_32px_rgba(0,0,0,0.04)] border border-black/[0.04]">
          {/* Tabs */}
          <div className="flex rounded-full bg-[#F0EDEF] p-1 mb-6">
            <button
              type="button"
              onClick={() => { setIsRegister(false); setError(null); }}
              className={`flex-1 py-2 text-xs font-medium rounded-full transition-all cursor-pointer ${
                !isRegister ? 'bg-white text-[#1B1B1D] shadow-xs' : 'text-[#6E6E73] hover:text-[#1B1B1D]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsRegister(true); setError(null); }}
              className={`flex-1 py-2 text-xs font-medium rounded-full transition-all cursor-pointer ${
                isRegister ? 'bg-white text-[#1B1B1D] shadow-xs' : 'text-[#6E6E73] hover:text-[#1B1B1D]'
              }`}
            >
              Register Estate
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-[#FFDAD6]/50 text-[#BA1A1A] text-xs flex items-center justify-between gap-2 animate-in fade-in">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">error</span>
                <span>{error}</span>
              </div>
              <button
                type="button"
                onClick={() => setError(null)}
                className="text-[#BA1A1A] hover:opacity-75 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                <div>
                  <label className="block text-xs font-medium text-[#1B1B1D] mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ravi Kumar"
                    className="w-full h-11 px-4 rounded-xl bg-[#F6F3F5] text-xs text-[#1B1B1D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2F6B4F]/20 border border-black/[0.06]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#1B1B1D] mb-1">Farm / Estate Name</label>
                  <input
                    type="text"
                    required
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    placeholder="e.g. Green Valley Farm"
                    className="w-full h-11 px-4 rounded-xl bg-[#F6F3F5] text-xs text-[#1B1B1D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2F6B4F]/20 border border-black/[0.06]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#1B1B1D] mb-1">Total Acreage</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={acreage}
                    onChange={(e) => setAcreage(e.target.value)}
                    placeholder="12.5"
                    className="w-full h-11 px-4 rounded-xl bg-[#F6F3F5] text-xs text-[#1B1B1D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2F6B4F]/20 border border-black/[0.06]"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-medium text-[#1B1B1D] mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ravi@agripulse.io"
                className="w-full h-11 px-4 rounded-xl bg-[#F6F3F5] text-xs text-[#1B1B1D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2F6B4F]/20 border border-black/[0.06]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1B1B1D] mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 px-4 rounded-xl bg-[#F6F3F5] text-xs text-[#1B1B1D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2F6B4F]/20 border border-black/[0.06]"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-4"
              isLoading={loading}
            >
              {isRegister ? 'Register & Continue' : 'Sign In to Farm'}
            </Button>
          </form>

          {/* Quick Demo Fill */}
          <div className="mt-6 pt-4 border-t border-black/[0.04] text-center flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                setEmail('ravi@agripulse.io');
                setPassword('agripulse123');
                setError(null);
              }}
              className="text-xs text-[#2F6B4F] hover:underline cursor-pointer font-medium"
            >
              Fill Demo Credentials (Ravi Kumar • Green Valley)
            </button>
            <Link to="/" className="text-[11px] text-[#6E6E73] hover:text-[#1B1B1D]">
              ← Return to AgriPulse Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
