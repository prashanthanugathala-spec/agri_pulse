import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ onOpenCommand, onToggleMobileSidebar, alertCount = 2 }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setDropdownOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate('/login', { replace: true });
  };

  const displayName = user?.fullName || 'Estate Agronomist';
  const displayFarm = user?.farmName || 'Precision Farm';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-white/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.03)] border-b border-black/[0.04]">
      <div className="h-16 w-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger + Logo */}
        <div className="flex items-center gap-3 min-w-[200px] lg:min-w-[240px]">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-full hover:bg-black/5 text-[#1D1D1F] cursor-pointer"
            aria-label="Toggle Navigation"
          >
            <span className="material-symbols-outlined text-[22px]">menu</span>
          </button>

          <Link to="/" className="flex items-center gap-2.5">
            <img src="/logo.svg" alt="AgriPulse Logo" className="h-8 w-auto object-contain" />
            <span className="font-semibold text-lg text-[#125238] tracking-tight">AgriPulse</span>
          </Link>
        </div>

        {/* Center: Search / Command Palette Bar */}
        <div className="flex-1 max-w-md hidden md:flex items-center">
          <div
            onClick={onOpenCommand}
            className="relative w-full cursor-pointer group"
          >
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#707972] text-[18px]">
              search
            </span>
            <input
              type="text"
              readOnly
              placeholder="Search fields, crops, alerts, diagnostics..."
              className="w-full h-9 pl-9 pr-12 rounded-full bg-[#F6F3F5] text-xs font-normal text-[#1B1B1D] placeholder:text-[#707972] group-hover:bg-[#F0EDEF] cursor-pointer transition-colors focus:outline-none"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-label-caps text-[#6E6E73] bg-[#E4E2E4] rounded">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right: Voice Assistant, Weather Widget, Notification Icon, User Profile */}
        <div className="flex items-center gap-2.5">
          {/* AgriVoice Groq Assistant Trigger */}
          <button
            onClick={() => {
              window.dispatchEvent(new KeyboardEvent('keydown', { key: 'v' }));
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#125238]/10 to-[#4ECB71]/15 hover:from-[#125238]/20 hover:to-[#4ECB71]/25 border border-[#2F6B4F]/25 text-[#125238] transition-all cursor-pointer group"
            title="Open AgriVoice Assistant (Press V)"
          >
            <span className="material-symbols-outlined text-[16px] text-[#125238] group-hover:scale-110 transition-transform">
              mic
            </span>
            <span className="text-xs font-semibold hidden sm:inline">Voice AI</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ECB71] animate-pulse" />
          </button>

          {/* Microclimate Live Indicator */}
          <Link
            to="/weather"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F6F3F5] text-xs text-[#404943] hover:bg-[#F0EDEF] transition-colors"
          >
            <span className="material-symbols-outlined text-[16px] text-[#3A6751]">
              wb_sunny
            </span>
            <span className="font-medium">Hyderabad, Telangana • 29°C Clear</span>
          </Link>

          {/* Alerts Trigger */}
          <button
            onClick={() => navigate('/alerts')}
            className="relative w-9 h-9 rounded-full flex items-center justify-center text-[#404943] hover:bg-[#EAE7EA] hover:text-[#1B1B1D] transition-colors cursor-pointer"
            title="Active Alerts"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {alertCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#BA1A1A] animate-ping" />
            )}
            {alertCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#BA1A1A]" />
            )}
          </button>

          {/* User Profile Pill with Interactive Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 pl-1 cursor-pointer p-1.5 rounded-full hover:bg-black/5 transition-colors"
              title="User Account"
            >
              <div className="text-right hidden sm:block">
                <div className="text-xs font-medium text-[#1B1B1D] leading-none">{displayName}</div>
                <div className="text-[10px] text-[#404943] leading-none mt-1">{displayFarm}</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#125238] flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.08)] text-white font-medium text-xs">
                {initial}
              </div>
              <span className="material-symbols-outlined text-[#707972] text-[16px] hidden sm:block">
                {dropdownOpen ? 'expand_less' : 'expand_more'}
              </span>
            </div>

            {/* Account Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-black/[0.06] py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-3 border-b border-black/[0.04]">
                  <div className="text-xs font-semibold text-[#1B1B1D]">{displayName}</div>
                  <div className="text-[11px] text-[#6E6E73] truncate">{user?.email || 'authenticated'}</div>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#E8F3EC] text-[#2F6B4F] text-[10px] font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2F6B4F]" />
                    {user?.role || 'AGRONOMIST'}
                  </div>
                </div>

                <div className="px-4 py-2 text-[11px] text-[#6E6E73] border-b border-black/[0.04] bg-[#FBFBFD]">
                  <div className="font-medium text-[#1B1B1D]">{displayFarm}</div>
                  <div>{user?.totalAcreage ? `${user.totalAcreage} Acres Registered` : 'Precision Agriculture Estate'}</div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate('/profile');
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs text-[#125238] font-semibold bg-[#E8F3EC]/50 hover:bg-[#E8F3EC] flex items-center gap-2.5 cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#2F6B4F]">badge</span>
                    Farmer Profile & Digital Pass
                  </button>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate('/recommendations-and-settings');
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-[#1B1B1D] hover:bg-[#F6F3F5] flex items-center gap-2.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#707972]">tune</span>
                    Recommendations & Settings
                  </button>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate('/my-farm');
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-[#1B1B1D] hover:bg-[#F6F3F5] flex items-center gap-2.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#707972]">map</span>
                    My Farm Boundaries
                  </button>
                </div>

                <div className="border-t border-black/[0.04] pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-xs text-[#BA1A1A] hover:bg-[#FFDAD6]/30 flex items-center gap-2.5 cursor-pointer font-medium"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    Sign Out of Estate
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
