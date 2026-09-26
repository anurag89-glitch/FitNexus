import React, { useState, useEffect } from 'react';
import { 
  INITIAL_USER, 
  WORKOUTS, 
  NOTIFICATIONS as INITIAL_NOTIFICATIONS,
  INITIAL_NUTRITION
} from './data/mockData';
import {
  loadFromStorage,
  saveToStorage,
  calculateWinner,
  LS_GALLERY_KEY,
    LS_CHALLENGES_KEY,
  LS_USER_STATS_KEY
} from './data/arenaData';

// Common Components
import StatusBar from './components/common/StatusBar';
import Header from './components/common/Header';
import BottomNav from './components/common/BottomNav';
import NotificationDrawer from './components/common/NotificationDrawer';
import WearableModal from './components/common/WearableModal';

// Screens
import SplashScreen from './components/screens/SplashScreen';
import OnboardingScreen from './components/screens/OnboardingScreen';
import HomeScreen from './components/screens/HomeScreen';
import WorkoutsScreen from './components/screens/WorkoutsScreen';
import WorkoutDetailModal from './components/screens/WorkoutDetailModal';
import ActiveWorkoutScreen from './components/screens/ActiveWorkoutScreen';
import AICoachScreen from './components/screens/AICoachScreen';
import AICameraModal from './components/screens/AICameraModal';
import ProgressScreen from './components/screens/ProgressScreen';
import ProfileScreen from './components/screens/ProfileScreen';
import NutritionScreen from './components/screens/NutritionScreen';
import ChallengeArenaScreen from './components/screens/ChallengeArenaScreen';

import { sounds } from './utils/audio';

