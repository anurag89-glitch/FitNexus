import React, { useState } from 'react';
import { X, Play, Clock, Flame, Dumbbell, Sparkles, ChevronRight, Bookmark, BookmarkCheck } from 'lucide-react';
import { sounds } from '../../utils/audio';

export default function WorkoutDetailModal({
  isOpen,
  workout,
  onClose,
  onStartWorkout
}) {
  const [bookmarked, setBookmarked] = useState(false);

  if (!isOpen || !workout) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content-sheet" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '92%' }}
      >
        <div className="modal-grabber" />

        {/* Modal Top Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            padding: '3px 10px',
            borderRadius: '99px',
            background: 'rgba(0, 210, 255, 0.15)',
            color: 'var(--accent-cyan)',
            border: '1px solid var(--border-cyan)'
          }}>
            {workout.category}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              className="icon-btn"
              onClick={() => {
                sounds.click();
                setBookmarked(!bookmarked);
              }}
              title="Bookmark Workout"
            >
              {bookmarked ? <BookmarkCheck size={18} color="var(--accent-cyan)" /> : <Bookmark size={18} />}
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

        {/* Title & Metadata */}
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
            {workout.title}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: '1.5' }}>
            {workout.description}
          </p>
        </div>

        {/* Metrics Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '16px',
          padding: '12px',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '11px' }}>
              <Clock size={13} color="var(--accent-cyan)" />
              Duration
            </div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
              {workout.duration} min
            </div>
          </div>

          <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.06)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '11px' }}>
              <Flame size={13} color="var(--accent-orange)" />
              Calories
            </div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
              ~{workout.calories} kcal
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '11px' }}>
              <Dumbbell size={13} color="var(--accent-neon)" />
              Difficulty
            </div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--accent-cyan)', marginTop: '2px' }}>
              {workout.level}
            </div>
          </div>
        </div>

        {/* Exercises Section */}
        <div>
          <div className="section-header" style={{ marginBottom: '10px' }}>
            <span className="section-title">
              EXERCISES ({workout.exercises?.length || 5})
            </span>
            <span style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontWeight: 600 }}>
              AI Guided
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {workout.exercises?.map((exercise, index) => (
              <div
                key={exercise.id || index}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '14px',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    background: 'rgba(0, 210, 255, 0.12)',
                    color: 'var(--accent-cyan)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 700
                  }}>
                    {index + 1}
                  </div>

                  <div>
                    <h4 style={{ fontSize: '14.5px', color: '#fff', fontWeight: 700 }}>
                      {exercise.name}
                    </h4>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {exercise.sets} sets × {exercise.reps}
                    </span>
                  </div>
                </div>

                {exercise.muscle && (
                  <span style={{
                    fontSize: '10px',
                    color: 'var(--text-muted)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    padding: '2px 8px',
                    borderRadius: '6px'
                  }}>
                    {exercise.muscle.split(',')[0]}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Large CTA: Start Workout */}
        <div style={{ marginTop: '10px' }}>
          <button 
            className="btn-primary" 
            id="btn-modal-start-workout"
            onClick={() => {
              sounds.repSuccess();
              onStartWorkout(workout);
            }}
          >
            <Play size={18} fill="#030816" />
            Start Workout
          </button>
        </div>
      </div>
    </div>
  );
}
