import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { farmerProfileService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { LoadingState, ErrorState } from '../components/FeedbackStates';

export const FarmerProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'land' | 'crops_machinery' | 'schemes'
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [idCardModalOpen, setIdCardModalOpen] = useState(false);
  const [copiedUid, setCopiedUid] = useState(false);

  // Edit form state
  const [formData, setFormData] = useState({});

  const containerRef = useRef(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await farmerProfileService.getProfile(user?.id);
      setProfile(data);
      setFormData(data);
    } catch (err) {
      setError(err.message || 'Failed to retrieve farmer profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user?.id]);

  // GSAP Entrance
  useEffect(() => {
    if (loading || error || !profile) return;
    const ctx = gsap.context(() => {
      gsap.from('.profile-fade-in', {
        opacity: 0,
        y: 18,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, [loading, error, profile]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopyUid = () => {
    if (profile?.farmerUid) {
      navigator.clipboard.writeText(profile.farmerUid);
      setCopiedUid(true);
      showToast(`Copied Farmer UID ${profile.farmerUid} to clipboard`);
      setTimeout(() => setCopiedUid(false), 2000);
    }
  };

  const handleOpenEdit = () => {
    setFormData({
      ...profile,
      certificationsStr: profile?.certifications?.join('\n') || '',
      machineryStr: profile?.machineryInventory?.join('\n') || '',
      cropsStr: profile?.primaryCrops?.join('\n') || '',
    });
    setEditModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        ...formData,
        totalAcreage: parseFloat(formData.totalAcreage) || profile.totalAcreage,
        ownedAcreage: parseFloat(formData.ownedAcreage) || profile.ownedAcreage,
        leasedAcreage: parseFloat(formData.leasedAcreage) || profile.leasedAcreage,
        experienceYears: parseInt(formData.experienceYears, 10) || profile.experienceYears,
        kccLimit: parseFloat(formData.kccLimit) || profile.kccLimit,
        certifications: formData.certificationsStr
          ? formData.certificationsStr.split('\n').map((s) => s.trim()).filter(Boolean)
          : profile.certifications,
        machineryInventory: formData.machineryStr
          ? formData.machineryStr.split('\n').map((s) => s.trim()).filter(Boolean)
          : profile.machineryInventory,
        primaryCrops: formData.cropsStr
          ? formData.cropsStr.split('\n').map((s) => s.trim()).filter(Boolean)
          : profile.primaryCrops,
      };

      const updated = await farmerProfileService.updateProfile(payload, user?.id);
      setProfile(updated);
      setEditModalOpen(false);
      showToast('Farmer profile updated and synchronized successfully!');

      // Synchronize AuthContext
      if (updateUser) {
        updateUser({
          fullName: updated.fullName,
          farmName: updated.farmName,
          phone: updated.phone,
          totalAcreage: updated.totalAcreage,
        });
      }
    } catch (err) {
      alert('Error updating profile: ' + (err.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState message="Loading Agronomist & Farmer Profile Registry..." />;
  if (error) return <ErrorState message={error} onRetry={fetchProfile} />;
  if (!profile) return null;

  return (
    <div ref={containerRef} className="max-w-6xl mx-auto flex flex-col gap-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#125238] text-white px-5 py-3 rounded-full text-xs font-medium shadow-xl flex items-center gap-2.5 animate-in fade-in duration-200">
          <span className="material-symbols-outlined text-[18px] text-[#4ECB71]">verified</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Profile Banner */}
      <div className="profile-fade-in relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#125238] via-[#1a6345] to-[#257551] text-white p-6 sm:p-8 lg:p-10 shadow-[0_10px_35px_rgba(18,82,56,0.18)]">
        {/* Subtle decorative background topography */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Avatar & Core Bio */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              <img
                src={profile.avatarUrl || 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&w=400&q=80'}
                alt={profile.fullName}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white/20 shadow-lg bg-[#2F6B4F]"
              />
              <span
                className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-[#4ECB71] border-2 border-white flex items-center justify-center text-white"
                title="Verified Active Farmer"
              >
                <span className="material-symbols-outlined text-[14px] font-bold">check</span>
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                  {profile.fullName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-white text-[11px] font-medium backdrop-blur-md flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4ECB71]" />
                  {profile.primaryOccupation || 'Lead Agronomist'}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-white/80 flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-[#4ECB71]">nature_people</span>
                  {profile.farmName}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-[#4ECB71]">location_on</span>
                  {profile.district}, {profile.state}
                </span>
              </p>

              {/* UID Copy Pill */}
              <div className="pt-1 flex items-center gap-2">
                <button
                  onClick={handleCopyUid}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/25 hover:bg-black/40 text-[11px] font-mono text-[#D7F5E1] border border-white/10 transition-colors cursor-pointer group"
                  title="Click to copy UID"
                >
                  <span className="material-symbols-outlined text-[13px] text-[#4ECB71]">badge</span>
                  <span>{profile.farmerUid}</span>
                  <span className="material-symbols-outlined text-[13px] opacity-70 group-hover:opacity-100">
                    {copiedUid ? 'done' : 'content_copy'}
                  </span>
                </button>
                <span className="text-[11px] text-white/60">
                  {profile.experienceYears} Years Agronomic Experience
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center">
            <button
              onClick={() => setIdCardModalOpen(true)}
              className="px-4 py-2.5 rounded-full bg-white text-[#125238] hover:bg-[#F2FAF5] font-semibold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">credit_card</span>
              <span>Digital ID Pass</span>
            </button>

            <button
              onClick={handleOpenEdit}
              className="px-4 py-2.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white font-medium text-xs backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
              <span>Edit Profile</span>
            </button>

            <button
              onClick={() => window.print()}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center transition-all cursor-pointer"
              title="Print Agronomist Dossier"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
            </button>
          </div>
        </div>

        {/* Verified Badges Banner */}
        <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-medium text-white/70 mr-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-[#4ECB71]">verified_user</span>
            Accreditation Badges:
          </span>
          {profile.verifiedBadges?.map((badge, idx) => (
            <span
              key={idx}
              className="px-2.5 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-medium border border-white/10 flex items-center gap-1 backdrop-blur-xs"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ECB71]" />
              {badge}
            </span>
          ))}
        </div>
      </div>

      {/* 4-KPI Metric Matrix */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="profile-fade-in bg-white rounded-3xl p-5 border border-black/[0.05] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-[#707972] mb-2">
            <span className="text-xs font-medium">Total Land Holding</span>
            <div className="w-8 h-8 rounded-full bg-[#E8F3EC] text-[#2F6B4F] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">landscape</span>
            </div>
          </div>
          <div className="text-2xl font-semibold text-[#1B1B1D] tracking-tight">
            {profile.totalAcreage} <span className="text-xs font-normal text-[#707972]">Acres</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-[#6E6E73]">
            <span>Owned: {profile.ownedAcreage} Ac</span>
            <span>Leased: {profile.leasedAcreage} Ac</span>
          </div>
          <div className="w-full bg-[#EAE7EA] h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-[#2F6B4F] h-full rounded-full"
              style={{ width: `${Math.min(100, ((profile.ownedAcreage || 0) / (profile.totalAcreage || 1)) * 100)}%` }}
            />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="profile-fade-in bg-white rounded-3xl p-5 border border-black/[0.05] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-[#707972] mb-2">
            <span className="text-xs font-medium">Active Parcels</span>
            <div className="w-8 h-8 rounded-full bg-[#E8F3EC] text-[#2F6B4F] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">crop_free</span>
            </div>
          </div>
          <div className="text-2xl font-semibold text-[#1B1B1D] tracking-tight">
            {profile.activeParcelsCount || 4} <span className="text-xs font-normal text-[#707972]">Zones</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-[#6E6E73]">
            <span className="text-[#2F6B4F] font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34C759]" /> 100% Monitored
            </span>
            <span>IoT Probes Active</span>
          </div>
          <div className="w-full bg-[#EAE7EA] h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-[#34C759] h-full rounded-full" style={{ width: '100%' }} />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="profile-fade-in bg-white rounded-3xl p-5 border border-black/[0.05] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-[#707972] mb-2">
            <span className="text-xs font-medium">KCC Credit Limit</span>
            <div className="w-8 h-8 rounded-full bg-[#E8F3EC] text-[#2F6B4F] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
            </div>
          </div>
          <div className="text-2xl font-semibold text-[#1B1B1D] tracking-tight">
            ₹{((profile.kccLimit || 350000) / 100000).toFixed(2)} <span className="text-xs font-normal text-[#707972]">Lakh</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-[#6E6E73]">
            <span className="text-[#34C759] font-medium">KCC Active</span>
            <span>Subsidized 4% ROI</span>
          </div>
          <div className="w-full bg-[#EAE7EA] h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-[#007AFF] h-full rounded-full" style={{ width: '85%' }} />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="profile-fade-in bg-white rounded-3xl p-5 border border-black/[0.05] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-[#707972] mb-2">
            <span className="text-xs font-medium">Agronomic Vitality</span>
            <div className="w-8 h-8 rounded-full bg-[#E8F3EC] text-[#2F6B4F] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">eco</span>
            </div>
          </div>
          <div className="text-2xl font-semibold text-[#1B1B1D] tracking-tight">
            {profile.vitalityScore || 92}% <span className="text-xs font-normal text-[#34C759]">Optimal</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-[#6E6E73]">
            <span>Water Saved: {profile.waterSavedPercentage || 24}%</span>
            <span>SHC Certified</span>
          </div>
          <div className="w-full bg-[#EAE7EA] h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-[#2F6B4F] h-full rounded-full" style={{ width: `${profile.vitalityScore || 92}%` }} />
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="profile-fade-in flex items-center gap-2 border-b border-black/[0.06] pb-1 overflow-x-auto">
        {[
          { id: 'overview', label: 'Identity & Details', icon: 'person' },
          { id: 'land', label: 'Land & Infrastructure', icon: 'landscape' },
          { id: 'crops_machinery', label: 'Crops & Machinery Fleet', icon: 'agriculture' },
          { id: 'schemes', label: 'Schemes & KCC Registry', icon: 'account_balance' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#125238] text-white shadow-xs'
                : 'text-[#5C645E] hover:bg-black/5 hover:text-[#1B1B1D]'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab 1: Identity & Personal Details */}
      {activeTab === 'overview' && (
        <div className="profile-fade-in grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card: Personal Contact & Background */}
          <Card className="flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.04]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#E8F3EC] text-[#2F6B4F] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">contact_page</span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#1B1B1D]">Farmer Contact & Particulars</h3>
                  <p className="text-[11px] text-[#707972]">Primary identity and digital communication channels</p>
                </div>
              </div>
              <StatusBadge variant="eco">Verified</StatusBadge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-[#F8F7F8] p-3 rounded-2xl">
                <span className="text-[10px] text-[#707972] block">Full Name</span>
                <span className="font-semibold text-[#1B1B1D] text-sm mt-0.5 block">{profile.fullName}</span>
              </div>
              <div className="bg-[#F8F7F8] p-3 rounded-2xl">
                <span className="text-[10px] text-[#707972] block">Mobile Phone</span>
                <span className="font-semibold text-[#1B1B1D] text-sm mt-0.5 block">{profile.phone || '+91 98490 12345'}</span>
              </div>
              <div className="bg-[#F8F7F8] p-3 rounded-2xl">
                <span className="text-[10px] text-[#707972] block">Email Address</span>
                <span className="font-semibold text-[#1B1B1D] mt-0.5 block truncate">{profile.email}</span>
              </div>
              <div className="bg-[#F8F7F8] p-3 rounded-2xl">
                <span className="text-[10px] text-[#707972] block">Languages Spoken</span>
                <span className="font-semibold text-[#1B1B1D] mt-0.5 block">{profile.preferredLanguage}</span>
              </div>
              <div className="bg-[#F8F7F8] p-3 rounded-2xl">
                <span className="text-[10px] text-[#707972] block">Education Level</span>
                <span className="font-semibold text-[#1B1B1D] mt-0.5 block">{profile.educationLevel}</span>
              </div>
              <div className="bg-[#F8F7F8] p-3 rounded-2xl">
                <span className="text-[10px] text-[#707972] block">Farming Experience</span>
                <span className="font-semibold text-[#1B1B1D] mt-0.5 block">{profile.experienceYears} Years</span>
              </div>
            </div>

            <div className="mt-1 p-3 rounded-2xl bg-[#FFF9E6] border border-[#FFE7A3] text-xs">
              <div className="flex items-center gap-1.5 text-[#B25E00] font-medium mb-1">
                <span className="material-symbols-outlined text-[16px]">emergency</span>
                <span>Emergency Contact</span>
              </div>
              <p className="text-[#7A4B00]">{profile.emergencyContact}</p>
            </div>
          </Card>

          {/* Card: Registered Address & Agro-Climatic Zone */}
          <Card className="flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.04]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#E8F3EC] text-[#2F6B4F] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">pin_drop</span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#1B1B1D]">Registered Address & Agro-Zone</h3>
                  <p className="text-[11px] text-[#707972]">Geographic location mapped to state land records</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-black/5 text-[10px] font-mono text-[#5C645E]">
                PIN: {profile.pincode}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#F8F7F8] p-3.5 rounded-2xl flex items-start gap-3">
                <span className="material-symbols-outlined text-[#2F6B4F] text-[20px] mt-0.5">home</span>
                <div>
                  <span className="text-[10px] text-[#707972] uppercase font-semibold">Village & Mandal</span>
                  <p className="font-medium text-[#1B1B1D] text-sm mt-0.5">{profile.villageMandal}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#F8F7F8] p-3 rounded-2xl">
                  <span className="text-[10px] text-[#707972] block">District</span>
                  <span className="font-semibold text-[#1B1B1D] text-sm mt-0.5 block">{profile.district}</span>
                </div>
                <div className="bg-[#F8F7F8] p-3 rounded-2xl">
                  <span className="text-[10px] text-[#707972] block">State</span>
                  <span className="font-semibold text-[#1B1B1D] text-sm mt-0.5 block">{profile.state}</span>
                </div>
              </div>

              <div className="bg-[#F8F7F8] p-3.5 rounded-2xl">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-[#707972] uppercase font-semibold">Agro-Climatic Zone</span>
                  <span className="text-[10px] font-medium text-[#2F6B4F]">Zone X: Southern Plateau</span>
                </div>
                <p className="text-[11px] text-[#404943] leading-relaxed">
                  Semi-arid tropical region characterized by dry summers and moderate monsoon rainfall (750-900mm annual). High solar irradiance makes it ideal for solar pump & precision drip cultivation.
                </p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#E8F3EC]/50 border border-[#2F6B4F]/10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#34C759] animate-pulse" />
                  <span className="text-xs font-medium text-[#125238]">AgriStack Digital Registry Linked</span>
                </div>
                <span className="text-[10px] text-[#2F6B4F] font-mono">KYC Level 3</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 2: Land & Infrastructure */}
      {activeTab === 'land' && (
        <div className="profile-fade-in grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card: Land Holding & Survey Particulars */}
          <Card className="flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.04]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#E8F3EC] text-[#2F6B4F] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">terrain</span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#1B1B1D]">Land Parcels & Cadastral Survey</h3>
                  <p className="text-[11px] text-[#707972]">Official Survey / Khasra demarcation records</p>
                </div>
              </div>
              <StatusBadge variant="eco">12.5 Acres</StatusBadge>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#F8F7F8] p-3.5 rounded-2xl">
                <span className="text-[10px] text-[#707972] uppercase font-semibold block">Cadastral Survey Numbers</span>
                <span className="font-mono font-semibold text-[#1B1B1D] text-sm mt-1 block tracking-wide">
                  {profile.surveyNumbers}
                </span>
                <span className="text-[10px] text-[#707972] mt-1 block">Registered in Dharani / RoR Land Records Portal</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#F8F7F8] p-3 rounded-2xl text-center">
                  <span className="text-[10px] text-[#707972] block">Total Land</span>
                  <span className="text-base font-semibold text-[#1B1B1D] mt-1 block">{profile.totalAcreage} Ac</span>
                </div>
                <div className="bg-[#F8F7F8] p-3 rounded-2xl text-center">
                  <span className="text-[10px] text-[#707972] block">Self-Owned</span>
                  <span className="text-base font-semibold text-[#2F6B4F] mt-1 block">{profile.ownedAcreage} Ac</span>
                </div>
                <div className="bg-[#F8F7F8] p-3 rounded-2xl text-center">
                  <span className="text-[10px] text-[#707972] block">Leased-In</span>
                  <span className="text-base font-semibold text-[#D97706] mt-1 block">{profile.leasedAcreage} Ac</span>
                </div>
              </div>

              <div className="bg-[#F8F7F8] p-3.5 rounded-2xl">
                <span className="text-[10px] text-[#707972] uppercase font-semibold block mb-1">Soil Classification</span>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#8B4513] text-[18px]">layers</span>
                  <span className="font-medium text-[#1B1B1D]">{profile.soilType}</span>
                </div>
                <p className="text-[10px] text-[#707972] mt-1">
                  Optimal drainage capacity, organic matter at 2.4%, pH 6.8 buffered.
                </p>
              </div>
            </div>
          </Card>

          {/* Card: Irrigation & Water Infrastructure */}
          <Card className="flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.04]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#E8F3EC] text-[#2F6B4F] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">water_drop</span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#1B1B1D]">Water Sources & Edge Automation</h3>
                  <p className="text-[11px] text-[#707972]">Pump assets, solar micro-grid, and automated valves</p>
                </div>
              </div>
              <StatusBadge variant="optimal">Solar Powered</StatusBadge>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#F8F7F8] p-3.5 rounded-2xl">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-[#007AFF] text-[18px]">waves</span>
                  <span className="text-[10px] text-[#707972] uppercase font-semibold">Primary Water Resources</span>
                </div>
                <p className="font-medium text-[#1B1B1D] text-sm">{profile.waterSource}</p>
                <p className="text-[10px] text-[#707972] mt-1">Groundwater recharge pits operational since 2023.</p>
              </div>

              <div className="bg-[#F8F7F8] p-3.5 rounded-2xl">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-[#2F6B4F] text-[18px]">valve</span>
                  <span className="text-[10px] text-[#707972] uppercase font-semibold">Irrigation Methodology</span>
                </div>
                <p className="font-medium text-[#1B1B1D] text-sm">{profile.primaryIrrigation}</p>
                <p className="text-[10px] text-[#707972] mt-1">Integrated with AgriPulse IoT solenoid automation controllers.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#E8F3EC] to-[#D5EDE0] flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#125238]">Annual Water Efficiency</div>
                  <div className="text-[11px] text-[#2F6B4F] mt-0.5">24% conserved relative to flood baseline</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#125238] font-bold text-xs shadow-xs">
                  A+
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 3: Crops & Machinery Inventory */}
      {activeTab === 'crops_machinery' && (
        <div className="profile-fade-in grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card: Current Crop Portfolio */}
          <Card className="flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.04]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#E8F3EC] text-[#2F6B4F] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">potted_plant</span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#1B1B1D]">Current Season Cropping Portfolio</h3>
                  <p className="text-[11px] text-[#707972]">Kharif 2026 & Perennial parcel allocations</p>
                </div>
              </div>
              <span className="text-xs font-medium text-[#2F6B4F]">4 Cultivars</span>
            </div>

            <div className="space-y-2.5">
              {profile.primaryCrops?.map((crop, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-[#F8F7F8] hover:bg-[#F0EDEF] transition-colors flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#E8F3EC] text-[#2F6B4F] flex items-center justify-center font-bold text-[11px]">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-[#1B1B1D]">{crop}</span>
                  </div>
                  <span className="material-symbols-outlined text-[#707972] text-[16px]">arrow_forward</span>
                </div>
              ))}
            </div>

            <div className="mt-2 pt-3 border-t border-black/[0.04] flex items-center justify-between text-xs text-[#707972]">
              <span>Farming Methodology:</span>
              <span className="font-semibold text-[#125238]">{profile.farmingType}</span>
            </div>
          </Card>

          {/* Card: Machinery Fleet & Certifications */}
          <Card className="flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.04]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#E8F3EC] text-[#2F6B4F] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">precision_manufacturing</span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#1B1B1D]">Machinery & Equipment Fleet</h3>
                  <p className="text-[11px] text-[#707972]">Modern mechanization and IoT edge instrumentation</p>
                </div>
              </div>
              <StatusBadge variant="eco">5 Assets</StatusBadge>
            </div>

            <div className="space-y-2.5">
              {profile.machineryInventory?.map((mach, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-[#F8F7F8] flex items-center gap-3 text-xs"
                >
                  <span className="material-symbols-outlined text-[#2F6B4F] text-[18px]">
                    {idx === 0 ? 'agriculture' : idx === 1 ? 'flight' : 'sensors'}
                  </span>
                  <span className="font-medium text-[#1B1B1D]">{mach}</span>
                </div>
              ))}
            </div>

            {/* Certifications section */}
            <div className="mt-3 pt-4 border-t border-black/[0.04] space-y-2">
              <h4 className="text-xs font-semibold text-[#1B1B1D] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#34C759]">verified</span>
                Certified Accreditations
              </h4>
              <div className="space-y-1.5">
                {profile.certifications?.map((cert, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[11px] text-[#404943]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2F6B4F]" />
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 4: Schemes & Banking Registry */}
      {activeTab === 'schemes' && (
        <div className="profile-fade-in grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card: PM-KISAN & KCC particulars */}
          <Card className="flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.04]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#E8F3EC] text-[#2F6B4F] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">account_balance</span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#1B1B1D]">PM-KISAN & Financial Integration</h3>
                  <p className="text-[11px] text-[#707972]">Direct Benefit Transfer (DBT) and credit linkage</p>
                </div>
              </div>
              <StatusBadge variant="optimal">DBT Linked</StatusBadge>
            </div>

            <div className="space-y-3 text-xs">
              {/* PM-KISAN */}
              <div className="bg-[#F8F7F8] p-3.5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#707972] uppercase font-semibold">PM-KISAN Farmer ID</span>
                  <div className="font-mono font-semibold text-[#1B1B1D] text-sm mt-0.5">{profile.pmKisanId}</div>
                  <div className="text-[10px] text-[#2F6B4F] mt-0.5 font-medium">17th Installment Credited Successfully</div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#34C759]/15 text-[#2A9D49] font-medium text-[11px]">
                  {profile.pmKisanStatus}
                </span>
              </div>

              {/* KCC */}
              <div className="bg-[#F8F7F8] p-3.5 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#707972] uppercase font-semibold">Kisan Credit Card (KCC)</span>
                    <div className="font-mono font-semibold text-[#1B1B1D] text-sm mt-0.5">{profile.kccNumber}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#007AFF]/10 text-[#007AFF] font-medium text-[11px]">
                    Active Card
                  </span>
                </div>
                <div className="pt-2 border-t border-black/[0.04] flex items-center justify-between">
                  <span className="text-[11px] text-[#707972]">Sanctioned Credit Limit:</span>
                  <span className="font-semibold text-sm text-[#1B1B1D]">₹{profile.kccLimit?.toLocaleString()}</span>
                </div>
                <div className="text-[10px] text-[#6E6E73]">
                  Issuing Bank: <span className="font-medium text-[#1B1B1D]">{profile.kccBank}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Card: Soil Health Card & PMFBY Crop Insurance */}
          <Card className="flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.04]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#E8F3EC] text-[#2F6B4F] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">security</span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#1B1B1D]">Soil Health Card & Crop Insurance</h3>
                  <p className="text-[11px] text-[#707972]">Statutory laboratory cards and climate risk underwriting</p>
                </div>
              </div>
              <StatusBadge variant="eco">Optimal</StatusBadge>
            </div>

            <div className="space-y-3 text-xs">
              {/* Soil Health Card */}
              <div className="bg-[#F8F7F8] p-3.5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#707972] uppercase font-semibold">Soil Health Card (SHC)</span>
                  <div className="font-mono font-semibold text-[#1B1B1D] text-sm mt-0.5">{profile.soilHealthCardNo}</div>
                  <div className="text-[10px] text-[#707972] mt-0.5">Tested by CRIDA Soil Science Lab (Valid to 2027)</div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#34C759]/15 text-[#2A9D49] font-medium text-[11px]">
                  {profile.soilHealthStatus}
                </span>
              </div>

              {/* PMFBY Crop Insurance */}
              <div className="bg-[#F8F7F8] p-3.5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#707972] uppercase font-semibold">PMFBY Crop Insurance</span>
                  <div className="font-mono font-semibold text-[#1B1B1D] text-sm mt-0.5">{profile.cropInsurancePolicy}</div>
                  <div className="text-[10px] text-[#707972] mt-0.5">Agriculture Insurance Company of India (AIC)</div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#007AFF]/15 text-[#007AFF] font-medium text-[11px]">
                  {profile.cropInsuranceStatus}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#E8F3EC]/50 border border-[#2F6B4F]/10 flex items-center gap-3">
                <span className="material-symbols-outlined text-[#2F6B4F] text-[20px]">assignment_turned_in</span>
                <div className="text-[11px] text-[#125238]">
                  All mandatory certifications and digital credentials meet 2026 Ministry of Agriculture compliance.
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Edit Profile Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Farmer Profile"
        subtitle="Update personal credentials, land records, machinery, and government IDs"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveProfile} className="space-y-5 text-xs">
          {/* Section 1: Personal */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#1B1B1D] flex items-center gap-1.5 pb-1 border-b border-black/[0.04]">
              <span className="material-symbols-outlined text-[16px] text-[#2F6B4F]">person</span>
              Personal & Contact Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-[#404943] mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName || ''}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-[#F6F3F5] border border-black/5 text-[#1B1B1D] focus:outline-none focus:ring-2 focus:ring-[#2F6B4F]/20"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#404943] mb-1">Mobile Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 rounded-xl bg-[#F6F3F5] border border-black/5 text-[#1B1B1D] focus:outline-none focus:ring-2 focus:ring-[#2F6B4F]/20"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#404943] mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 rounded-xl bg-[#F6F3F5] border border-black/5 text-[#1B1B1D] focus:outline-none focus:ring-2 focus:ring-[#2F6B4F]/20"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#404943] mb-1">Experience (Years)</label>
                <input
                  type="number"
                  name="experienceYears"
                  value={formData.experienceYears || 14}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 rounded-xl bg-[#F6F3F5] border border-black/5 text-[#1B1B1D] focus:outline-none focus:ring-2 focus:ring-[#2F6B4F]/20"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#404943] mb-1">Primary Occupation</label>
                <input
                  type="text"
                  name="primaryOccupation"
                  value={formData.primaryOccupation || ''}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 rounded-xl bg-[#F6F3F5] border border-black/5 text-[#1B1B1D] focus:outline-none focus:ring-2 focus:ring-[#2F6B4F]/20"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#404943] mb-1">Education Level</label>
                <input
                  type="text"
                  name="educationLevel"
                  value={formData.educationLevel || ''}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 rounded-xl bg-[#F6F3F5] border border-black/5 text-[#1B1B1D] focus:outline-none focus:ring-2 focus:ring-[#2F6B4F]/20"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Land & Farm */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#1B1B1D] flex items-center gap-1.5 pb-1 border-b border-black/[0.04]">
              <span className="material-symbols-outlined text-[16px] text-[#2F6B4F]">landscape</span>
              Farm & Land Particulars
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-medium text-[#404943] mb-1">Farm / Estate Name</label>
                <input
                  type="text"
                  name="farmName"
                  value={formData.farmName || ''}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 rounded-xl bg-[#F6F3F5] border border-black/5 text-[#1B1B1D] focus:outline-none focus:ring-2 focus:ring-[#2F6B4F]/20"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#404943] mb-1">Total Acreage</label>
                <input
                  type="number"
                  step="0.1"
                  name="totalAcreage"
                  value={formData.totalAcreage || 12.5}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 rounded-xl bg-[#F6F3F5] border border-black/5 text-[#1B1B1D] focus:outline-none focus:ring-2 focus:ring-[#2F6B4F]/20"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#404943] mb-1">Owned Acreage</label>
                <input
                  type="number"
                  step="0.1"
                  name="ownedAcreage"
                  value={formData.ownedAcreage || 12.0}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 rounded-xl bg-[#F6F3F5] border border-black/5 text-[#1B1B1D] focus:outline-none focus:ring-2 focus:ring-[#2F6B4F]/20"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#404943] mb-1">Leased Acreage</label>
                <input
                  type="number"
                  step="0.1"
                  name="leasedAcreage"
                  value={formData.leasedAcreage || 0.5}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 rounded-xl bg-[#F6F3F5] border border-black/5 text-[#1B1B1D] focus:outline-none focus:ring-2 focus:ring-[#2F6B4F]/20"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#404943] mb-1">Survey Numbers</label>
                <input
                  type="text"
                  name="surveyNumbers"
                  value={formData.surveyNumbers || ''}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 rounded-xl bg-[#F6F3F5] border border-black/5 text-[#1B1B1D] focus:outline-none focus:ring-2 focus:ring-[#2F6B4F]/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-[#404943] mb-1">Soil Classification</label>
                <input
                  type="text"
                  name="soilType"
                  value={formData.soilType || ''}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 rounded-xl bg-[#F6F3F5] border border-black/5 text-[#1B1B1D] focus:outline-none focus:ring-2 focus:ring-[#2F6B4F]/20"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#404943] mb-1">Water Source</label>
                <input
                  type="text"
                  name="waterSource"
                  value={formData.waterSource || ''}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 rounded-xl bg-[#F6F3F5] border border-black/5 text-[#1B1B1D] focus:outline-none focus:ring-2 focus:ring-[#2F6B4F]/20"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Schemes & IDs */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#1B1B1D] flex items-center gap-1.5 pb-1 border-b border-black/[0.04]">
              <span className="material-symbols-outlined text-[16px] text-[#2F6B4F]">account_balance</span>
              Government Schemes & Financials
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-[#404943] mb-1">PM-KISAN ID</label>
                <input
                  type="text"
                  name="pmKisanId"
                  value={formData.pmKisanId || ''}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 rounded-xl bg-[#F6F3F5] border border-black/5 text-[#1B1B1D] focus:outline-none focus:ring-2 focus:ring-[#2F6B4F]/20"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#404943] mb-1">KCC Number</label>
                <input
                  type="text"
                  name="kccNumber"
                  value={formData.kccNumber || ''}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 rounded-xl bg-[#F6F3F5] border border-black/5 text-[#1B1B1D] focus:outline-none focus:ring-2 focus:ring-[#2F6B4F]/20"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#404943] mb-1">KCC Credit Limit (₹)</label>
                <input
                  type="number"
                  name="kccLimit"
                  value={formData.kccLimit || 350000}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 rounded-xl bg-[#F6F3F5] border border-black/5 text-[#1B1B1D] focus:outline-none focus:ring-2 focus:ring-[#2F6B4F]/20"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#404943] mb-1">KCC Bank Branch</label>
                <input
                  type="text"
                  name="kccBank"
                  value={formData.kccBank || ''}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 rounded-xl bg-[#F6F3F5] border border-black/5 text-[#1B1B1D] focus:outline-none focus:ring-2 focus:ring-[#2F6B4F]/20"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-black/[0.04] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="px-4 py-2 rounded-full text-xs font-medium text-[#404943] hover:bg-black/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <Button type="submit" variant="primary" size="md" isLoading={saving}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Digital Farmer ID Pass Modal */}
      <Modal
        isOpen={idCardModalOpen}
        onClose={() => setIdCardModalOpen(false)}
        title="AgriPulse Digital Farmer Pass"
        subtitle="Official certified identity pass for agriculture subsidy and APMC market access"
        maxWidth="max-w-md"
      >
        <div className="space-y-5">
          {/* Physical style ID card */}
          <div
            id="printable-farmer-pass"
            className="rounded-[24px] overflow-hidden border-2 border-[#125238]/30 shadow-2xl bg-white text-[#1D1D1F] relative"
          >
            {/* Header banner */}
            <div className="bg-gradient-to-r from-[#125238] via-[#1A6345] to-[#257551] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                  🌾
                </div>
                <div>
                  <div className="text-[10px] font-bold tracking-widest text-[#4ECB71] uppercase leading-none">
                    Govt of India • AgriStack
                  </div>
                  <div className="text-xs font-semibold tracking-tight text-white mt-0.5">
                    Smart Farmer Digital Identity Pass
                  </div>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-[#4ECB71] animate-ping" />
            </div>

            {/* Body */}
            <div className="p-4 space-y-4">
              <div className="flex items-start gap-4">
                <img
                  src={profile.avatarUrl || 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&w=400&q=80'}
                  alt={profile.fullName}
                  className="w-20 h-24 rounded-xl object-cover border-2 border-[#125238]/20 bg-[#F6F3F5]"
                />
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="text-sm font-bold text-[#1B1B1D]">{profile.fullName}</div>
                  <div className="text-[11px] font-mono text-[#125238] font-semibold bg-[#E8F3EC] px-2 py-0.5 rounded-full inline-block">
                    {profile.farmerUid}
                  </div>
                  <div className="text-[11px] text-[#6E6E73] truncate">
                    {profile.farmName} • {profile.totalAcreage} Ac
                  </div>
                  <div className="text-[10px] text-[#707972] truncate">
                    {profile.villageMandal}, {profile.district}
                  </div>
                </div>
              </div>

              {/* Holographic style verification bar */}
              <div className="grid grid-cols-2 gap-2 text-[10px] p-2.5 rounded-xl bg-[#F8F7F8] border border-black/5">
                <div>
                  <span className="text-[#707972] block">PM-KISAN ID:</span>
                  <span className="font-mono font-medium text-[#1B1B1D]">{profile.pmKisanId}</span>
                </div>
                <div>
                  <span className="text-[#707972] block">KCC Account:</span>
                  <span className="font-mono font-medium text-[#1B1B1D]">{profile.kccNumber}</span>
                </div>
                <div>
                  <span className="text-[#707972] block">Soil Health Card:</span>
                  <span className="font-mono font-medium text-[#1B1B1D]">{profile.soilHealthCardNo}</span>
                </div>
                <div>
                  <span className="text-[#707972] block">Pass Validity:</span>
                  <span className="font-medium text-[#2F6B4F]">2026 - 2029 (Active)</span>
                </div>
              </div>

              {/* Barcode & QR representation */}
              <div className="pt-2 border-t border-black/[0.06] flex items-center justify-between">
                <div>
                  <div className="text-[8px] tracking-widest uppercase text-[#707972]">Digital Authentication Hash</div>
                  <div className="font-mono text-[9px] text-[#1B1B1D] font-medium">AGRI-VERIFY-8842-DL-TS</div>
                </div>
                <div className="w-12 h-12 bg-[#1B1B1D] p-1 rounded-lg flex items-center justify-center text-white text-[8px] font-mono text-center">
                  [ QR ]
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-[#F8F7F8] px-4 py-2 text-[9px] text-center text-[#707972] border-t border-black/5 font-medium">
              Issued under Ministry of Agriculture & Farmer Welfare National Digital Registry
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2.5">
            <button
              onClick={() => setIdCardModalOpen(false)}
              className="px-4 py-2 rounded-full text-xs font-medium text-[#404943] hover:bg-black/5 cursor-pointer"
            >
              Close
            </button>
            <Button
              variant="primary"
              size="md"
              icon="print"
              onClick={() => window.print()}
            >
              Print ID Pass
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FarmerProfilePage;
