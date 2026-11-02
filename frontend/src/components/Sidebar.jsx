import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { path: '/profile', label: 'Farmer Profile', icon: 'badge' },
  { path: '/my-farm', label: 'My Farm & Area', icon: 'map' },
  { path: '/crops', label: 'Crops & Analysis', icon: 'potted_plant' },
  { path: '/soil', label: 'Soil Health', icon: 'layers' },
  { path: '/weather', label: 'Weather', icon: 'air' },
  { path: '/irrigation', label: 'Water Flow & Irrigation', icon: 'water_drop' },
  { path: '/market-prices', label: 'Market Prices', icon: 'storefront' },
  { path: '/farming-techniques', label: 'Farming Techniques', icon: 'agriculture' },
  { path: '/pesticides', label: 'Pesticides & Protection', icon: 'sanitizer' },
  { path: '/gov-schemes', label: 'Government Schemes', icon: 'account_balance' },
  { path: '/pest-and-disease', label: 'Pest Vision Scan', icon: 'pest_control' },
  { path: '/agripulse-ai', label: 'AgriPulse AI', icon: 'auto_awesome' },
  { path: '/analytics', label: 'Analytics', icon: 'monitoring' },
  { path: '/alerts', label: 'Alerts', icon: 'crisis_alert' },
  { path: '/sensors', label: 'Sensors', icon: 'sensors' },
  { path: '/recommendations-and-settings', label: 'Recommendations & Settings', icon: 'tune' },
];

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    onClose?.();
    await logout();
    navigate('/login', { replace: true });
  };

  const displayName = user?.fullName || 'Estate Agronomist';
  const displayFarm = user?.farmName || 'Precision Farm';

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed left-0 top-16 bottom-0 w-64 bg-white z-40 overflow-y-auto shadow-[0_1px_8px_rgba(0,0,0,0.02)] border-r border-black/[0.04] flex flex-col py-4 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-full text-xs transition-all duration-200 ${
                  isActive
                    ? 'bg-[#BCEED1] text-[#002113] font-semibold shadow-xs'
                    : 'text-[#404943] hover:bg-[#EAE7EA] hover:text-[#1B1B1D]'
                }`
              }
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              <span className="tracking-tight">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom Section: Telemetry & User Controls */}
        <div className="px-3 pt-3 border-t border-black/[0.04] space-y-2">
          {/* Gateway telemetry indicator */}
          <div className="bg-[#F6F3F5] rounded-2xl p-2.5 px-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#34C759] animate-pulse" />
              <span className="text-[11px] font-medium text-[#1D1D1F]">Gateway Active</span>
            </div>
            <span className="text-[10px] text-[#707972] font-mono">99.8%</span>
          </div>

          {/* User Profile Pill & Sign Out Button */}
          <div className="bg-white rounded-2xl p-2.5 border border-black/[0.06] flex items-center justify-between gap-2">
            <div
              onClick={() => {
                onClose?.();
                navigate('/profile');
              }}
              className="min-w-0 flex-1 cursor-pointer hover:opacity-80 transition-opacity"
              title="View Farmer Profile"
            >
              <div className="text-xs font-semibold text-[#1B1B1D] truncate">{displayName}</div>
              <div className="text-[10px] text-[#6E6E73] truncate">{displayFarm}</div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-xl hover:bg-[#FFDAD6]/40 text-[#BA1A1A] transition-colors cursor-pointer"
              title="Sign Out"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
