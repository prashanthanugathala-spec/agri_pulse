import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const quickLinks = [
  { title: 'Dashboard', path: '/dashboard', icon: 'dashboard', category: 'Navigation' },
  { title: 'Farmer Profile & Digital ID Pass', path: '/profile', icon: 'badge', category: 'Profile' },
  { title: 'My Farm & Area Demarcation', path: '/my-farm', icon: 'map', category: 'Navigation' },
  { title: 'Crop Portfolio & Deep Analysis', path: '/crops', icon: 'potted_plant', category: 'Navigation' },
  { title: 'Soil Health & Vitality', path: '/soil', icon: 'layers', category: 'Navigation' },
  { title: 'Weather & Microclimate', path: '/weather', icon: 'air', category: 'Navigation' },
  { title: 'Water Flow & Precision Irrigation', path: '/irrigation', icon: 'water_drop', category: 'Navigation' },
  { title: 'Market Prices & Mandi Rates', path: '/market-prices', icon: 'storefront', category: 'Commerce' },
  { title: 'Different Types of Farming Techniques', path: '/farming-techniques', icon: 'agriculture', category: 'Agronomy' },
  { title: 'Pesticides & Dosage Calculator', path: '/pesticides', icon: 'sanitizer', category: 'Crop Protection' },
  { title: 'Government Schemes & Subsidies', path: '/gov-schemes', icon: 'account_balance', category: 'Schemes & Grants' },
  { title: 'Pest Vision Pathology Diagnostic', path: '/pest-and-disease', icon: 'pest_control', category: 'Navigation' },
  { title: 'AgriPulse AI Agronomist', path: '/agripulse-ai', icon: 'auto_awesome', category: 'Navigation' },
  { title: 'Analytics & Yield Intelligence', path: '/analytics', icon: 'monitoring', category: 'Navigation' },
  { title: 'Farm Alerts & Incidents', path: '/alerts', icon: 'crisis_alert', category: 'Navigation' },
  { title: 'Sensors & IoT Gateway', path: '/sensors', icon: 'sensors', category: 'Navigation' },
  { title: 'Recommendations & Settings', path: '/recommendations-and-settings', icon: 'tune', category: 'Navigation' },
  { title: 'Onboarding Wizard', path: '/onboarding', icon: 'rocket_launch', category: 'Workspace' },
  { title: 'Landing Page', path: '/', icon: 'home', category: 'Public' },
];

export const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filteredItems = quickLinks.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
      } else if (e.key === 'Enter' && filteredItems[selectedIndex]) {
        e.preventDefault();
        navigate(filteredItems[selectedIndex].path);
        onClose();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, navigate, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4">
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl bg-white rounded-[24px] shadow-[0_25px_60px_rgba(0,0,0,0.18)] border border-black/[0.06] overflow-hidden z-10">
        <div className="flex items-center px-4 py-3 border-b border-black/[0.06]">
          <span className="material-symbols-outlined text-[#707972] text-[22px] mr-3">
            search
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a screen, parcel, or crop name..."
            className="w-full bg-transparent text-sm text-[#1D1D1F] placeholder-[#707972] focus:outline-none"
          />
          <kbd className="px-2 py-0.5 text-[10px] font-label-caps text-[#6E6E73] bg-[#F0EDEF] rounded">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {filteredItems.length === 0 ? (
            <div className="p-6 text-center text-xs text-[#6E6E73]">
              No matches found for "{query}"
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer text-xs transition-colors ${
                    isSelected
                      ? 'bg-[#E8F3EC] text-[#2F6B4F] font-medium'
                      : 'text-[#1D1D1F] hover:bg-black/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[18px]">
                      {item.icon}
                    </span>
                    <span>{item.title}</span>
                  </div>
                  <span className="text-[10px] text-[#6E6E73] uppercase tracking-wider font-semibold">
                    {item.category}
                  </span>
                </div>
              );
            })
          )}
        </div>

        <div className="px-4 py-2 bg-[#F6F3F5] text-[11px] text-[#6E6E73] flex items-center justify-between border-t border-black/[0.04]">
          <span>Use ↑↓ arrows to navigate</span>
          <span>Press Enter to select</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
