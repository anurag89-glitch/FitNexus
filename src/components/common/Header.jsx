import React from 'react';
import { Bell, Watch } from 'lucide-react';
import { sounds } from '../../utils/audio';

export default function Header({
  user,
  unreadCount = 0,
  onOpenNotifications,
  onOpenWearable,
  onSelectTab
}) {
  return (
    <header className="app-header" id="main-app-header">
      <div 
        className="app-brand" 
        onClick={() => {
          sounds.click();
          onSelectTab('home');
        }}
        style={{ cursor: 'pointer' }}
      >
        <img 
          src="/fitnexus-logo.png" 
          alt="FitNexus Logo" 
          className="app-logo-badge" 
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="app-brand-title">FitNexus</span>
          <span style={{ fontSize: '10px', color: 'var(--accent-cyan)', fontWeight: 600, letterSpacing: '0.04em' }}>
            AI FITNESS
          </span>
        </div>
      </div>

      <div className="header-actions">
        {/* Quick Wearable Sync Icon */}
        <button 
          className="icon-btn" 
          title="Smartwatch Sync" 
          id="btn-header-wearable"
          onClick={() => {
            sounds.click();
            onOpenWearable();
          }}
        >
          <Watch size={18} color="var(--accent-cyan)" />
          <span style={{ 
            position: 'absolute', 
            bottom: '4px', 
            right: '4px', 
            width: '6px', 
            height: '6px', 
            borderRadius: '50%', 
            background: 'var(--accent-green)' 
          }} />
        </button>

        {/* Notification Bell */}
        <button 
          className="icon-btn" 
          title="Notifications" 
          id="btn-header-notifications"
          onClick={() => {
            sounds.click();
            onOpenNotifications();
          }}
        >
          <Bell size={18} />
          {unreadCount > 0 && <span className="icon-badge" />}
        </button>

        {/* User Mini Avatar */}
        <div 
          className="user-avatar-btn" 
          id="btn-header-avatar"
          onClick={() => {
            sounds.click();
            onSelectTab('profile');
          }}
          title="Profile"
        >
          <img src="/fitnexus-logo.png" alt={user.name} />
          <span className="user-avatar-badge" />
        </div>
      </div>
    </header>
  );
}