export default function App() {
  // App Phase: 'splash' | 'onboarding' | 'main'
  const [appPhase, setAppPhase] = useState('splash');
  
  // Navigation Tab: 'home' | 'workouts' | 'ai-coach' | 'arena' | 'profile'
  const [activeTab, setActiveTab] = useState('home');

  // App State
  const [user, setUser] = useState(INITIAL_USER);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [nutritionData, setNutritionData] = useState(INITIAL_NUTRITION);

  // ── NEW: Arena & Gallery State ──
  // Gallery posts for the logged-in user (persisted to localStorage)
  const [myGalleryPosts, setMyGalleryPosts] = useState(() =>
    loadFromStorage(LS_GALLERY_KEY, [])
  );
  // All challenges (persisted to localStorage)
  const [challenges, setChallenges] = useState(() =>
    loadFromStorage(LS_CHALLENGES_KEY, [])
  );
  // User arena stats: wins / losses / draws (persisted)
  const [arenaStats, setArenaStats] = useState(() =>
    loadFromStorage(LS_USER_STATS_KEY, { wins: 0, losses: 0, draws: 0 })
  );

  // Persist gallery posts on change
  useEffect(() => {
    saveToStorage(LS_GALLERY_KEY, myGalleryPosts);
  }, [myGalleryPosts]);

  // Persist challenges on change
  useEffect(() => {
    saveToStorage(LS_CHALLENGES_KEY, challenges);
  }, [challenges]);

  // Persist arena stats on change
  useEffect(() => {
    saveToStorage(LS_USER_STATS_KEY, arenaStats);
  }, [arenaStats]);

  // Modals & Active Modes
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [isWorkoutDetailOpen, setIsWorkoutDetailOpen] = useState(false);
  const [activeWorkoutSession, setActiveWorkoutSession] = useState(null);
  const [isAICameraOpen, setIsAICameraOpen] = useState(false);
  const [aiExerciseChoice, setAiExerciseChoice] = useState("Squats");
  const [isWearableOpen, setIsWearableOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isNutritionOpen, setIsNutritionOpen] = useState(false);


  // Open workout detail sheet
  const handleOpenWorkoutDetails = (workout) => {
    setSelectedWorkout(workout);
    setIsWorkoutDetailOpen(true);
  };

  // Launch active workout session
  const handleStartWorkout = (workout) => {
    setIsWorkoutDetailOpen(false);
    setActiveWorkoutSession(workout || WORKOUTS[0]);
  };

  // Workout completed callback
  const handleCompleteWorkout = ({ calories, minutes }) => {
    setActiveWorkoutSession(null);
    setUser(prev => ({
      ...prev,
      todayStats: {
        ...prev.todayStats,
        calories: prev.todayStats.calories + (calories || 220),
        workoutMinutes: prev.todayStats.workoutMinutes + (minutes || 25),
        activeMinutes: prev.todayStats.activeMinutes + (minutes || 25)
      },
      weeklyGoalCompleted: Math.min(prev.weeklyGoalTotal, prev.weeklyGoalCompleted + 1)
    }));
    setActiveTab('progress');
  };

  // Notification action handler
  const handleNotificationAction = (action) => {
    setIsNotificationsOpen(false);
    if (action === 'start_workout') {
      handleOpenWorkoutDetails(WORKOUTS[0]);
    } else if (action === 'view_progress') {
      setActiveTab('progress');
    } else if (action === 'open_wearable') {
      setIsWearableOpen(true);
    } else if (action === 'open_ai_coach') {
      setActiveTab('ai-coach');
    } else if (action === 'open_arena') {
      setActiveTab('arena');
    }
  };

  // Clear notifications
  const handleClearNotifications = () => {
    setNotifications([]);
  };

  // Wearable synced
  const handleWearableSynced = () => {
    setUser(prev => ({
      ...prev,
      lastSynced: "Just now",
      todayStats: {
        ...prev.todayStats,
        steps: prev.todayStats.steps + Math.floor(Math.random() * 40)
      }
    }));
  };

  // Reset Demo to Splash
  const handleResetDemo = () => {
    setActiveWorkoutSession(null);
    setIsAICameraOpen(false);
    setIsWearableOpen(false);
    setIsWorkoutDetailOpen(false);
    setIsNotificationsOpen(false);
    setIsNutritionOpen(false);
    setUser(INITIAL_USER);
    setNutritionData(INITIAL_NUTRITION);
    setAppPhase('splash');
  };

  // ── NEW: Gallery Handlers ──
  const handleAddGalleryPost = (post) => {
    setMyGalleryPosts(prev => [post, ...prev]);
  };

  const handleDeleteGalleryPost = (postId) => {
    setMyGalleryPosts(prev => prev.filter(p => p.id !== postId));
  };

  // ── NEW: Challenge Handlers ──
  const handleSendChallenge = (newChallenge) => {
    setChallenges(prev => [newChallenge, ...prev]);
    // Add notification
    setNotifications(prev => [{
      id: `notif-ch-${Date.now()}`,
      title: '⚔️ Challenge Sent!',
      body: `You challenged ${newChallenge.opponentName} to a ${newChallenge.activity.replace('_',' ')} competition.`,
      time: 'Just now',
      unread: true,
      action: 'open_arena'
    }, ...prev]);
  };

  const handleRespondChallenge = (challengeId, response) => {
    setChallenges(prev => prev.map(c => {
      if (c.id !== challengeId) return c;
      const updatedStatus = response === 'accepted' ? 'active' : 'declined';
      return { ...c, status: updatedStatus, updatedAt: new Date().toISOString() };
    }));
    if (response === 'accepted') {
      setNotifications(prev => [{
        id: `notif-ch-acc-${Date.now()}`,
        title: '✅ Challenge Accepted!',
        body: 'A challenge is now active. Submit your result before the deadline!',
        time: 'Just now',
        unread: true,
        action: 'open_arena'
      }, ...prev]);
    }
  };

  const handleSubmitResult = (challengeId, result) => {
    setChallenges(prev => {
      const updated = prev.map(c => {
        if (c.id !== challengeId) return c;
        const isChallenger = c.challengerId === 'me';
        const updatedChallenge = {
          ...c,
          challengerResult: isChallenger ? result : c.challengerResult,
          opponentResult: !isChallenger ? result : c.opponentResult,
          updatedAt: new Date().toISOString()
        };
        // Both results submitted → auto-calculate winner
        if (updatedChallenge.challengerResult && updatedChallenge.opponentResult) {
          const winner = calculateWinner(updatedChallenge);
          updatedChallenge.winnerId = winner;
          updatedChallenge.status = 'completed';

          // Update arena stats
          const iAmChallenger = updatedChallenge.challengerId === 'me';
          const iWon = (winner === 'challenger' && iAmChallenger) || (winner === 'opponent' && !iAmChallenger);
          const isDraw = winner === 'draw';
          setArenaStats(prevStats => ({
            wins: iWon ? prevStats.wins + 1 : prevStats.wins,
            losses: (!iWon && !isDraw) ? prevStats.losses + 1 : prevStats.losses,
            draws: isDraw ? prevStats.draws + 1 : prevStats.draws
          }));

          // Add win/loss notification
          setNotifications(notifPrev => [{
            id: `notif-ch-done-${Date.now()}`,
            title: iWon ? '🏆 Challenge Won!' : isDraw ? '🤝 Challenge Draw!' : '❌ Challenge Lost',
            body: `Your ${updatedChallenge.activity.replace('_',' ')} challenge vs ${iAmChallenger ? updatedChallenge.opponentName : updatedChallenge.challengerName} is complete.`,
            time: 'Just now',
            unread: true,
            action: 'open_arena'
          }, ...notifPrev]);
        }
        return updatedChallenge;
      });
      return updated;
    });
  };

  const unreadNotificationCount = notifications.filter(n => n.unread).length;

  return (
    <div className="app-viewport-wrapper">
      {/* Main Mobile App Shell */}
      <div className="phone-shell" id="fitnexus-mobile-app">
        {/* Status Bar */}
        <StatusBar />

        {/* Phase 1: Splash Screen */}
        {appPhase === 'splash' && (
          <SplashScreen onComplete={() => setAppPhase('onboarding')} />
        )}

        {/* Phase 2: Onboarding Screen */}
        {appPhase === 'onboarding' && (
          <OnboardingScreen onFinish={() => setAppPhase('main')} />
        )}

        {/* Phase 3: Main Application */}
        {appPhase === 'main' && (
          <>
            {/* Main Header (except during active workout or camera mode) */}
            <Header 
              user={user}
              unreadCount={unreadNotificationCount}
              onOpenNotifications={() => setIsNotificationsOpen(true)}
              onOpenWearable={() => setIsWearableOpen(true)}
              onSelectTab={setActiveTab}
            />

            {/* Screen Viewport with Vertical Scroll */}
            <main className="app-screen-container">
              {activeTab === 'home' && (
                <HomeScreen 
                  user={user}
                  nutritionData={nutritionData}
                  featuredWorkout={WORKOUTS[0]}
                  onStartWorkout={handleStartWorkout}
                  onOpenWorkoutDetails={handleOpenWorkoutDetails}
                  onSelectTab={setActiveTab}
                  onOpenWearable={() => setIsWearableOpen(true)}
                  onOpenAICoach={() => setActiveTab('ai-coach')}
                  onOpenNutrition={() => setIsNutritionOpen(true)}
                />
              )}

              {activeTab === 'workouts' && (
                <WorkoutsScreen 
                  onSelectWorkout={handleOpenWorkoutDetails}
                  onStartDirectly={handleStartWorkout}
                />
              )}

              {activeTab === 'ai-coach' && (
                <AICoachScreen 
                  onStartAIAnalysis={(ex) => {
                    setAiExerciseChoice(ex || "Squats");
                    setIsAICameraOpen(true);
                  }}
                  onStartRecommendedWorkout={() => handleStartWorkout(WORKOUTS[0])}
                />
              )}

              {activeTab === 'progress' && (
                <ProgressScreen user={user} />
              )}

              {activeTab === 'arena' && (
                <ChallengeArenaScreen
                  user={user}
                  challenges={challenges}
                  galleryPosts={myGalleryPosts}
                  onSendChallenge={handleSendChallenge}
                  onRespondChallenge={handleRespondChallenge}
                  onSubmitResult={handleSubmitResult}
                />
              )}

              {activeTab === 'profile' && (
                <ProfileScreen 
                  user={user}
                  arenaStats={arenaStats}
                  myGalleryPosts={myGalleryPosts}
                  onAddGalleryPost={handleAddGalleryPost}
                  onDeleteGalleryPost={handleDeleteGalleryPost}
                  onOpenWearable={() => setIsWearableOpen(true)}
                  onOpenNutrition={() => setIsNutritionOpen(true)}
                  onResetDemo={handleResetDemo}
                />
              )}
            </main>

            {/* Persistent Bottom Navigation */}
            <BottomNav 
              activeTab={activeTab}
              onSelectTab={setActiveTab}
            />

            {/* iOS Home Indicator Line */}
            <div className="home-indicator-bar" />
          </>
        )}

        {/* Workout Details Modal */}
        <WorkoutDetailModal 
          isOpen={isWorkoutDetailOpen}
          workout={selectedWorkout}
          onClose={() => setIsWorkoutDetailOpen(false)}
          onStartWorkout={handleStartWorkout}
        />

        {/* Active Workout Screen Modal */}
        {activeWorkoutSession && (
          <ActiveWorkoutScreen 
            workout={activeWorkoutSession}
            onClose={() => setActiveWorkoutSession(null)}
            onCompleteWorkout={handleCompleteWorkout}
            onLaunchAICamera={() => {
              setAiExerciseChoice("Squats");
              setIsAICameraOpen(true);
            }}
          />
        )}

        {/* AI Camera Vision Real-time Pose Detection Modal */}
        <AICameraModal 
          isOpen={isAICameraOpen}
          initialExercise={aiExerciseChoice}
          onClose={() => setIsAICameraOpen(false)}
        />

        {/* Nutrition / Diet Plan Full-Screen Modal */}
        {isNutritionOpen && (
          <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 60,
            background: 'var(--bg-primary)',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <NutritionScreen
              nutritionData={nutritionData}
              onUpdateNutrition={(updated) => setNutritionData(prev => ({ ...prev, ...updated }))}
              onClose={() => setIsNutritionOpen(false)}
            />
          </div>
        )}

        {/* Smartwatch / IoT Telemetry Modal */}
        <WearableModal 
          isOpen={isWearableOpen}
          user={user}
          onClose={() => setIsWearableOpen(false)}
          onSyncComplete={handleWearableSynced}
        />

        {/* Notifications Drawer */}
        <NotificationDrawer 
          isOpen={isNotificationsOpen}
          notifications={notifications}
          onClose={() => setIsNotificationsOpen(false)}
          onActionClick={handleNotificationAction}
          onClearAll={handleClearNotifications}
        />
      </div>
    </div>
  );
}
