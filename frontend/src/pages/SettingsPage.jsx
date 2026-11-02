import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recommendationService, settingsService } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import { LoadingState, ErrorState } from '../components/FeedbackStates';

export const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('recommendations'); // recommendations, settings
  const [recommendations, setRecommendations] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [successToast, setSuccessToast] = useState(null);

  // Settings form states
  const [farmName, setFarmName] = useState('Green Valley Farm');
  const [ownerName, setOwnerName] = useState('Ravi Kumar');
  const [location, setLocation] = useState('Hyderabad, Telangana');
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [syncFreq, setSyncFreq] = useState(5);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [recsRes, setRes] = await Promise.all([
        recommendationService.getRecommendations(),
        settingsService.getSettings(),
      ]);
      setRecommendations(recsRes);
      setSettings(setRes);
      if (setRes) {
        setFarmName(setRes.farmName || 'Green Valley Farm');
        setOwnerName(setRes.ownerName || 'Ravi Kumar');
        setLocation(setRes.location || 'Hyderabad, Telangana');
        setSmsAlerts(setRes.smsAlerts ?? true);
        setEmailAlerts(setRes.emailAlerts ?? true);
        setSyncFreq(setRes.telemetrySyncMinutes || 5);
      }
    } catch (err) {
      setError(err.message || 'Failed to load recommendations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCompleteRec = async (id) => {
    try {
      const updated = await recommendationService.completeRecommendation(id);
      setRecommendations((prev) => prev.map((r) => (r.id === id ? updated : r)));
      showToast('Action marked as executed.');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await settingsService.updateProfile({
        farmName,
        ownerName,
        location,
        smsAlerts,
        emailAlerts,
        telemetrySyncMinutes: syncFreq,
      });
      showToast('Workspace settings saved successfully.');
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const showToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  if (loading) return <LoadingState message="Loading agronomic action list & configuration..." />;
  if (error) return <ErrorState message={error} onRetry={loadData} />;

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#125238] text-white px-5 py-3 rounded-full text-xs font-medium shadow-lg flex items-center gap-2 animate-in fade-in duration-200">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>{successToast}</span>
        </div>
      )}

      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-header">
        <div>
          <span className="font-label-caps text-[#6E6E73]">Workspace Operations</span>
          <h1 className="text-3xl sm:text-4xl font-normal text-[#1D1D1F] tracking-tight mt-1">
            Recommendations & Settings
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6E73] mt-1">
            Prescriptive agronomic workflows, setpoint configurations, and notification preferences.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-full bg-white p-1 border border-black/[0.04]">
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'recommendations'
                ? 'bg-[#E8F3EC] text-[#2F6B4F] shadow-xs'
                : 'text-[#6E6E73] hover:text-[#1D1D1F]'
            }`}
          >
            Action Recommendations ({recommendations.filter((r) => !r.completed).length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#E8F3EC] text-[#2F6B4F] shadow-xs'
                : 'text-[#6E6E73] hover:text-[#1D1D1F]'
            }`}
          >
            Workspace Settings
          </button>
        </div>
      </section>

      {/* Content for Tab 1: Recommendations */}
      {activeTab === 'recommendations' && (
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className={`p-6 rounded-[28px] border shadow-xs transition-all ${
                rec.completed ? 'bg-white opacity-60 border-black/[0.04]' : 'bg-white border-black/[0.04]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      rec.completed ? 'bg-black/5 text-[#707972]' : 'bg-[#E8F3EC] text-[#2F6B4F]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {rec.completed ? 'task_alt' : 'lightbulb'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-[#1D1D1F]">{rec.title}</h3>
                    <div className="text-[11px] text-[#6E6E73]">
                      Impact: {rec.impactCategory} • Priority: {rec.priority}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge variant={rec.priority === 'HIGH' ? 'warning' : 'optimal'}>
                    {rec.priority} Priority
                  </StatusBadge>
                  <StatusBadge variant="eco">{rec.impactCategory}</StatusBadge>
                </div>
              </div>

              <p className="text-xs text-[#404943] leading-relaxed my-3 pl-13">
                {rec.summary}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-black/[0.04] pl-13 text-xs">
                <span className="text-[#6E6E73]">
                  {rec.completed ? 'Completed' : 'Pending Verification'}
                </span>
                {!rec.completed ? (
                  <Button
                    variant="primary"
                    size="sm"
                    icon="check"
                    onClick={() => handleCompleteRec(rec.id)}
                  >
                    {rec.actionCta || 'Execute Prescription'}
                  </Button>
                ) : (
                  <span className="text-xs font-medium text-[#2F6B4F] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">done</span> Executed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Content for Tab 2: Settings */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-white rounded-[28px] p-6 sm:p-8 shadow-sm border border-black/[0.04] space-y-6">
          {/* Quick link to comprehensive Farmer Profile */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#E8F3EC] to-[#DCF0E3] border border-[#2F6B4F]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#125238] text-white flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">badge</span>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#125238]">Comprehensive Farmer Profile & Digital Pass</h4>
                <p className="text-[11px] text-[#2F6B4F]">Cadastral survey numbers, PM-KISAN, KCC banking, and printable digital ID pass.</p>
              </div>
            </div>
            <Link
              to="/profile"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#125238] text-white text-xs font-medium hover:bg-[#1a6345] transition-colors shrink-0"
            >
              <span>View Profile</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </Link>
          </div>

          <div>
            <h3 className="text-lg font-medium text-[#1D1D1F] mb-1">Estate & Farmer Identity</h3>
            <p className="text-xs text-[#6E6E73]">Manage properties, location tags, and agronomic director contact.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#1B1B1D] mb-1">Estate Name</label>
              <input
                type="text"
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-[#F6F3F5] text-xs text-[#1D1D1F] border border-black/[0.06] focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#1B1B1D] mb-1">Agronomic Director</label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-[#F6F3F5] text-xs text-[#1D1D1F] border border-black/[0.06] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#1B1B1D] mb-1">Geographic Region</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-[#F6F3F5] text-xs text-[#1D1D1F] border border-black/[0.06] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="pt-6 border-t border-black/[0.04]">
            <h3 className="text-sm font-semibold text-[#1D1D1F] mb-1">Edge Telemetry Sync Frequency</h3>
            <p className="text-xs text-[#6E6E73] mb-4">Frequency at which LoRaWAN gateway synchronizes subsoil probes with cloud.</p>
            <div className="flex gap-3">
              {[1, 5, 15, 60].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setSyncFreq(mins)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                    syncFreq === mins
                      ? 'bg-[#E8F3EC] border-[#2F6B4F] text-[#2F6B4F]'
                      : 'bg-[#F6F3F5] border-transparent text-[#6E6E73]'
                  }`}
                >
                  Every {mins} min{mins > 1 ? 's' : ''}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-black/[0.04]">
            <h3 className="text-sm font-semibold text-[#1D1D1F] mb-1">Notification Channels</h3>
            <div className="space-y-3 mt-3">
              <label className="flex items-center gap-3 text-xs text-[#1D1D1F] cursor-pointer">
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="w-4 h-4 rounded text-[#2F6B4F] accent-[#2F6B4F]"
                />
                <span>Critical SMS alerts to farmer phone for threshold breaches</span>
              </label>

              <label className="flex items-center gap-3 text-xs text-[#1D1D1F] cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-4 h-4 rounded text-[#2F6B4F] accent-[#2F6B4F]"
                />
                <span>Daily morning briefing report sent to registered email</span>
              </label>
            </div>
          </div>

          <div className="pt-6 border-t border-black/[0.04] flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={saving}
            >
              Save Configuration
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SettingsPage;
