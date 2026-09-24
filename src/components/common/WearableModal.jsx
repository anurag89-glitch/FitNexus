import React, { useState } from 'react';
import { X, Watch, Heart, Flame, Footprints, Clock, RefreshCw, Battery, Radio, CheckCircle2 } from 'lucide-react';
import { sounds } from '../../utils/audio';

export default function WearableModal({ isOpen, onClose, user, onSyncComplete }) {
  const [syncing, setSyncing] = useState(false);
  const [lastSyncText, setLastSyncText] = useState(user.lastSynced || "5 min ago");
  const [heartRate, setHeartRate] = useState(user.todayStats?.heartRate || 78);

  if (!isOpen) return null;

  const handleSync = () => {
    sounds.click();
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setLastSyncText("Just now");
      setHeartRate(Math.floor(76 + Math.random() * 6));
      sounds.repSuccess();
      if (onSyncComplete) onSyncComplete();
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content-sheet" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '88%' }}
      >
        <div className="modal-grabber" />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(0, 210, 255, 0.15)',
              border: '1px solid var(--border-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Watch size={22} color="var(--accent-cyan)" />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', color: '#fff' }}>Smartwatch</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                <span style={{ 
                  width: '7px', 
                  height: '7px', 
                  borderRadius: '50%', 
                  background: 'var(--accent-green)',
                  boxShadow: '0 0 8px var(--accent-green)' 
                }} />
                <span style={{ fontSize: '12px', color: 'var(--accent-green)', fontWeight: 600 }}>
                  Connected ✓
                </span>
              </div>
            </div>
          </div>

          <button 
            className="icon-btn" 
            onClick={() => {
              sounds.click();
              onClose();
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Device Info Card */}
        <div className="nexus-card glow-border" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Model
              </span>
              <h4 style={{ fontSize: '15px', color: '#fff' }}>{user.smartwatchModel || "FitPulse Apex V3"}</h4>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <Battery size={15} color="var(--accent-cyan)" />
                <span>{user.smartwatchBattery || 88}%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--accent-green)' }}>
                <Radio size={14} />
                <span>Sync OK</span>
              </div>
            </div>
          </div>

          {/* Live Heartbeat Visualizer */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.4)',
            borderRadius: '12px',
            padding: '12px 14px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Heart size={20} color="#ef4444" className="sensor-pulse-ring" fill="#ef4444" />
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Continuous Heart Rate</span>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-display)' }}>
                  {heartRate} <span style={{ fontSize: '12px', color: '#ef4444', fontWeight: 600 }}>BPM</span>
                </div>
              </div>
            </div>

            {/* Simulated ECG Wave SVG */}
            <svg width="100" height="34" viewBox="0 0 100 34" fill="none">
              <path 
                d="M0 17 L25 17 L30 4 L35 28 L40 12 L45 20 L50 17 L100 17" 
                stroke="#00d2ff" 
                strokeWidth="2" 
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ filter: 'drop-shadow(0 0 4px #00d2ff)' }}
              />
            </svg>
          </div>

          {/* Telemetry Metrics 4-Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', padding: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '11px' }}>
                <Footprints size={14} color="var(--accent-cyan)" />
                Steps
              </div>
              <div style={{ fontSize: '17px', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
                4,820
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', padding: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '11px' }}>
                <Flame size={14} color="var(--accent-orange)" />
                Calories
              </div>
              <div style={{ fontSize: '17px', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
                320 kcal
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', padding: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '11px' }}>
                <Clock size={14} color="var(--accent-neon)" />
                Workout
              </div>
              <div style={{ fontSize: '17px', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
                28 min
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', padding: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '11px' }}>
                <CheckCircle2 size={14} color="var(--accent-green)" />
                Last Sync
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent-green)', marginTop: '6px' }}>
                {lastSyncText}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
          <button 
            className="btn-primary" 
            onClick={handleSync}
            disabled={syncing}
            style={{ flex: 1 }}
          >
            <RefreshCw size={17} className={syncing ? 'spinning' : ''} style={{ animation: syncing ? 'spin 1s linear infinite' : 'none' }} />
            {syncing ? 'Syncing Sensors...' : 'Sync Now'}
          </button>
          <button 
            className="btn-secondary" 
            onClick={() => {
              sounds.click();
              alert("Smartwatch settings: Auto-sync is ON (5m intervals). Bluetooth BLE 5.3 Active.");
            }}
          >
            Manage Device
          </button>
        </div>

        <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', margin: '0 8px' }}>
          Simulated Bluetooth IoT wearable telemetry for FitNexus prototype demo.
        </p>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
