// FitNexus Arena & Gallery Data

// Mock users that can be discovered and challenged
export const MOCK_USERS = [
  {
    id: 'user-rahul',
    name: 'Rahul Sharma',
    avatar: null,
    level: 'Intermediate',
    preferredActivity: 'Running',
    goal: 'Endurance',
    wins: 12,
    losses: 5,
    challenges: 17,
    draws: 0,
    emoji: '🏃'
  },
  {
    id: 'user-priya',
    name: 'Priya Kapoor',
    avatar: null,
    level: 'Advanced',
    preferredActivity: 'Cycling',
    goal: 'Athletic Agility',
    wins: 21,
    losses: 3,
    challenges: 25,
    draws: 1,
    emoji: '🚴'
  },
  {
    id: 'user-arjun',
    name: 'Arjun Mehta',
    avatar: null,
    level: 'Beginner',
    preferredActivity: 'Push-ups',
    goal: 'Build Muscle',
    wins: 4,
    losses: 6,
    challenges: 11,
    draws: 1,
    emoji: '💪'
  },
  {
    id: 'user-sneha',
    name: 'Sneha Joshi',
    avatar: null,
    level: 'Advanced',
    preferredActivity: 'Plank',
    goal: 'Core Strength',
    wins: 18,
    losses: 4,
    challenges: 22,
    draws: 0,
    emoji: '🧘'
  },
  {
    id: 'user-karan',
    name: 'Karan Singh',
    avatar: null,
    level: 'Intermediate',
    preferredActivity: 'Squats',
    goal: 'Build Muscle',
    wins: 9,
    losses: 7,
    challenges: 16,
    draws: 0,
    emoji: '🏋️'
  }
];

// Activity options for creating challenges
export const CHALLENGE_ACTIVITIES = [
  { value: 'running', label: '🏃 Running', defaultType: 'best_time' },
  { value: 'push_ups', label: '💪 Push-ups', defaultType: 'highest_reps' },
  { value: 'squats', label: '🦵 Squats', defaultType: 'highest_reps' },
  { value: 'cycling', label: '🚴 Cycling', defaultType: 'highest_distance' },
  { value: 'plank', label: '🧘 Plank', defaultType: 'longest_duration' },
  { value: 'sit_ups', label: '🔄 Sit-ups', defaultType: 'highest_reps' },
  { value: 'jumping', label: '⚡ Jump Rope', defaultType: 'highest_reps' },
  { value: 'swimming', label: '🏊 Swimming', defaultType: 'highest_distance' }
];

// Competition types
export const COMPETITION_TYPES = [
  { value: 'best_time', label: '⏱️ Best Time', desc: 'Lowest time wins', format: 'time' },
  { value: 'highest_reps', label: '🔢 Highest Repetitions', desc: 'Most reps wins', format: 'reps' },
  { value: 'longest_duration', label: '⏳ Longest Duration', desc: 'Longest time wins', format: 'duration' },
  { value: 'highest_distance', label: '📏 Highest Distance', desc: 'Greatest distance wins', format: 'distance' }
];

// Duration options
export const CHALLENGE_DURATIONS = [
  { value: 1, label: '1 Day' },
  { value: 3, label: '3 Days' },
  { value: 7, label: '7 Days' }
];

// Activity type gallery options
export const ACTIVITY_GALLERY_OPTIONS = [
  { value: 'running', label: '🏃 Running' },
  { value: 'gym', label: '🏋️ Gym' },
  { value: 'cycling', label: '🚴 Cycling' },
  { value: 'sports', label: '⚽ Sports' },
  { value: 'yoga', label: '🧘 Yoga' },
  { value: 'progress', label: '📈 Progress' },
  { value: 'achievement', label: '🏆 Achievement' },
  { value: 'other', label: '✨ Other' }
];

/**
 * Calculate winner based on competition type and submitted results
 * Returns 'challenger' | 'opponent' | 'draw' | null
 */
export function calculateWinner(challenge) {
  const { competitionType, challengerResult, opponentResult } = challenge;
  if (!challengerResult || !opponentResult) return null;

  const cr = parseResultToNumber(challengerResult, competitionType);
  const or = parseResultToNumber(opponentResult, competitionType);

  if (cr === null || or === null) return null;
  if (cr === or) return 'draw';

  switch (competitionType) {
    case 'best_time':
      return cr < or ? 'challenger' : 'opponent';
    case 'highest_reps':
    case 'highest_distance':
    case 'longest_duration':
      return cr > or ? 'challenger' : 'opponent';
    default:
      return null;
  }
}

/**
 * Parse a result string to a comparable number based on competition type
 */
