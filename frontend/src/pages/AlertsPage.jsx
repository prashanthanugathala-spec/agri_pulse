import React, { useState, useEffect } from 'react';
import { alertService } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import { LoadingState, ErrorState, EmptyState } from '../components/FeedbackStates';

export const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('ALL'); // ALL, ACTIVE, RESOLVED
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await alertService.getAllAlerts(filter === 'ALL' ? null : filter);
      setAlerts(res);
    } catch (err) {
      setError(err.message || 'Failed to load alerts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, [filter]);

  const handleResolve = async (id) => {
    try {
      await alertService.resolveAlert(id);
      loadAlerts();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSnooze = async (id) => {
    try {
      await alertService.snoozeAlert(id, 4);
      loadAlerts();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDismiss = async (id) => {
    try {
      await alertService.dismissAlert(id);
      loadAlerts();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <LoadingState message="Polling farm incident telemetry..." />;
  if (error) return <ErrorState message={error} onRetry={loadAlerts} />;

  const criticalCount = alerts.filter((a) => a.severity === 'CRITICAL' && !a.resolved).length;
  const warningCount = alerts.filter((a) => a.severity === 'WARNING' && !a.resolved).length;
  const resolvedCount = alerts.filter((a) => a.resolved).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-header">
        <div>
          <span className="font-label-caps text-[#6E6E73]">Automated Incident Engine</span>
          <h1 className="text-3xl sm:text-4xl font-normal text-[#1D1D1F] tracking-tight mt-1">
            Proactive Farm Alerts & Incidents
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6E73] mt-1">
            Edge sensor thresholds, subsoil hydrologic deficits, and automated pest escalations.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex rounded-full bg-white p-1 border border-black/[0.04]">
          {['ALL', 'ACTIVE', 'RESOLVED'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                filter === f
                  ? 'bg-[#E8F3EC] text-[#2F6B4F] shadow-xs'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      {/* Incident Status Count Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#FFDAD6]/30 border border-[#BA1A1A]/20 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-[#BA1A1A] uppercase font-semibold">Critical Incidents</div>
            <div className="font-metric-num text-2xl text-[#BA1A1A] mt-0.5">{criticalCount}</div>
          </div>
          <span className="material-symbols-outlined text-[#BA1A1A] text-[28px]">crisis_alert</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#FF9F0A]/10 border border-[#FF9F0A]/20 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-[#FF9F0A] uppercase font-semibold">Attention Warnings</div>
            <div className="font-metric-num text-2xl text-[#FF9F0A] mt-0.5">{warningCount}</div>
          </div>
          <span className="material-symbols-outlined text-[#FF9F0A] text-[28px]">warning</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#34C759]/10 border border-[#34C759]/20 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-[#34C759] uppercase font-semibold">Resolved Archives</div>
            <div className="font-metric-num text-2xl text-[#34C759] mt-0.5">{resolvedCount}</div>
          </div>
          <span className="material-symbols-outlined text-[#34C759] text-[28px]">check_circle</span>
        </div>
      </div>

      {/* Alerts Feed */}
      {alerts.length === 0 ? (
        <EmptyState
          icon="verified"
          title="All systems within nominal operating tolerances"
          description="There are no active threshold breaches or sensor warnings at this time."
        />
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-6 rounded-[24px] border shadow-xs transition-all ${
                alert.resolved
                  ? 'bg-white opacity-70 border-black/[0.04]'
                  : alert.severity === 'CRITICAL'
                  ? 'bg-white border-[#BA1A1A]/30'
                  : 'bg-white border-black/[0.04]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center ${
                      alert.resolved
                        ? 'bg-black/5 text-[#707972]'
                        : alert.severity === 'CRITICAL'
                        ? 'bg-[#FFDAD6] text-[#BA1A1A]'
                        : 'bg-[#FF9F0A]/10 text-[#FF9F0A]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {alert.resolved ? 'done' : alert.severity === 'CRITICAL' ? 'priority_high' : 'info'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-[#1D1D1F]">{alert.title}</h3>
                    <div className="text-[11px] text-[#6E6E73]">
                      Zone: {alert.parcelCode} • Category: {alert.category}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge
                    variant={alert.resolved ? 'neutral' : alert.severity === 'CRITICAL' ? 'critical' : 'warning'}
                  >
                    {alert.resolved ? 'Resolved' : alert.severity}
                  </StatusBadge>
                  <StatusBadge variant="eco">{alert.category}</StatusBadge>
                </div>
              </div>

              <p className="text-xs text-[#404943] leading-relaxed my-3 pl-12">
                {alert.description}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-black/[0.04] pl-12 text-xs">
                <span className="text-[#707972]">Auto-logged by Edge Gateway</span>
                <div className="flex items-center gap-3">
                  {!alert.resolved && (
                    <>
                      <button
                        onClick={() => handleSnooze(alert.id)}
                        className="text-[#6E6E73] hover:text-[#1D1D1F] cursor-pointer"
                      >
                        Snooze 4h
                      </button>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon="check"
                        onClick={() => handleResolve(alert.id)}
                      >
                        Mark Resolved
                      </Button>
                    </>
                  )}
                  <button
                    onClick={() => handleDismiss(alert.id)}
                    className="text-[#BA1A1A] hover:underline cursor-pointer ml-2"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertsPage;
