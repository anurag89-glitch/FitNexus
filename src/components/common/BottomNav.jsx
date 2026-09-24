import React from 'react';
import { Home, Dumbbell, Sparkles, TrendingUp, User, Trophy } from 'lucide-react';
import { sounds } from '../../utils/audio';

export default function BottomNav({ activeTab, onSelectTab }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'workouts', label: 'Workouts', icon: Dumbbell },
    { id: 'ai-coach', label: 'AI Coach', icon: Sparkles, hero: true },
    { id: 'arena', label: 'Arena', icon: Trophy },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="bottom-nav" id="main-bottom-nav">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            id={`nav-tab-${tab.id}`}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => {
              sounds.click();
              onSelectTab(tab.id);
            }}
          >
            <div className="nav-icon-box">
              <Icon 
                size={tab.hero ? 23 : 21} 
                strokeWidth={isActive ? 2.5 : 2} 
                color={isActive ? 'var(--accent-cyan)' : 'var(--text-muted)'} 
              />
            </div>
            <span className="nav-label">{tab.label}</span>
            {isActive && <div className="nav-active-pill" />}
          </button>
        );
      })}
    </nav>
  );
}
