import React, { useState } from 'react';
import {
  Trophy, Swords, Users, Clock, Check, X, ChevronLeft,
  Send, Medal, Flame, Star, Camera, Upload, AlertCircle, CheckCircle2
} from 'lucide-react';
import {
  MOCK_USERS,
  CHALLENGE_ACTIVITIES,
  COMPETITION_TYPES,
  CHALLENGE_DURATIONS,
  MOCK_GALLERY_POSTS,
  calculateWinner,
  validateResult,
  formatResultDisplay,
  getResultPlaceholder,
  getResultHint
} from '../../data/arenaData';
import FitnessGallery from '../common/FitnessGallery';
import { sounds } from '../../utils/audio';

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

const CURRENT_USER_ID = 'me';
const CURRENT_USER_NAME = 'Ayush';

function getUserById(id, currentUser) {
  if (id === CURRENT_USER_ID) {
    return {
      id: CURRENT_USER_ID,
      name: currentUser?.name || CURRENT_USER_NAME,
      level: currentUser?.level || 'Intermediate',
      preferredActivity: currentUser?.preferredWorkout || 'Strength Training',
      emoji: '⚡'
    };
  }
  return MOCK_USERS.find(u => u.id === id);
}

function getActivityLabel(value) {
  const a = CHALLENGE_ACTIVITIES.find(a => a.value === value);
  return a ? a.label : value;
}

function getCompetitionLabel(value) {
  const c = COMPETITION_TYPES.find(c => c.value === value);
  return c ? c.label : value;
}

function getLevelColor(level) {
  switch (level) {
    case 'Advanced': return '#f59e0b';
    case 'Intermediate': return '#00d2ff';
    case 'Beginner': return '#10b981';
    default: return '#94a3b8';
  }
}

function daysLeft(challenge) {
  if (!challenge.endDate) return 0;
  const diff = new Date(challenge.endDate) - Date.now();
  return Math.max(0, Math.ceil(diff / 86400000));
}

