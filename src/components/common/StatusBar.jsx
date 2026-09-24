import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium } from 'lucide-react';

export default function StatusBar() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="status-bar" id="mobile-status-bar">
      <span style={{ fontWeight: 700, letterSpacing: '-0.02em', fontSize: '14px' }}>
        {time || '9:41'}
      </span>

      <div className="dynamic-island">
        <div className="island-camera" />
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <span style={{ width: '4px', height: '4px', background: '#00d2ff', borderRadius: '50%' }} />
          <span style={{ fontSize: '9px', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>AI</span>
        </div>
        <div className="island-sensor" />
      </div>

      <div className="status-bar-icons">
        <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.04em' }}>5G</span>
        <Wifi size={13} strokeWidth={2.5} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <BatteryMedium size={18} strokeWidth={2.2} color="#00d2ff" />
        </div>
      </div>
    </div>
  );
}
