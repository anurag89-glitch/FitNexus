import React from 'react';
import { 
  Dumbbell, 
  Sparkles, 
  Activity, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  Watch, 
  Flame, 
  Clock, 
  Footprints, 
  Play, 
  Zap,
  ChevronRight
} from 'lucide-react';
import { CircularProgress } from '../common/ProgressBar';
import { sounds } from '../../utils/audio';

export default function HomeScreen({
  user,
  nutritionData,
  featuredWorkout,
  onStartWorkout,
  onOpenWorkoutDetails,
  onSelectTab,
  onOpenWearable,
  onOpenAICoach,
  onOpenNutrition
}) {
  return (
    <div className="screen-content" id="screen-home">
      {/* 1. Top Section Greeting */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
            {user.greeting}
          </h2>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {user.subtitle}
          </p>
        </div>

        <div 
          className="user-avatar-btn" 
          onClick={() => {
            sounds.click();
            onSelectTab('profile');
          }}
          title="Open Profile"
        >
          <img src="/fitnexus-logo.png" alt={user.name} />
          <span className="user-avatar-badge" />
        </div>
      </div>

      {/* 2. Today's Goal Card */}
      <div 
        className="nexus-card"
        style={{
          background: 'linear-gradient(135deg, rgba(12, 25, 48, 0.9) 0%, rgba(6, 12, 24, 0.95) 100%)',
          border: '1px solid rgba(0, 210, 255, 0.25)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <Zap size={14} color="var(--accent-cyan)" />
              <span style={{ 
                fontSize: '11px', 
                fontWeight: 700, 
                color: 'var(--accent-cyan)', 
                letterSpacing: '0.06em', 
                textTransform: 'uppercase' 
              }}>
                Today's Goal
              </span>
            </div>
            <h3 style={{ fontSize: '16px', color: '#fff', fontWeight: 700, lineHeight: '1.3' }}>
              Complete a 25-minute workout
            </h3>
            <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)', display: 'block', marginTop: '4px' }}>
              16 of 25 minutes logged today
            </span>
          </div>

          <div style={{ paddingLeft: '10px' }}>
            <CircularProgress percentage={65} size={64} strokeWidth={6} color="var(--accent-cyan)" />
          </div>
        </div>
      </div>

      {/* 3. Large Featured Workout Card */}
      <div 
        className="nexus-card interactive glow-border"
        id="card-today-workout"
        onClick={() => {
          sounds.click();
          onOpenWorkoutDetails(featuredWorkout);
        }}
        style={{
          background: 'radial-gradient(circle at 80% 20%, rgba(0, 210, 255, 0.18) 0%, rgba(11, 22, 44, 0.95) 70%)',
          padding: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(0, 210, 255, 0.15)',
            border: '1px solid var(--border-cyan)',
            padding: '3px 10px',
            borderRadius: '99px',
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--accent-cyan)'
          }}>
            <Flame size={12} />
            Today's Workout
          </div>

          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
            {featuredWorkout.completions} athletes
          </span>
        </div>

        <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: '6px' }}>
          {featuredWorkout.title}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={14} color="var(--accent-cyan)" />
            {featuredWorkout.duration} min
          </span>
          <span>•</span>
          <span style={{ color: 'var(--accent-neon)', fontWeight: 600 }}>
            {featuredWorkout.level}
          </span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Flame size={14} color="var(--accent-orange)" />
            ~{featuredWorkout.calories} kcal
          </span>
        </div>

        <button 
          className="btn-primary" 
          id="btn-start-featured-workout"
          onClick={(e) => {
            e.stopPropagation();
            sounds.click();
            onStartWorkout(featuredWorkout);
          }}
        >
          <Play size={16} fill="#030816" />
          Start Workout →
        </button>
      </div>

      {/* 4. Quick Actions (4 compact action buttons) */}
      <div>
        <div className="section-header">
          <span className="section-title">Quick Actions</span>
        </div>

        <div className="quick-actions-grid">
          <div 
            className="quick-action-btn"
            id="qa-start-workout"
            onClick={() => {
              sounds.click();
              onStartWorkout(featuredWorkout);
            }}
          >
            <div className="quick-action-icon-circle">
              <Play size={17} fill="var(--accent-cyan)" />
            </div>
            <span className="quick-action-label">Start Workout</span>
          </div>

          <div 
            className="quick-action-btn"
            id="qa-ai-coach"
            onClick={() => {
              sounds.click();
              onSelectTab('ai-coach');
            }}
          >
            <div className="quick-action-icon-circle" style={{ background: 'rgba(56, 189, 248, 0.15)' }}>
              <Sparkles size={17} color="var(--accent-neon)" />
            </div>
            <span className="quick-action-label">AI Coach</span>
          </div>

          <div 
            className="quick-action-btn"
            id="qa-exercises"
            onClick={() => {
              sounds.click();
              onSelectTab('workouts');
            }}
          >
            <div className="quick-action-icon-circle">
              <Dumbbell size={17} color="var(--accent-cyan)" />
            </div>
            <span className="quick-action-label">Exercises</span>
          </div>

          <div 
            className="quick-action-btn"
            id="qa-progress"
            onClick={() => {
              sounds.click();
              onSelectTab('progress');
            }}
          >
            <div className="quick-action-icon-circle">
              <TrendingUp size={17} color="var(--accent-cyan)" />
            </div>
            <span className="quick-action-label">Progress</span>
          </div>
        </div>
      </div>

      {/* 5. Today's Activity (3 statistics) */}
      <div>
        <div className="section-header">
          <span className="section-title">Today's Activity</span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Updated 5m ago</span>
        </div>

        <div className="stats-grid-3">
          <div className="stat-item-card">
            <span className="stat-icon">🔥</span>
            <span className="stat-val">{user.todayStats.calories}</span>
            <span className="stat-lbl">kcal burned</span>
          </div>

          <div className="stat-item-card">
            <span className="stat-icon">⏱</span>
            <span className="stat-val">{user.todayStats.workoutMinutes} min</span>
            <span className="stat-lbl">time active</span>
          </div>

          <div className="stat-item-card">
            <span className="stat-icon">🚶</span>
            <span className="stat-val">4,820</span>
            <span className="stat-lbl">steps</span>
          </div>
        </div>
      </div>

      {/* 6. Nutrition Today Card */}
      {nutritionData && (
        <div
          className="nexus-card interactive"
          id="card-nutrition-today"
          onClick={() => { sounds.click(); onOpenNutrition(); }}
          style={{
            background: 'linear-gradient(135deg, rgba(10,22,44,0.96) 0%, rgba(6,14,30,0.97) 100%)',
            border: '1px solid rgba(16,185,129,0.3)',
            boxShadow: '0 0 22px rgba(16,185,129,0.08)',
            padding: '16px'
          }}
        >
          {/* Header Row */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'7px' }}>
              <span style={{ fontSize:'17px' }}>🥗</span>
              <span style={{ fontSize:'11px', fontWeight:700, color:'#10b981', letterSpacing:'0.06em', textTransform:'uppercase' }}>
                Nutrition Today
              </span>
            </div>
            <span style={{ fontSize:'11.5px', color:'var(--text-muted)', display:'flex', alignItems:'center', gap:'4px' }}>
              View Diet Plan <ChevronRight size={13} />
            </span>
          </div>

          {/* Calories row */}
          <div style={{ display:'flex', alignItems:'baseline', gap:'6px', marginBottom:'10px' }}>
            <Flame size={15} color="#f97316" />
            <span style={{ fontSize:'22px', fontWeight:800, color:'#fff', letterSpacing:'-0.03em' }}>
              {nutritionData.consumed.calories.toLocaleString()}
            </span>
            <span style={{ fontSize:'13px', color:'var(--text-secondary)' }}>
              / {nutritionData.targets.calories.toLocaleString()} kcal
            </span>
          </div>

          {/* Macro bars */}
          {[
            { label:'Protein', val: nutritionData.consumed.protein, max: nutritionData.targets.protein, unit:'g', color:'#38bdf8' },
            { label:'Carbs',   val: nutritionData.consumed.carbs,   max: nutritionData.targets.carbs,   unit:'g', color:'#f59e0b' },
            { label:'Fats',    val: nutritionData.consumed.fats,    max: nutritionData.targets.fats,    unit:'g', color:'#fb923c' },
          ].map(macro => (
            <div key={macro.label} style={{ marginBottom:'7px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'11.5px', color:'var(--text-secondary)', marginBottom:'3px' }}>
                <span style={{ fontWeight:600 }}>{macro.label}</span>
                <span style={{ color:'rgba(255,255,255,0.7)' }}>{macro.val} / {macro.max}{macro.unit}</span>
              </div>
              <div style={{ height:'5px', borderRadius:'99px', background:'rgba(255,255,255,0.08)', overflow:'hidden' }}>
                <div style={{
                  height:'100%',
                  width:`${Math.min(100, Math.round(macro.val/macro.max*100))}%`,
                  background: macro.color,
                  borderRadius:'99px',
                  boxShadow:`0 0 6px ${macro.color}80`,
                  transition:'width 0.6s ease'
                }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 7. AI Recommendation Card */}
      <div 
        className="nexus-card"
        style={{
          background: 'linear-gradient(135deg, rgba(8, 20, 42, 0.95) 0%, rgba(14, 30, 58, 0.85) 100%)',
          border: '1px solid var(--border-cyan)',
          boxShadow: '0 0 25px rgba(0, 210, 255, 0.12)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Sparkles size={16} color="var(--accent-cyan)" />
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-cyan)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            AI Recommendation
          </span>
        </div>

        <p style={{ fontSize: '13.5px', color: '#e2e8f0', lineHeight: '1.45', marginBottom: '14px' }}>
          “Based on your recent activity, a 20–25 minute full-body workout is recommended today.”
        </p>

        <button 
          className="btn-secondary" 
          id="btn-view-ai-recommendation"
          onClick={() => {
            sounds.click();
            onSelectTab('ai-coach');
          }}
          style={{ width: '100%', justifyContent: 'space-between' }}
        >
          <span>View Recommendation</span>
          <ChevronRight size={16} />
        </button>
      </div>

      {/* 7. Recent Workout */}
      <div>
        <div className="section-header">
          <span className="section-title">Recent Workout</span>
        </div>

        <div 
          className="nexus-card interactive"
          onClick={() => {
            sounds.click();
            alert("Upper Body Strength completed yesterday: 250 kcal burned, 91% AI form accuracy!");
          }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-green)'
            }}>
              <Dumbbell size={20} />
            </div>

            <div>
              <h4 style={{ fontSize: '15px', color: '#fff', fontWeight: 700 }}>
                Upper Body Strength
              </h4>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Yesterday • 32 min
              </span>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(16, 185, 129, 0.12)',
            color: 'var(--accent-green)',
            padding: '4px 10px',
            borderRadius: '99px',
            fontSize: '12px',
            fontWeight: 700
          }}>
            <CheckCircle2 size={13} />
            Completed ✓
          </div>
        </div>
      </div>

      {/* 8. Connected Device */}
      <div>
        <div className="section-header">
          <span className="section-title">Connected Device</span>
        </div>

        <div 
          className="nexus-card interactive"
          id="card-connected-device"
          onClick={() => {
            sounds.click();
            onOpenWearable();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 16px',
            border: '1px solid rgba(0, 210, 255, 0.2)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-green)' }} />
                <h4 style={{ fontSize: '14.5px', color: '#fff', fontWeight: 700 }}>
                  Smartwatch Connected ✓
                </h4>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Last synced 5 min ago • 78 BPM
              </span>
            </div>
          </div>

          <ChevronRight size={18} color="var(--text-muted)" />
        </div>
      </div>
    </div>
  );
}
