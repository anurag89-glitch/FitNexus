import React, { useState } from 'react';
import { 
  Flame, 
  Clock, 
  Target, 
  Calendar, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  Lock, 
  Zap,
  ChevronRight
} from 'lucide-react';
import { PROGRESS_DATA } from '../../data/mockData';
import { ProgressBar } from '../common/ProgressBar';
import { sounds } from '../../utils/audio';

export default function ProgressScreen({ user }) {
  const [timeRange, setTimeRange] = useState('weekly'); // 'weekly' or 'monthly'
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  const chartData = timeRange === 'weekly' 
    ? PROGRESS_DATA.weeklyWorkoutsChart 
    : PROGRESS_DATA.monthlyWorkoutsChart;

  const maxCal = Math.max(...chartData.map(d => d.calories || 100));

  return (
    <div className="screen-content" id="screen-progress">
      {/* 1. Header with Title and Weekly/Monthly Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
            Your Progress
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Real-time analytics & milestones
          </p>
        </div>

        {/* Weekly / Monthly Toggle */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '3px',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            onClick={() => {
              sounds.click();
              setTimeRange('weekly');
            }}
            style={{
              background: timeRange === 'weekly' ? 'var(--accent-cyan)' : 'transparent',
              color: timeRange === 'weekly' ? '#030816' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: '9px',
              padding: '6px 12px',
              fontSize: '11.5px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Weekly
          </button>
          <button
            onClick={() => {
              sounds.click();
              setTimeRange('monthly');
            }}
            style={{
              background: timeRange === 'monthly' ? 'var(--accent-cyan)' : 'transparent',
              color: timeRange === 'monthly' ? '#030816' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: '9px',
              padding: '6px 12px',
              fontSize: '11.5px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* 2. Top Key Stats 4-Grid: Current Streak, Weekly Goal, Calories Burned, Workout Time */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
        {/* Streak */}
        <div className="nexus-card" style={{ padding: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Current Streak
            </span>
            <span style={{ fontSize: '16px' }}>🔥</span>
          </div>
          <div style={{ fontSize: '22px', fontWeight: 900, color: '#fff', marginTop: '6px', fontFamily: 'var(--font-display)' }}>
            7 Days
          </div>
          <span style={{ fontSize: '11px', color: 'var(--accent-orange)', fontWeight: 600, marginTop: '2px', display: 'block' }}>
            Personal Record Active
          </span>
        </div>

        {/* Weekly Goal */}
        <div className="nexus-card" style={{ padding: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Weekly Goal
            </span>
            <Target size={16} color="var(--accent-cyan)" />
          </div>
          <div style={{ fontSize: '22px', fontWeight: 900, color: '#fff', marginTop: '6px', fontFamily: 'var(--font-display)' }}>
            18 / 25
          </div>
          <span style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontWeight: 600, marginTop: '2px', display: 'block' }}>
            workouts completed
          </span>
        </div>

        {/* Calories Burned */}
        <div className="nexus-card" style={{ padding: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Calories Burned
            </span>
            <Flame size={16} color="var(--accent-orange)" />
          </div>
          <div style={{ fontSize: '22px', fontWeight: 900, color: '#fff', marginTop: '6px', fontFamily: 'var(--font-display)' }}>
            2,480 <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>kcal</span>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--accent-green)', fontWeight: 600, marginTop: '2px', display: 'block' }}>
            +14% vs last week
          </span>
        </div>

        {/* Workout Time */}
        <div className="nexus-card" style={{ padding: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Workout Time
            </span>
            <Clock size={16} color="var(--accent-neon)" />
          </div>
          <div style={{ fontSize: '22px', fontWeight: 900, color: '#fff', marginTop: '6px', fontFamily: 'var(--font-display)' }}>
            4h 35m
          </div>
          <span style={{ fontSize: '11px', color: 'var(--accent-neon)', fontWeight: 600, marginTop: '2px', display: 'block' }}>
            avg 38 min / session
          </span>
        </div>
      </div>

      {/* 3. Weekly Activity Chart (Mon, Tue, Wed, Thu, Fri, Sat, Sun) */}
      <div className="nexus-card" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h4 style={{ fontSize: '15px', color: '#fff', fontWeight: 700 }}>
              {timeRange === 'weekly' ? 'Weekly Activity Chart' : 'Monthly Activity Overview'}
            </h4>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              {selectedDay ? `${selectedDay.day}: ${selectedDay.calories} kcal (${selectedDay.minutes} min)` : 'Tap any bar for daily breakdown'}
            </span>
          </div>
          <span className="section-badge">Calorie Burn</span>
        </div>

        {/* Bar Chart Container */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          height: '140px',
          padding: '0 8px 10px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          gap: '8px'
        }}>
          {chartData.map((item, idx) => {
            const heightPercent = maxCal > 0 ? Math.round((item.calories / maxCal) * 100) : 20;
            const isSelected = selectedDay?.day === item.day;

            return (
              <div
                key={idx}
                onClick={() => {
                  sounds.click();
                  setSelectedDay(item);
                }}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: '100%',
                  justifyContent: 'flex-end',
                  cursor: 'pointer'
                }}
              >
                {/* Bar */}
                <div
                  style={{
                    width: '100%',
                    maxWidth: '24px',
                    height: `${Math.max(8, heightPercent)}%`,
                    background: item.isToday 
                      ? 'linear-gradient(180deg, #38bdf8, #00d2ff)' 
                      : item.done 
                        ? 'linear-gradient(180deg, #00d2ff, #0a84ff)' 
                        : 'rgba(255, 255, 255, 0.06)',
                    borderRadius: '6px',
                    boxShadow: (item.done || item.isToday) ? '0 0 10px rgba(0, 210, 255, 0.3)' : 'none',
                    border: isSelected ? '2px solid #fff' : 'none',
                    transition: 'height 0.4s ease, transform 0.2s',
                    transform: isSelected ? 'scale(1.08)' : 'scale(1)'
                  }}
                />

                {/* Day label */}
                <span style={{
                  fontSize: '11px',
                  fontWeight: (item.isToday || isSelected) ? 700 : 500,
                  color: item.isToday ? 'var(--accent-cyan)' : isSelected ? '#fff' : 'var(--text-muted)',
                  marginTop: '8px'
                }}>
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Goal Progress: Strength 72%, Endurance 58%, Consistency 84% */}
      <div className="nexus-card" style={{ padding: '16px' }}>
        <div className="section-header" style={{ marginBottom: '14px' }}>
          <span className="section-title">GOAL PROGRESS</span>
          <span style={{ fontSize: '11.5px', color: 'var(--accent-cyan)', fontWeight: 600 }}>Active Cycle</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Strength */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
              <span style={{ color: '#fff', fontWeight: 600 }}>Strength</span>
              <span style={{ color: 'var(--accent-cyan)', fontWeight: 800 }}>72%</span>
            </div>
            <ProgressBar value={72} max={100} height={7} />
          </div>

          {/* Endurance */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
              <span style={{ color: '#fff', fontWeight: 600 }}>Endurance</span>
              <span style={{ color: 'var(--accent-neon)', fontWeight: 800 }}>58%</span>
            </div>
            <ProgressBar value={58} max={100} height={7} color="linear-gradient(90deg, #38bdf8, #0ea5e9)" />
          </div>

          {/* Consistency */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
              <span style={{ color: '#fff', fontWeight: 600 }}>Consistency</span>
              <span style={{ color: 'var(--accent-green)', fontWeight: 800 }}>84%</span>
            </div>
            <ProgressBar value={84} max={100} height={7} color="linear-gradient(90deg, #10b981, #059669)" />
          </div>
        </div>
      </div>

      {/* 5. Achievements Section: 🏆 7 Day Streak, 💪 10 Workouts, 🔥 2,500 Calories, ⚡ Early Bird */}
      <div>
        <div className="section-header">
          <span className="section-title">ACHIEVEMENTS</span>
          <span style={{ fontSize: '12px', color: 'var(--accent-cyan)', fontWeight: 600 }}>4 of 6 Unlocked</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {PROGRESS_DATA.achievements.map((ach) => (
            <div
              key={ach.id}
              className="nexus-card interactive"
              onClick={() => {
                sounds.click();
                setSelectedAchievement(ach);
              }}
              style={{
                padding: '14px',
                opacity: ach.unlocked ? 1 : 0.65,
                border: ach.unlocked ? '1px solid rgba(0, 210, 255, 0.25)' : '1px dashed var(--border-subtle)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '24px' }}>{ach.icon}</span>
                {ach.unlocked ? (
                  <CheckCircle2 size={15} color="var(--accent-green)" />
                ) : (
                  <Lock size={14} color="var(--text-muted)" />
                )}
              </div>

              <h4 style={{ fontSize: '14px', color: '#fff', fontWeight: 700 }}>
                {ach.title}
              </h4>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', lineHeight: '1.3' }}>
                {ach.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Achievement Detail Modal */}
      {selectedAchievement && (
        <div className="modal-overlay" onClick={() => setSelectedAchievement(null)}>
          <div className="modal-content-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-grabber" />
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '10px' }}>
                {selectedAchievement.icon}
              </span>
              <h3 style={{ fontSize: '20px', color: '#fff', fontWeight: 800 }}>
                {selectedAchievement.title}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                {selectedAchievement.desc}
              </p>
              <span style={{
                display: 'inline-block',
                marginTop: '12px',
                fontSize: '11px',
                color: selectedAchievement.unlocked ? 'var(--accent-green)' : 'var(--accent-orange)',
                fontWeight: 700,
                background: 'rgba(255,255,255,0.05)',
                padding: '4px 12px',
                borderRadius: '99px'
              }}>
                {selectedAchievement.date}
              </span>
            </div>

            <button className="btn-primary" onClick={() => setSelectedAchievement(null)}>
              Awesome
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