function getStatusBadge(status) {
  switch (status) {
    case 'pending': return { label: 'Pending', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' };
    case 'accepted': return { label: 'Accepted', color: '#10b981', bg: 'rgba(16,185,129,0.12)' };
    case 'active': return { label: 'Active', color: '#00d2ff', bg: 'rgba(0,210,255,0.12)' };
    case 'completed': return { label: 'Completed', color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' };
    case 'declined': return { label: 'Declined', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' };
    case 'expired': return { label: 'Expired', color: '#64748b', bg: 'rgba(100,116,139,0.12)' };
    case 'incomplete': return { label: 'Incomplete', color: '#64748b', bg: 'rgba(100,116,139,0.12)' };
    default: return { label: status, color: '#94a3b8', bg: 'rgba(148,163,184,0.08)' };
  }
}

// ─────────────────────────────────────────────
// UserCard – for Discover People tab
// ─────────────────────────────────────────────

function UserCard({ user, onViewProfile }) {
  return (
    <div
      className="nexus-card interactive"
      onClick={onViewProfile}
      style={{ padding: '16px' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Avatar */}
        <div style={{
          width: '54px',
          height: '54px',
          borderRadius: '16px',
          background: `linear-gradient(135deg, #1a3a5c, #070e1c)`,
          border: '2px solid var(--border-cyan)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          flexShrink: 0,
          boxShadow: '0 0 15px rgba(0,210,255,0.18)'
        }}>
          {user.emoji || '👤'}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>
            {user.name}
          </h4>
          <span style={{
            fontSize: '11.5px',
            fontWeight: 700,
            color: getLevelColor(user.level),
            background: `${getLevelColor(user.level)}18`,
            padding: '2px 8px',
            borderRadius: '99px',
            border: `1px solid ${getLevelColor(user.level)}33`
          }}>
            {user.level}
          </span>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {user.emoji} {user.preferredActivity}
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
          <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 700 }}>
            🏆 {user.wins} Wins
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
            ⚔️ {user.challenges}
          </span>
        </div>
      </div>

      <button
        className="btn-secondary"
        style={{ width: '100%', marginTop: '12px', fontSize: '13px', padding: '10px' }}
        onClick={(e) => { e.stopPropagation(); onViewProfile(); }}
      >
        View Profile
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// UserProfileModal – opens another user's profile
// ─────────────────────────────────────────────

function UserProfileModal({ user, currentUser, galleryPosts, onClose, onChallenge, challenges }) {
  // Check for duplicate active challenge
  const activeConflict = challenges?.some(c =>
    (c.challengerId === CURRENT_USER_ID && c.opponentId === user.id ||
      c.challengerId === user.id && c.opponentId === CURRENT_USER_ID) &&
    ['pending', 'accepted', 'active'].includes(c.status)
  );

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      zIndex: 90,
      background: 'var(--bg-primary)',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      animation: 'fadeIn 0.25s ease-out'
    }}>
      {/* Back button */}
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button className="icon-btn" onClick={onClose}><ChevronLeft size={20} /></button>
        <span style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>Fitness Profile</span>
      </div>

      {/* Profile Card */}
      <div style={{ padding: '0 18px', display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '32px' }}>
        <div
          className="nexus-card glow-border"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: '24px 16px',
            background: 'radial-gradient(circle at 50% 30%, rgba(0,210,255,0.12) 0%, rgba(10,20,40,0.95) 75%)'
          }}
        >
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #1a3a5c, #070e1c)',
            border: '2.5px solid var(--accent-cyan)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '36px',
            marginBottom: '14px',
            boxShadow: '0 0 25px rgba(0,210,255,0.35)'
          }}>
            {user.emoji || '👤'}
          </div>

          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff' }}>{user.name}</h2>
          <span style={{
            display: 'inline-block',
            marginTop: '6px',
            fontSize: '12px',
            fontWeight: 700,
            color: getLevelColor(user.level),
            background: `${getLevelColor(user.level)}18`,
            padding: '3px 12px',
            borderRadius: '99px',
            border: `1px solid ${getLevelColor(user.level)}33`
          }}>
            {user.level} Fitness Level
          </span>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px' }}>
            {user.emoji} {user.preferredActivity} • {user.goal}
          </p>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px', width: '100%', justifyContent: 'center' }}>
            {[
              { icon: '🏆', val: user.wins, lbl: 'Wins', color: '#f59e0b' },
              { icon: '❌', val: user.losses, lbl: 'Losses', color: '#ef4444' },
              { icon: '⚔️', val: user.challenges, lbl: 'Challenges', color: '#00d2ff' }
            ].map(s => (
              <div key={s.lbl} style={{
                flex: 1,
                background: 'rgba(255,255,255,0.04)',
                borderRadius: '12px',
                padding: '10px 6px',
                border: '1px solid var(--border-subtle)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '18px', marginBottom: '2px' }}>{s.icon}</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Challenge Button */}
        {activeConflict ? (
          <div style={{
            padding: '12px 16px',
            borderRadius: '12px',
            background: 'rgba(245,158,11,0.1)',
            border: '1px solid rgba(245,158,11,0.3)',
            textAlign: 'center',
            fontSize: '13px',
            color: '#f59e0b',
            fontWeight: 600
          }}>
            ⚔️ You already have an active challenge with {user.name}
          </div>
        ) : (
          <button
            className="btn-primary"
            onClick={onChallenge}
            style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)', boxShadow: '0 6px 20px rgba(245,158,11,0.35)' }}
          >
            <Trophy size={18} />
            Challenge {user.name}
          </button>
        )}

        {/* Fitness Gallery */}
        <FitnessGallery
          posts={galleryPosts || []}
          ownerId={user.id}
          viewerId={CURRENT_USER_ID}
          onAdd={() => {}}
          onDelete={() => {}}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// CreateChallengeModal
// ─────────────────────────────────────────────

function CreateChallengeModal({ opponent, currentUser, onClose, onSend, existingChallenges }) {
  const [activity, setActivity] = useState('running');
  const [competitionType, setCompetitionType] = useState('best_time');
  const [duration, setDuration] = useState(3);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Auto-update competition type when activity changes
  const handleActivityChange = (val) => {
    setActivity(val);
    const act = CHALLENGE_ACTIVITIES.find(a => a.value === val);
    if (act) setCompetitionType(act.defaultType);
  };

  const handleSend = () => {
    setError('');
    // Prevent self-challenge (redundant guard)
    if (opponent.id === CURRENT_USER_ID) {
      setError('You cannot challenge yourself.');
      return;
    }

    const endDate = new Date(Date.now() + duration * 86400000).toISOString();
    const newChallenge = {
      id: `ch-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      challengerId: CURRENT_USER_ID,
      challengerName: currentUser?.name || CURRENT_USER_NAME,
      opponentId: opponent.id,
      opponentName: opponent.name,
      activity,
      competitionType,
      duration,
      message: message.trim(),
      status: 'pending',
      challengerResult: null,
      opponentResult: null,
      winnerId: null,
      createdAt: new Date().toISOString(),
      endDate,
      updatedAt: new Date().toISOString()
    };

    sounds.repSuccess?.();
    onSend(newChallenge);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-sheet" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '90%' }}>
        <div className="modal-grabber" />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <h3 style={{ fontSize: '18px', color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            🏆 Create Challenge
          </h3>
          <button className="icon-btn" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Opponent */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px',
          background: 'rgba(0,210,255,0.06)',
          borderRadius: '12px',
          border: '1px solid var(--border-cyan)'
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #1a3a5c, #070e1c)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            border: '1.5px solid var(--border-cyan)'
          }}>
            {opponent.emoji || '👤'}
          </div>
          <div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>OPPONENT</p>
            <p style={{ fontSize: '15px', color: '#fff', fontWeight: 700 }}>{opponent.name}</p>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{opponent.level} • {opponent.preferredActivity}</p>
          </div>
        </div>

        {/* Activity */}
        <div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>ACTIVITY</p>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {CHALLENGE_ACTIVITIES.map(act => (
              <button
                key={act.value}
                onClick={() => handleActivityChange(act.value)}
                style={{
                  padding: '7px 12px',
                  borderRadius: '99px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  border: activity === act.value ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                  background: activity === act.value ? 'rgba(0,210,255,0.15)' : 'rgba(255,255,255,0.04)',
                  color: activity === act.value ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                {act.label}
              </button>
            ))}
          </div>
        </div>

        {/* Competition Type */}
        <div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>COMPETITION TYPE</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {COMPETITION_TYPES.map(ct => (
              <div
                key={ct.value}
                onClick={() => setCompetitionType(ct.value)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: competitionType === ct.value ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                  background: competitionType === ct.value ? 'rgba(0,210,255,0.1)' : 'rgba(255,255,255,0.03)',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  border: `2px solid ${competitionType === ct.value ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
                  background: competitionType === ct.value ? 'var(--accent-cyan)' : 'transparent',
                  transition: 'all 0.15s',
                  flexShrink: 0
                }} />
                <div>
                  <p style={{ fontSize: '13.5px', color: '#fff', fontWeight: 600 }}>{ct.label}</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{ct.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>DURATION</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            {CHALLENGE_DURATIONS.map(d => (
              <button
                key={d.value}
                onClick={() => setDuration(d.value)}
                style={{
                  flex: 1,
                  padding: '10px 8px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: 700,
                  border: duration === d.value ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                  background: duration === d.value ? 'rgba(0,210,255,0.15)' : 'rgba(255,255,255,0.04)',
                  color: duration === d.value ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Message */}
        <div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>
            MESSAGE (optional)
          </p>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Let's see who's better! 🔥"
            maxLength={150}
            rows={2}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '10px 14px',
              color: '#fff',
              fontSize: '13.5px',
              fontFamily: 'var(--font-body)',
              resize: 'none',
              outline: 'none'
            }}
          />
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-red)', fontSize: '13px' }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <button className="btn-primary" onClick={handleSend} style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)', boxShadow: '0 6px 20px rgba(245,158,11,0.35)' }}>
          <Send size={18} />
          Send Challenge
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ChallengeCard – used in My, Received, Active tabs
// ─────────────────────────────────────────────

function ChallengeCard({ challenge, currentUser, onAccept, onDecline, onSubmitResult, onViewDetail }) {
  const isChallenger = challenge.challengerId === CURRENT_USER_ID;
  const opponentName = isChallenger ? challenge.opponentName : challenge.challengerName;
  const myResult = isChallenger ? challenge.challengerResult : challenge.opponentResult;
  const theirResult = isChallenger ? challenge.opponentResult : challenge.challengerResult;

  const statusBadge = getStatusBadge(challenge.status);
  const dl = daysLeft(challenge);

  const winner = challenge.winnerId;
  const iWon = (winner === 'challenger' && isChallenger) || (winner === 'opponent' && !isChallenger);
  const isDraw = winner === 'draw';
  const iLost = winner && !iWon && !isDraw;

  return (
    <div className="nexus-card" style={{ padding: '16px' }} onClick={onViewDetail}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '16px' }}>{getActivityLabel(challenge.activity)?.split(' ')[0]}</span>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>
              {getActivityLabel(challenge.activity)?.split(' ').slice(1).join(' ')} Challenge
            </h4>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {getCompetitionLabel(challenge.competitionType)}
          </p>
        </div>
        <span style={{
          fontSize: '11px',
          fontWeight: 700,
          padding: '3px 10px',
          borderRadius: '99px',
          background: statusBadge.bg,
          color: statusBadge.color
        }}>
          {statusBadge.label}
        </span>
      </div>

      {/* VS line */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <span style={{ fontSize: '13px', color: 'var(--accent-cyan)', fontWeight: 700 }}>
          {currentUser?.name || CURRENT_USER_NAME}
        </span>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 800, background: 'rgba(255,255,255,0.06)', padding: '2px 7px', borderRadius: '6px' }}>VS</span>
        <span style={{ fontSize: '13px', color: '#fff', fontWeight: 700 }}>{opponentName}</span>
      </div>

      {/* Result display for active/completed */}
      {['active', 'completed', 'incomplete'].includes(challenge.status) && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
          <div style={{
            flex: 1, padding: '8px', borderRadius: '10px',
            background: myResult ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.04)',
            border: myResult ? '1px solid rgba(16,185,129,0.3)' : '1px solid var(--border-subtle)'
          }}>
            <p style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: 600 }}>YOU</p>
            <p style={{ fontSize: '13px', color: myResult ? '#10b981' : 'var(--text-muted)', fontWeight: 700 }}>
              {myResult ? formatResultDisplay(myResult, challenge.competitionType) : 'Not Submitted'}
            </p>
          </div>
          <div style={{
            flex: 1, padding: '8px', borderRadius: '10px',
            background: theirResult ? 'rgba(0,210,255,0.08)' : 'rgba(255,255,255,0.04)',
            border: theirResult ? '1px solid rgba(0,210,255,0.2)' : '1px solid var(--border-subtle)'
          }}>
            <p style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: 600 }}>OPPONENT</p>
            <p style={{ fontSize: '13px', color: theirResult ? 'var(--accent-cyan)' : 'var(--text-muted)', fontWeight: 700 }}>
              {theirResult ? formatResultDisplay(theirResult, challenge.competitionType) : 'Not Submitted'}
            </p>
          </div>
        </div>
      )}

      {/* Completed banner */}
      {challenge.status === 'completed' && (
        <div style={{
          padding: '10px',
          borderRadius: '10px',
          background: iWon ? 'rgba(245,158,11,0.12)' : isDraw ? 'rgba(139,92,246,0.12)' : 'rgba(239,68,68,0.08)',
          border: `1px solid ${iWon ? 'rgba(245,158,11,0.3)' : isDraw ? 'rgba(139,92,246,0.3)' : 'rgba(239,68,68,0.2)'}`,
          textAlign: 'center',
          fontSize: '14px',
          fontWeight: 700,
          color: iWon ? '#f59e0b' : isDraw ? '#8b5cf6' : '#ef4444',
          marginBottom: '8px'
        }}>
          {iWon ? '🏆 YOU WON!' : isDraw ? '🤝 DRAW' : '❌ CHALLENGE LOST'}
        </div>
      )}

      {/* Time remaining for active */}
      {challenge.status === 'active' && (
        <p style={{ fontSize: '12px', color: dl <= 1 ? 'var(--accent-red)' : 'var(--text-muted)', marginBottom: '8px' }}>
          <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
          {dl === 0 ? 'Ends today!' : `${dl} day${dl !== 1 ? 's' : ''} remaining`}
        </p>
      )}

      {/* Message */}
      {challenge.message && challenge.status === 'pending' && (
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '8px' }}>
          "{challenge.message}"
        </p>
      )}

      {/* Action buttons */}
      {challenge.status === 'pending' && !isChallenger && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
          <button
            className="btn-primary"
            style={{ flex: 1, padding: '10px', fontSize: '13px', background: 'linear-gradient(135deg, #10b981, #059669)' }}
            onClick={(e) => { e.stopPropagation(); onAccept(); }}
          >
            <Check size={16} /> Accept
          </button>
          <button
            className="btn-secondary"
            style={{ flex: 1, padding: '10px', fontSize: '13px', color: 'var(--accent-red)', borderColor: 'rgba(239,68,68,0.3)' }}
            onClick={(e) => { e.stopPropagation(); onDecline(); }}
          >
            <X size={16} /> Decline
          </button>
        </div>
      )}

      {challenge.status === 'active' && !myResult && (
        <button
          className="btn-primary"
          style={{ width: '100%', padding: '10px', fontSize: '13px', marginTop: '4px' }}
          onClick={(e) => { e.stopPropagation(); onSubmitResult(); }}
        >
          <Send size={16} /> Submit Result
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// SubmitResultModal
// ─────────────────────────────────────────────

function SubmitResultModal({ challenge, currentUser, onClose, onSubmit }) {
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');
    const { valid, error: err } = validateResult(result, challenge.competitionType);
    if (!valid) { setError(err); return; }
    sounds.repSuccess?.();
    onSubmit(challenge.id, result.trim());
    onClose();
  };

  const isChallenger = challenge.challengerId === CURRENT_USER_ID;
  const myPrevResult = isChallenger ? challenge.challengerResult : challenge.opponentResult;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-grabber" />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '18px', color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            {getActivityLabel(challenge.activity)?.split(' ')[0]} Submit Result
          </h3>
          <button className="icon-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <div style={{ padding: '12px', background: 'rgba(0,210,255,0.06)', borderRadius: '12px', border: '1px solid var(--border-cyan)' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>CHALLENGE</p>
          <p style={{ fontSize: '14px', color: '#fff', fontWeight: 700 }}>
            {getActivityLabel(challenge.activity)} — {getCompetitionLabel(challenge.competitionType)}
          </p>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            vs {isChallenger ? challenge.opponentName : challenge.challengerName}
          </p>
        </div>

        {myPrevResult ? (
          <div style={{ padding: '12px', background: 'rgba(245,158,11,0.08)', borderRadius: '12px', border: '1px solid rgba(245,158,11,0.3)' }}>
            <p style={{ fontSize: '13px', color: '#f59e0b', fontWeight: 600 }}>
              ⚠️ You already submitted: {formatResultDisplay(myPrevResult, challenge.competitionType)}
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Submitting again will overwrite your previous result.
            </p>
          </div>
        ) : null}

        <div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>
            YOUR RESULT — {getCompetitionLabel(challenge.competitionType)}
          </p>
          <input
            type={challenge.competitionType === 'highest_reps' || challenge.competitionType === 'highest_distance' ? 'number' : 'text'}
            value={result}
            onChange={(e) => setResult(e.target.value)}
            placeholder={getResultPlaceholder(challenge.competitionType)}
            min={0}
            step={challenge.competitionType === 'highest_distance' ? '0.1' : '1'}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.06)',
              border: error ? '1.5px solid var(--accent-red)' : '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '14px 16px',
              color: '#fff',
              fontSize: '22px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              textAlign: 'center',
              outline: 'none',
              letterSpacing: '0.05em'
            }}
          />
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px', textAlign: 'center' }}>
            {getResultHint(challenge.competitionType)}
          </p>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-red)', fontSize: '13px', padding: '10px', background: 'rgba(239,68,68,0.08)', borderRadius: '10px' }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <button className="btn-primary" onClick={handleSubmit}>
          <CheckCircle2 size={18} />
          Submit Result
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ChallengeDetailModal
// ─────────────────────────────────────────────

