import React, { useState, useMemo } from 'react';
import { Search, Flame, Clock, Play, Dumbbell, Filter, Star, Sparkles } from 'lucide-react';
import { WORKOUTS } from '../../data/mockData';
import { sounds } from '../../utils/audio';

const CATEGORIES = ["All", "Strength", "Cardio", "Full Body", "Flexibility", "Home", "Core"];
const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced"];

export default function WorkoutsScreen({ onSelectWorkout, onStartDirectly }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  const filteredWorkouts = useMemo(() => {
    return WORKOUTS.filter(workout => {
      const matchesSearch = 
        workout.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workout.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workout.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === "All" || workout.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === "All" || workout.level === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  return (
    <div className="screen-content" id="screen-workouts">
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
          Workouts
        </h2>
        <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
          Find the right workout for you.
        </p>
      </div>

      {/* Search Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'var(--bg-card)',
        borderRadius: '16px',
        padding: '12px 16px',
        border: '1px solid var(--border-subtle)',
        gap: '10px'
      }}>
        <Search size={18} color="var(--text-muted)" />
        <input 
          type="text"
          placeholder="Search workouts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#fff',
            fontSize: '14px',
            outline: 'none',
            width: '100%',
            fontFamily: 'var(--font-body)'
          }}
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '12px' }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Category Chips */}
      <div>
        <div className="chip-row">
          {CATEGORIES.map(category => (
            <button
              key={category}
              className={`category-chip ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => {
                sounds.click();
                setSelectedCategory(category);
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty Filter Chips */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Level:
        </span>
        {DIFFICULTIES.map(diff => (
          <button
            key={diff}
            onClick={() => {
              sounds.click();
              setSelectedDifficulty(diff);
            }}
            style={{
              background: selectedDifficulty === diff ? 'rgba(0, 210, 255, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              border: selectedDifficulty === diff ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
              color: selectedDifficulty === diff ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              borderRadius: '8px',
              padding: '4px 10px',
              fontSize: '11.5px',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {diff}
          </button>
        ))}
      </div>

      {/* Workout Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '4px' }}>
        {filteredWorkouts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-muted)' }}>
            <p>No workouts found matching filters.</p>
          </div>
        ) : (
          filteredWorkouts.map((workout) => (
            <div
              key={workout.id}
              className="nexus-card interactive"
              id={`card-workout-${workout.id}`}
              onClick={() => {
                sounds.click();
                onSelectWorkout(workout);
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                padding: '16px',
                border: workout.featured ? '1px solid var(--border-cyan)' : '1px solid var(--border-subtle)',
                background: workout.bannerGradient || 'var(--bg-card)'
              }}
            >
              {/* Card Top Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: 'rgba(0, 210, 255, 0.15)',
                    color: 'var(--accent-cyan)',
                    border: '1px solid rgba(0, 210, 255, 0.25)'
                  }}>
                    {workout.category}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: workout.level === 'Advanced' ? 'var(--accent-orange)' : 'var(--text-secondary)'
                  }}>
                    {workout.level}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#fbbf24' }}>
                  <Star size={13} fill="#fbbf24" />
                  <span style={{ fontWeight: 700 }}>{workout.rating}</span>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>
                  {workout.title}
                </h3>
                <p style={{
                  fontSize: '12.5px',
                  color: 'var(--text-secondary)',
                  marginTop: '4px',
                  lineHeight: '1.4',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {workout.description}
                </p>
              </div>

              {/* Workout Details Pill Row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '8px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} color="var(--accent-cyan)" />
                    {workout.duration} min
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Flame size={14} color="var(--accent-orange)" />
                    ~{workout.calories} kcal
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Dumbbell size={14} color="var(--accent-neon)" />
                    {workout.exercises?.length || 4} exercises
                  </span>
                </div>

                <button
                  className="icon-btn"
                  style={{ width: '32px', height: '32px', borderRadius: '10px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    sounds.click();
                    onStartDirectly(workout);
                  }}
                  title="Start Immediately"
                >
                  <Play size={13} fill="var(--accent-cyan)" color="var(--accent-cyan)" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
