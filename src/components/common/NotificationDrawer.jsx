import React from 'react';
import { X, CheckCheck, Dumbbell, Flame, Watch, Sparkles } from 'lucide-react';
import { sounds } from '../../utils/audio';

export default function NotificationDrawer({
  isOpen,
  onClose,
  notifications,
  onActionClick,
  onClearAll
}) {
  if (!isOpen) return null;

  const getIcon = (action) => {
    switch (action) {
      case 'start_workout':
        return <Dumbbell size={18} color="var(--accent-cyan)" />;
      case 'view_progress':
        return <Flame size={18} color="var(--accent-orange)" />;
      case 'open_wearable':
        return <Watch size={18} color="var(--accent-cyan)" />;
      case 'open_ai_coach':
      default:
        return <Sparkles size={18} color="var(--accent-neon)" />;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content-sheet" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '82%' }}
      >
        <div className="modal-grabber" />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '18px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Notifications
              <span className="section-badge">{notifications.length}</span>
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Real-time updates & IoT alerts
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => {
                sounds.click();
                onClearAll();
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer'
              }}
            >
              <CheckCheck size={14} /> Clear
            </button>
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
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)' }}>
              <p>No new notifications</p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  sounds.click();
                  onActionClick(item.action);
                }}
                style={{
                  background: item.unread ? 'rgba(0, 210, 255, 0.08)' : 'var(--bg-card)',
                  border: item.unread ? '1px solid var(--border-cyan)' : '1px solid var(--border-subtle)',
                  borderRadius: '16px',
                  padding: '14px',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {getIcon(item.action)}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <h4 style={{ fontSize: '14px', color: '#fff', fontWeight: 600 }}>{item.title}</h4>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.time}</span>
                  </div>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.4' }}>
                    {item.body}
                  </p>
                  <span style={{ 
                    display: 'inline-block', 
                    fontSize: '11px', 
                    color: 'var(--accent-cyan)', 
                    fontWeight: 700, 
                    marginTop: '6px' 
                  }}>
                    Tap to open →
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