function ChallengeDetailModal({ challenge, currentUser, onClose }) {
  const isChallenger = challenge.challengerId === CURRENT_USER_ID;
  const opponentName = isChallenger ? challenge.opponentName : challenge.challengerName;
  const myResult = isChallenger ? challenge.challengerResult : challenge.opponentResult;
  const theirResult = isChallenger ? challenge.opponentResult : challenge.challengerResult;

  const winner = challenge.winnerId;
  const iWon = (winner === 'challenger' && isChallenger) || (winner === 'opponent' && !isChallenger);
  const isDraw = winner === 'draw';
  const iLost = winner && !iWon && !isDraw;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-sheet" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '90%' }}>
        <div className="modal-grabber" />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '18px', color: '#fff', fontWeight: 700 }}>
            {getActivityLabel(challenge.activity)} Challenge
          </h3>
          <button className="icon-btn" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Status */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <span style={{
            ...getStatusBadge(challenge.status),
            fontSize: '13px',
            fontWeight: 700,
            padding: '5px 16px',
            borderRadius: '99px',
            background: getStatusBadge(challenge.status).bg,
            color: getStatusBadge(challenge.status).color
          }}>
            {getStatusBadge(challenge.status).label}
          </span>
        </div>

        {/* Completed result banner */}
        {challenge.status === 'completed' && (
          <div style={{
            padding: '18px',
            borderRadius: '16px',
            background: iWon ? 'rgba(245,158,11,0.12)' : isDraw ? 'rgba(139,92,246,0.12)' : 'rgba(239,68,68,0.08)',
            border: `1.5px solid ${iWon ? 'rgba(245,158,11,0.4)' : isDraw ? 'rgba(139,92,246,0.4)' : 'rgba(239,68,68,0.3)'}`,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>
              {iWon ? '🏆' : isDraw ? '🤝' : '❌'}
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: iWon ? '#f59e0b' : isDraw ? '#8b5cf6' : '#ef4444' }}>
              {iWon ? 'YOU WON!' : isDraw ? 'DRAW' : 'CHALLENGE LOST'}
            </h3>
            {isDraw && <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px' }}>Both participants achieved identical results.</p>}
          </div>
        )}

        {/* Score comparison */}
        {['active', 'completed', 'incomplete'].includes(challenge.status) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              flex: 1, textAlign: 'center', padding: '14px', borderRadius: '12px',
              background: iWon && challenge.status === 'completed' ? 'rgba(245,158,11,0.12)' : 'rgba(0,210,255,0.08)',
              border: `1px solid ${iWon && challenge.status === 'completed' ? 'rgba(245,158,11,0.3)' : 'var(--border-cyan)'}`
            }}>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>
                {currentUser?.name || CURRENT_USER_NAME}
              </p>
              <p style={{ fontSize: '18px', fontWeight: 800, color: myResult ? (iWon && challenge.status === 'completed' ? '#f59e0b' : 'var(--accent-cyan)') : 'var(--text-muted)' }}>
                {myResult ? formatResultDisplay(myResult, challenge.competitionType) : '—'}
              </p>
            </div>
            <div style={{ color: 'var(--text-muted)', fontWeight: 800, fontSize: '13px' }}>VS</div>
            <div style={{
              flex: 1, textAlign: 'center', padding: '14px', borderRadius: '12px',
              background: iLost && challenge.status === 'completed' ? 'rgba(245,158,11,0.08)' : 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border-subtle)'
            }}>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>
                {opponentName}
              </p>
              <p style={{ fontSize: '18px', fontWeight: 800, color: theirResult ? (iLost && challenge.status === 'completed' ? '#f59e0b' : '#fff') : 'var(--text-muted)' }}>
                {theirResult ? formatResultDisplay(theirResult, challenge.competitionType) : '—'}
              </p>
            </div>
          </div>
        )}

        {/* Challenge details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { label: 'Activity', value: getActivityLabel(challenge.activity) },
            { label: 'Competition', value: getCompetitionLabel(challenge.competitionType) },
            { label: 'Duration', value: `${challenge.duration} Day${challenge.duration !== 1 ? 's' : ''}` },
            { label: 'Created', value: new Date(challenge.createdAt).toLocaleDateString() },
            ...(challenge.endDate ? [{ label: 'End Date', value: new Date(challenge.endDate).toLocaleDateString() }] : []),
            ...(challenge.message ? [{ label: 'Message', value: `"${challenge.message}"` }] : [])
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{row.label}</span>
              <span style={{ fontSize: '13.5px', color: '#fff', fontWeight: 600 }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN: ChallengeArenaScreen
// ─────────────────────────────────────────────

export default function ChallengeArenaScreen({
  user,
  challenges,
  galleryPosts,
  onSendChallenge,
  onRespondChallenge,
  onSubmitResult
}) {
  const [tab, setTab] = useState('discover'); // discover | my | received | active | completed
  const [selectedUser, setSelectedUser] = useState(null);
  const [challengeTarget, setChallengeTarget] = useState(null);
  const [submitTarget, setSubmitTarget] = useState(null);
  const [detailChallenge, setDetailChallenge] = useState(null);

  // Filtered challenge lists
  const myOutgoing = challenges.filter(c => c.challengerId === CURRENT_USER_ID && ['pending', 'declined'].includes(c.status));
  const received = challenges.filter(c => c.opponentId === CURRENT_USER_ID && c.status === 'pending');
  const active = challenges.filter(c =>
    (c.challengerId === CURRENT_USER_ID || c.opponentId === CURRENT_USER_ID) &&
    c.status === 'active'
  );
  const completed = challenges.filter(c =>
    (c.challengerId === CURRENT_USER_ID || c.opponentId === CURRENT_USER_ID) &&
    ['completed', 'declined', 'expired', 'incomplete'].includes(c.status)
  );

  const receivedCount = received.length;
  const activeCount = active.length;

  const TABS = [
    { id: 'discover', label: 'Discover', icon: '👥' },
    { id: 'received', label: 'Received', icon: '🔥', badge: receivedCount },
    { id: 'active', label: 'Active', icon: '⚔️', badge: activeCount },
    { id: 'my', label: 'Sent', icon: '📤' },
    { id: 'completed', label: 'History', icon: '📋' }
  ];

  return (
    <div className="screen-content" id="screen-arena" style={{ gap: '12px' }}>
      {/* Hero Header */}
      <div
        className="nexus-card glow-border"
        style={{
          padding: '18px',
          background: 'radial-gradient(circle at 30% 50%, rgba(245,158,11,0.18) 0%, rgba(10,20,40,0.95) 70%)',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}
      >
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(245,158,11,0.3), rgba(239,68,68,0.2))',
          border: '1.5px solid rgba(245,158,11,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '26px'
        }}>
          🏆
        </div>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>
            Challenge Arena
          </h2>
          <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Discover · Challenge · Compete · Win
          </p>
        </div>
        {(receivedCount > 0 || activeCount > 0) && (
          <div style={{
            marginLeft: 'auto',
            background: 'rgba(239,68,68,0.2)',
            border: '1px solid rgba(239,68,68,0.4)',
            borderRadius: '99px',
            padding: '4px 12px',
            fontSize: '12px',
            fontWeight: 700,
            color: '#ef4444'
          }}>
            {receivedCount + activeCount} pending
          </div>
        )}
      </div>

      {/* Tab Bar */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px', scrollbarWidth: 'none' }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => { sounds.click?.(); setTab(t.id); }}
            style={{
              padding: '7px 12px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              border: tab === t.id ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
              background: tab === t.id ? 'rgba(0,210,255,0.12)' : 'rgba(255,255,255,0.04)',
              color: tab === t.id ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.15s',
              position: 'relative',
              flexShrink: 0
            }}
          >
            {t.icon} {t.label}
            {t.badge > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: '#ef4444',
                color: '#fff',
                fontSize: '10px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── TAB: DISCOVER ── */}
      {tab === 'discover' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {MOCK_USERS.map(u => (
            <UserCard
              key={u.id}
              user={u}
              onViewProfile={() => { sounds.click?.(); setSelectedUser(u); }}
            />
          ))}
        </div>
      )}

      {/* ── TAB: RECEIVED ── */}
      {tab === 'received' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {received.length === 0 ? (
            <EmptyState icon="🔥" text="No pending challenge requests." />
          ) : (
            received.map(c => (
              <ChallengeCard
                key={c.id}
                challenge={c}
                currentUser={user}
                onAccept={() => { sounds.click?.(); onRespondChallenge(c.id, 'accepted'); }}
                onDecline={() => { sounds.click?.(); onRespondChallenge(c.id, 'declined'); }}
                onSubmitResult={() => setSubmitTarget(c)}
                onViewDetail={() => setDetailChallenge(c)}
              />
            ))
          )}
        </div>
      )}

      {/* ── TAB: ACTIVE ── */}
      {tab === 'active' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {active.length === 0 ? (
            <EmptyState icon="⚔️" text="No active challenges yet." hint="Accept a challenge or send one to get started!" />
          ) : (
            active.map(c => (
              <ChallengeCard
                key={c.id}
                challenge={c}
                currentUser={user}
                onAccept={() => {}}
                onDecline={() => {}}
                onSubmitResult={() => setSubmitTarget(c)}
                onViewDetail={() => setDetailChallenge(c)}
              />
            ))
          )}
        </div>
      )}

      {/* ── TAB: MY / SENT ── */}
      {tab === 'my' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {myOutgoing.length === 0 ? (
            <EmptyState icon="📤" text="No sent challenges yet." hint="Discover people and send a challenge!" />
          ) : (
            myOutgoing.map(c => (
              <ChallengeCard
                key={c.id}
                challenge={c}
                currentUser={user}
                onAccept={() => {}}
                onDecline={() => {}}
                onSubmitResult={() => {}}
                onViewDetail={() => setDetailChallenge(c)}
              />
            ))
          )}
        </div>
      )}

      {/* ── TAB: COMPLETED / HISTORY ── */}
      {tab === 'completed' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {completed.length === 0 ? (
            <EmptyState icon="📋" text="No completed challenges yet." hint="Finish a challenge to see history here." />
          ) : (
            completed.map(c => (
              <ChallengeCard
                key={c.id}
                challenge={c}
                currentUser={user}
                onAccept={() => {}}
                onDecline={() => {}}
                onSubmitResult={() => {}}
                onViewDetail={() => setDetailChallenge(c)}
              />
            ))
          )}
        </div>
      )}

      {/* ── USER PROFILE MODAL ── */}
      {selectedUser && (
        <UserProfileModal
          user={selectedUser}
          currentUser={user}
          galleryPosts={MOCK_GALLERY_POSTS[selectedUser.id] || []}
          challenges={challenges}
          onClose={() => setSelectedUser(null)}
          onChallenge={() => {
            setChallengeTarget(selectedUser);
            setSelectedUser(null);
          }}
        />
      )}

      {/* ── CREATE CHALLENGE MODAL ── */}
      {challengeTarget && (
        <CreateChallengeModal
          opponent={challengeTarget}
          currentUser={user}
          onClose={() => setChallengeTarget(null)}
          onSend={(newChallenge) => {
            onSendChallenge(newChallenge);
            setTab('my');
          }}
          existingChallenges={challenges}
        />
      )}

      {/* ── SUBMIT RESULT MODAL ── */}
      {submitTarget && (
        <SubmitResultModal
          challenge={submitTarget}
          currentUser={user}
          onClose={() => setSubmitTarget(null)}
          onSubmit={(challengeId, result) => {
            onSubmitResult(challengeId, result);
            setSubmitTarget(null);
          }}
        />
      )}

      {/* ── CHALLENGE DETAIL MODAL ── */}
      {detailChallenge && (
        <ChallengeDetailModal
          challenge={detailChallenge}
          currentUser={user}
          onClose={() => setDetailChallenge(null)}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// EmptyState helper
// ─────────────────────────────────────────────

function EmptyState({ icon, text, hint }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '36px 20px',
      color: 'var(--text-muted)',
      background: 'rgba(255,255,255,0.02)',
      borderRadius: '16px',
      border: '1px dashed var(--border-subtle)'
    }}>
      <span style={{ fontSize: '36px', display: 'block', marginBottom: '10px' }}>{icon}</span>
      <p style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-secondary)' }}>{text}</p>
      {hint && <p style={{ fontSize: '12px', marginTop: '6px', color: 'var(--text-muted)' }}>{hint}</p>}
    </div>
  );
}
