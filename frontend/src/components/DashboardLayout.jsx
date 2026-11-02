import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import CommandPalette from './CommandPalette';
import VoiceAssistantWidget from './VoiceAssistantWidget';
import { usePageEntrance } from '../animations/gsapHelpers';

export const DashboardLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const location = useLocation();
  const pageContainerRef = useRef(null);

  // Trigger smooth entrance animation on route change
  usePageEntrance(pageContainerRef, [location.pathname]);

  // Global keydown for ⌘K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#FCF8FB] text-[#1B1B1D]">
      {/* Top Navbar */}
      <Navbar
        onOpenCommand={() => setCommandPaletteOpen(true)}
        onToggleMobileSidebar={() => setMobileSidebarOpen((prev) => !prev)}
      />

      {/* Left Sidebar */}
      <Sidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 pt-16 min-h-screen flex flex-col">
        <main
          ref={pageContainerRef}
          className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto"
        >
          <Outlet />
        </main>
      </div>

      {/* Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      {/* Persistent Groq Voice Assistant Hub */}
      <VoiceAssistantWidget />
    </div>
  );
};

export default DashboardLayout;
