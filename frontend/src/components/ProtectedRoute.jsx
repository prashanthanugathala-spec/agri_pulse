import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FCF8FB] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-[#E8F3EC] flex items-center justify-center animate-pulse mb-4">
          <img src="/logo.svg" alt="AgriPulse" className="h-7 w-auto" />
        </div>
        <div className="text-xs font-medium text-[#1B1B1D]">Verifying estate credentials...</div>
        <div className="text-[11px] text-[#6E6E73] mt-1">Connecting to AgriPulse cloud...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
