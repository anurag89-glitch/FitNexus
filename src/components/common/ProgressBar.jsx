import React from 'react';

export function ProgressBar({ 
  value = 0, 
  max = 100, 
  height = 8, 
  color = 'linear-gradient(90deg, #00d2ff, #0a84ff)', 
  glow = true,
  showLabel = false 
}) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  return (
    <div style={{ width: '100%' }}>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Progress</span>
          <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>{percentage}%</span>
        </div>
      )}
      <div
        style={{
          width: '100%',
          height: `${height}px`,
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '999px',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            background: color,
            borderRadius: '999px',
            boxShadow: glow ? '0 0 12px rgba(0, 210, 255, 0.45)' : 'none',
            transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        />
      </div>
    </div>
  );
}

export function CircularProgress({ 
  percentage = 65, 
  size = 72, 
  strokeWidth = 6, 
  children,
  color = '#00d2ff',
  trackColor = 'rgba(255, 255, 255, 0.08)'
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="none"
          style={{
            transition: 'stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)',
            filter: 'drop-shadow(0 0 6px rgba(0, 210, 255, 0.6))'
          }}
        />
      </svg>
      <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {children || (
          <span style={{ fontSize: '15px', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#fff' }}>
            {percentage}%
          </span>
        )}
      </div>
    </div>
  );
}