export function parseResultToNumber(result, competitionType) {
  if (!result) return null;

  if (competitionType === 'highest_reps') {
    const n = parseInt(result, 10);
    return isNaN(n) || n < 0 ? null : n;
  }

  if (competitionType === 'highest_distance') {
    const n = parseFloat(result);
    return isNaN(n) || n < 0 ? null : n;
  }

  if (competitionType === 'best_time' || competitionType === 'longest_duration') {
    const parts = result.split(':').map(Number);
    if (parts.some(isNaN)) return null;
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return null;
  }

  return null;
}

/**
 * Validate a result string based on competition type
 * Returns { valid: boolean, error: string }
 */
export function validateResult(result, competitionType) {
  if (!result || result.trim() === '') {
    return { valid: false, error: 'Please enter a result.' };
  }

  if (competitionType === 'highest_reps') {
    const n = parseInt(result, 10);
    if (isNaN(n) || n <= 0 || !Number.isInteger(n)) {
      return { valid: false, error: 'Please enter a positive whole number (e.g., 50).' };
    }
    return { valid: true, error: '' };
  }

  if (competitionType === 'highest_distance') {
    const n = parseFloat(result);
    if (isNaN(n) || n <= 0) {
      return { valid: false, error: 'Please enter a positive distance in km (e.g., 5.2).' };
    }
    return { valid: true, error: '' };
  }

  if (competitionType === 'best_time' || competitionType === 'longest_duration') {
    const pattern = /^\d{2}:\d{2}:\d{2}$/;
    if (!pattern.test(result.trim())) {
      return { valid: false, error: 'Please use format HH:MM:SS (e.g., 00:26:42).' };
    }
    const parts = result.trim().split(':').map(Number);
    if (parts[1] >= 60 || parts[2] >= 60) {
      return { valid: false, error: 'Invalid time — minutes/seconds must be 0-59.' };
    }
    return { valid: true, error: '' };
  }

  return { valid: false, error: 'Unknown competition type.' };
}

/**
 * Format a result for display
 */
export function formatResultDisplay(result, competitionType) {
  if (!result) return '—';
  if (competitionType === 'highest_reps') return `${result} reps`;
  if (competitionType === 'highest_distance') return `${result} km`;
  return result;
}

/**
 * Get result input placeholder based on type
 */
export function getResultPlaceholder(competitionType) {
  switch (competitionType) {
    case 'best_time': return '00:26:42';
    case 'longest_duration': return '00:03:15';
    case 'highest_reps': return '50';
    case 'highest_distance': return '5.2';
    default: return '';
  }
}

/**
 * Get result input hint/label
 */
export function getResultHint(competitionType) {
  switch (competitionType) {
    case 'best_time': return 'Format: HH:MM:SS (lower is better)';
    case 'longest_duration': return 'Format: HH:MM:SS (higher is better)';
    case 'highest_reps': return 'Enter total repetitions (whole number)';
    case 'highest_distance': return 'Enter distance in km (e.g., 5.2)';
    default: return '';
  }
}

// localStorage keys
export const LS_GALLERY_KEY = 'fitnexus_gallery_posts';
export const LS_CHALLENGES_KEY = 'fitnexus_challenges';
export const LS_USER_STATS_KEY = 'fitnexus_user_stats';

// Persist helpers
export function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or unavailable - fail silently
  }
}

// Mock gallery posts for discovered users (pre-seeded for demo richness)
export const MOCK_GALLERY_POSTS = {
  'user-rahul': [
    {
      id: 'rg-1',
      userId: 'user-rahul',
      imageColor: '#1a3a5c',
      imageEmoji: '🏃',
      caption: 'Completed my 10K run in 52 mins! Personal best! 🔥',
      activity: 'running',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: 'rg-2',
      userId: 'user-rahul',
      imageColor: '#1a2a3c',
      imageEmoji: '🏋️',
      caption: 'Leg day never skipped 💪',
      activity: 'gym',
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
    }
  ],
  'user-priya': [
    {
      id: 'pg-1',
      userId: 'user-priya',
      imageColor: '#2a1a4c',
      imageEmoji: '🚴',
      caption: 'Sunday cycling — 35 km done! 🔥',
      activity: 'cycling',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ],
  'user-arjun': [
    {
      id: 'ag-1',
      userId: 'user-arjun',
      imageColor: '#1c3020',
      imageEmoji: '💪',
      caption: '100 push-ups challenge done! New milestone.',
      activity: 'gym',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
    }
  ],
  'user-sneha': [
    {
      id: 'sg-1',
      userId: 'user-sneha',
      imageColor: '#2c1a3c',
      imageEmoji: '🧘',
      caption: 'Morning yoga flow before sunrise 🌅',
      activity: 'yoga',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'sg-2',
      userId: 'user-sneha',
      imageColor: '#1a3a4c',
      imageEmoji: '🏆',
      caption: 'Plank hold: 5 minutes straight! New PR!',
      activity: 'achievement',
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
    }
  ],
  'user-karan': []
};
