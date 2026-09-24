import React, { useState } from 'react';
import { 
  User, 
  Watch, 
  Activity, 
  Bell, 
  Shield, 
  Sliders, 
  HelpCircle, 
  Info, 
  LogOut, 
  ChevronRight, 
  Check, 
  Edit3,
  Scale,
  Ruler,
  Dumbbell,
  Salad,
  Trophy,
  Swords
} from 'lucide-react';
import { sounds } from '../../utils/audio';
import FitnessGallery from '../common/FitnessGallery';

export default function ProfileScreen({ 
  user, 
  arenaStats, 
  myGalleryPosts, 
  onAddGalleryPost, 
  onDeleteGalleryPost, 
  onOpenWearable, 
  onOpenNutrition, 
  onResetDemo 
}) {
  const [editing, setEditing] = useState(false);
  const [height, setHeight] = useState(user.height || 175);
  const [weight, setWeight] = useState(user.weight || 68);
  const [goal, setGoal] = useState(user.goal || "Build Muscle");
  const [level, setLevel] = useState(user.level || "Intermediate");

  const [notificationToggled, setNotificationToggled] = useState(true);

  const handleSave = () => {
    sounds.repSuccess();
    setEditing(false);
  };

  return (
    <div className="screen-content" id="screen-profile">
      {/* 1. Profile Top Card */}
      <div 
        className="nexus-card glow-border"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '24px 16px',
          background: 'radial-gradient(circle at 50% 30%, rgba(0, 210, 255, 0.15) 0%, rgba(10, 20, 40, 0.95) 75%)'
        }}
      >
        <div style={{ position: 'relative', marginBottom: '14px' }}>
          <img 
            src="/fitnexus-logo.png" 
            alt={user.name} 
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '26px',
              objectFit: 'cover',
              border: '2.5px solid var(--accent-cyan)',
              boxShadow: '0 0 25px rgba(0, 210, 255, 0.4)'
            }} 
          />
          <div style={{
            position: 'absolute',
            bottom: '-4px',
            right: '-4px',
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: 'var(--accent-green)',
            border: '3px solid var(--bg-surface)'
          }} />
        </div>

        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>
          {user.name}
        </h2>

        <span style={{
          display: 'inline-block',
          marginTop: '4px',
          fontSize: '12px',
          fontWeight: 700,
          color: 'var(--accent-cyan)',
          background: 'rgba(0, 210, 255, 0.12)',
          padding: '3px 12px',
          borderRadius: '99px',
          border: '1px solid var(--border-cyan)'
        }}>
          {level} Fitness Level
        </span>

        {/* Arena Record */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginTop: '16px',
          width: '100%',
          justifyContent: 'center'
        }}>
          <div style={{
            flex: 1,
            maxWidth: '96px',
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '12px',
            padding: '8px 4px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--accent-green)' }}>
              {arenaStats?.wins || 0}
            </div>
            <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: 600 }}>Wins</div>
          </div>

          <div style={{
            flex: 1,
            maxWidth: '96px',
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: '12px',
            padding: '8px 4px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--accent-red)' }}>
              {arenaStats?.losses || 0}
            </div>
            <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: 600 }}>Losses</div>
          </div>

          <div style={{
            flex: 1,
            maxWidth: '96px',
            background: 'rgba(0, 210, 255, 0.08)',
            border: '1px solid var(--border-cyan)',
            borderRadius: '12px',
            padding: '8px 4px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--accent-cyan)' }}>
              {arenaStats?.draws || 0}
            </div>
            <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: 600 }}>Draws</div>
          </div>
        </div>
      </div>

      {/* 2. Fitness Information Section */}
      <div className="nexus-card" style={{ padding: '16px' }}>
        <div className="section-header" style={{ marginBottom: '12px' }}>
          <span className="section-title">FITNESS INFORMATION</span>
          <button 
            onClick={() => {
              sounds.click();
              if (editing) handleSave();
              else setEditing(true);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-cyan)',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {editing ? <><Check size={14} /> Save</> : <><Edit3 size={14} /> Edit</>}
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Goal */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Goal</span>
            {editing ? (
              <select 
                value={goal} 
                onChange={(e) => setGoal(e.target.value)}
                style={{ background: '#09152b', border: '1px solid var(--border-cyan)', color: '#fff', borderRadius: '6px', padding: '4px 8px', fontSize: '12px' }}
              >
                <option value="Build Muscle">Build Muscle</option>
                <option value="Fat Loss">Fat Loss</option>
                <option value="Endurance">Endurance</option>
                <option value="Athletic Agility">Athletic Agility</option>
              </select>
            ) : (
              <span style={{ fontSize: '13.5px', color: '#fff', fontWeight: 700 }}>{goal}</span>
            )}
          </div>

          {/* Height */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Height</span>
            {editing ? (
              <input 
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                style={{ width: '70px', background: '#09152b', border: '1px solid var(--border-cyan)', color: '#fff', borderRadius: '6px', padding: '4px 8px', fontSize: '12px', textAlign: 'right' }}
              />
            ) : (
              <span style={{ fontSize: '13.5px', color: '#fff', fontWeight: 700 }}>{height} cm</span>
            )}
          </div>

          {/* Weight */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Weight</span>
            {editing ? (
              <input 
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                style={{ width: '70px', background: '#09152b', border: '1px solid var(--border-cyan)', color: '#fff', borderRadius: '6px', padding: '4px 8px', fontSize: '12px', textAlign: 'right' }}
              />
            ) : (
              <span style={{ fontSize: '13.5px', color: '#fff', fontWeight: 700 }}>{weight} kg</span>
            )}
          </div>

          {/* Preferred Workout */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Preferred Workout</span>
            <span style={{ fontSize: '13.5px', color: '#fff', fontWeight: 700 }}>{user.preferredWorkout || "Strength Training"}</span>
          </div>

          {/* Fitness Level */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Fitness Level</span>
            <span style={{ fontSize: '13.5px', color: 'var(--accent-cyan)', fontWeight: 700 }}>{level}</span>
          </div>
        </div>
      </div>

      {/* Fitness Gallery */}
      <FitnessGallery
        posts={myGalleryPosts || []}
        ownerId="me"
        viewerId="me"
        onAdd={onAddGalleryPost}
        onDelete={onDeleteGalleryPost}
      />

      {/* 3. Connected Devices */}
      <div className="nexus-card" style={{ padding: '16px' }}>
        <div className="section-header" style={{ marginBottom: '12px' }}>
          <span className="section-title">CONNECTED DEVICES</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Smartwatch item */}
          <div 
            onClick={() => {
              sounds.click();
              onOpenWearable();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.03)',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Watch size={18} color="var(--accent-cyan)" />
              <span style={{ fontSize: '13.5px', color: '#fff', fontWeight: 600 }}>Smartwatch</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: 'var(--accent-green)', fontWeight: 700 }}>Connected ✓</span>
              <ChevronRight size={15} color="var(--text-muted)" />
            </div>
          </div>

          {/* Health Data Synced */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.03)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Activity size={18} color="var(--accent-green)" />
              <span style={{ fontSize: '13.5px', color: '#fff', fontWeight: 600 }}>Health Data</span>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--accent-green)', fontWeight: 700 }}>Synced ✓</span>
          </div>
        </div>
      </div>

      {/* 4. Settings List */}
      <div className="nexus-card" style={{ padding: '8px 16px' }}>
        {[
          { label: 'Notifications', icon: Bell, action: () => alert("Notification frequency set to Active Reminders.") },
          { label: 'Diet & Nutrition', icon: Salad, accent: '#10b981', action: () => onOpenNutrition && onOpenNutrition() },
          { label: 'Privacy', icon: Shield, action: () => alert("Camera posture tracking processes locally. No raw video is stored.") },
          { label: 'Connected Devices', icon: Watch, action: onOpenWearable },
          { label: 'Workout Preferences', icon: Sliders, action: () => alert("Preferences: 25 min default circuits, sound feedback enabled.") },
          { label: 'Units', icon: Ruler, value: 'Metric (cm, kg)', action: () => alert("Unit system: Metric.") },
          { label: 'Help & Support', icon: HelpCircle, action: () => alert("FitNexus Support: 24/7 AI Health Assistance active.") },
          { label: 'About FitNexus', icon: Info, value: 'v2.4.0', action: () => alert("FitNexus v2.4.0 — Mobile-first AI Fitness Platform.") }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              onClick={() => {
                sounds.click();
                item.action();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: idx < 7 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Icon size={17} color={item.accent || 'var(--text-secondary)'} />
                <span style={{ fontSize: '13.5px', color: '#fff', fontWeight: 500 }}>{item.label}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {item.value && (
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.value}</span>
                )}
                <ChevronRight size={16} color="var(--text-muted)" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. Log Out / Reset Demo CTA */}
      <div style={{ marginTop: '4px', marginBottom: '16px' }}>
        <button
          className="btn-secondary"
          onClick={() => {
            sounds.click();
            if (window.confirm("Restart FitNexus demo from Splash & Onboarding?")) {
              onResetDemo();
            }
          }}
          style={{ width: '100%', color: 'var(--accent-red)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
        >
          <LogOut size={16} color="var(--accent-red)" />
          Log Out / Reset Demo
        </button>
      </div>
    </div>
  );
}
