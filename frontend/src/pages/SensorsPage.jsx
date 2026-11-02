import React, { useState, useEffect } from 'react';
import { sensorService } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { LoadingState, ErrorState } from '../components/FeedbackStates';

export const SensorsPage = () => {
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPairModalOpen, setIsPairModalOpen] = useState(false);

  // Form state for pairing
  const [deviceCode, setDeviceCode] = useState('');
  const [deviceType, setDeviceType] = useState('Multi-Depth Soil Moisture Probe');
  const [parcelCode, setParcelCode] = useState('P-101 (Zone A)');
  const [submitting, setSubmitting] = useState(false);

  const loadSensors = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await sensorService.getAllSensors();
      setSensors(res);
    } catch (err) {
      setError(err.message || 'Failed to connect to sensor mesh network.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSensors();
  }, []);

  const handleCalibrate = async (id) => {
    try {
      const res = await sensorService.calibrateSensor(id);
      setSensors((prev) => prev.map((s) => (s.id === id ? res : s)));
    } catch (err) {
      alert(err.message);
    }
  };

  const handlePairSensor = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await sensorService.pairSensor({
        farmId: 1,
        deviceCode,
        type: deviceType,
        parcelCode,
        batteryPercentage: 100,
        signalRssi: '-62 dBm (Strong)',
        status: 'ONLINE',
        lastPing: 'Just now',
        readingDisplay: 'Calibrated & Ready',
      });
      setIsPairModalOpen(false);
      setDeviceCode('');
      loadSensors();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState message="Scanning 868 MHz LoRaWAN edge gateway..." />;
  if (error) return <ErrorState message={error} onRetry={loadSensors} />;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-header">
        <div>
          <span className="font-label-caps text-[#6E6E73]">IoT Edge Network</span>
          <h1 className="text-3xl sm:text-4xl font-normal text-[#1D1D1F] tracking-tight mt-1">
            Sensors & Edge Gateway Fleet
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6E73] mt-1">
            Wireless subterranean moisture probes, weather stations, flowmeters, and drone telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge variant="optimal" icon="cell_tower">
            Mesh Gateway: 99.8% Uptime
          </StatusBadge>
          <Button
            variant="primary"
            size="md"
            icon="add"
            onClick={() => setIsPairModalOpen(true)}
          >
            Pair New Sensor
          </Button>
        </div>
      </section>

      {/* Fleet Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-black/[0.04]">
          <span className="font-label-caps text-[#6E6E73]">Active Edge Transmitters</span>
          <div className="font-metric-num text-3xl text-[#1D1D1F] my-1">
            {sensors.length} <span className="text-sm font-normal text-[#6E6E73]">Devices</span>
          </div>
          <StatusBadge variant="optimal">All Synchronized</StatusBadge>
        </div>

        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-black/[0.04]">
          <span className="font-label-caps text-[#6E6E73]">Average Battery Reserve</span>
          <div className="font-metric-num text-3xl text-[#1D1D1F] my-1">
            94%
          </div>
          <StatusBadge variant="eco" icon="battery_full">Solar-Harvesting Intact</StatusBadge>
        </div>

        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-black/[0.04]">
          <span className="font-label-caps text-[#6E6E73]">Radio Mesh Frequency</span>
          <div className="font-metric-num text-3xl text-[#1D1D1F] my-1">
            868 <span className="text-sm font-normal text-[#6E6E73]">MHz LoRa</span>
          </div>
          <StatusBadge variant="neutral">AES-128 Hardware Encrypted</StatusBadge>
        </div>
      </div>

      {/* Sensor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sensors.map((sensor) => (
          <div
            key={sensor.id}
            className="bg-white rounded-[28px] p-6 shadow-sm border border-black/[0.04] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="font-semibold text-xs text-[#2F6B4F]">{sensor.deviceCode}</span>
                  <h3 className="text-base font-semibold text-[#1D1D1F] mt-0.5">{sensor.type}</h3>
                  <div className="text-xs text-[#6E6E73]">{sensor.parcelCode}</div>
                </div>

                <StatusBadge
                  variant={sensor.status === 'ONLINE' || sensor.status === 'CALIBRATED' ? 'optimal' : 'warning'}
                >
                  {sensor.status}
                </StatusBadge>
              </div>

              {/* Reading Display Box */}
              <div className="p-4 rounded-2xl bg-[#F6F3F5] mb-4">
                <span className="text-[10px] text-[#6E6E73] uppercase font-semibold block mb-1">
                  Live Telemetry Reading
                </span>
                <div className="text-sm font-semibold text-[#1D1D1F]">
                  {sensor.readingDisplay}
                </div>
              </div>

              {/* Hardware diagnostics */}
              <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                <div className="p-2.5 rounded-xl bg-[#F6F3F5] flex items-center justify-between">
                  <span className="text-[#6E6E73]">Battery:</span>
                  <strong className="text-[#1D1D1F]">{sensor.batteryPercentage}%</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F6F3F5] flex items-center justify-between">
                  <span className="text-[#6E6E73]">Signal:</span>
                  <strong className="text-[#2F6B4F]">{sensor.signalRssi.split(' ')[0]}</strong>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-black/[0.04] flex items-center justify-between text-xs">
              <span className="text-[#6E6E73]">Ping: {sensor.lastPing}</span>
              <Button
                variant="ghost"
                size="sm"
                icon="tune"
                onClick={() => handleCalibrate(sensor.id)}
              >
                Calibrate
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Pair Sensor Modal */}
      <Modal
        isOpen={isPairModalOpen}
        onClose={() => setIsPairModalOpen(false)}
        title="Pair Hardware Sensor"
        subtitle="Provision wireless LoRaWAN node into master edge gateway"
      >
        <form onSubmit={handlePairSensor} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#1B1B1D] mb-1">Device Serial / Code</label>
            <input
              type="text"
              required
              value={deviceCode}
              onChange={(e) => setDeviceCode(e.target.value)}
              placeholder="e.g. SNS-SOIL-05"
              className="w-full h-10 px-3.5 rounded-xl bg-[#F6F3F5] text-xs text-[#1D1D1F] border border-black/[0.06] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#1B1B1D] mb-1">Sensor Instrument Type</label>
            <select
              value={deviceType}
              onChange={(e) => setDeviceType(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl bg-[#F6F3F5] text-xs text-[#1D1D1F] border border-black/[0.06] focus:bg-white focus:outline-none"
            >
              <option value="Multi-Depth Soil Moisture Probe">Multi-Depth Soil Moisture Probe</option>
              <option value="Microclimate Weather Station">Microclimate Weather Station</option>
              <option value="Ultrasonic Flowmeter Gateway">Ultrasonic Flowmeter Gateway</option>
              <option value="Leaf Wetness Optical Sensor">Leaf Wetness Optical Sensor</option>
              <option value="Multispectral RTK Drone Hub">Multispectral RTK Drone Hub</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#1B1B1D] mb-1">Associated Parcel Zone</label>
            <input
              type="text"
              required
              value={parcelCode}
              onChange={(e) => setParcelCode(e.target.value)}
              placeholder="e.g. P-101 (Zone A)"
              className="w-full h-10 px-3.5 rounded-xl bg-[#F6F3F5] text-xs text-[#1D1D1F] border border-black/[0.06] focus:bg-white focus:outline-none"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-4"
            isLoading={submitting}
          >
            Authenticate & Pair Node
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default SensorsPage;
